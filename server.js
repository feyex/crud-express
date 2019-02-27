//console.log('I can do it');

const express = require('express'); // this uses express by requiring it
const bodyParser = require('body-parser') ;
const app = express();
// setting up mongodb with express
const MongoClient = require('mongodb').MongoClient
var db

MongoClient.connect('mongodb://localhost:27017/star-wars', (err, client) => {
  if (err) return console.log(err)
  db = client.db('star-wars') // whatever your database name is
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

//using embedded js as template engine  to allow displaying data from db to html
app.set('view engine', 'ejs')

//urlencoded method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object

app.use(bodyParser.urlencoded({extended: true}))

//express.static is a middleware  that tells express to make the public folder accessible to the public
app.use(express.static('public')) 

//To enable server read json data
app.use (bodyParser.json())

//using get method to read data from the server to the browser.
//app.get(path, callback) where path is the directory where d server should access and callback tells the server what to do when the path is matched.

// app.get('/', function(req, res){
//   res.send('Hello world')
// })

//in es6 format using arrow functions
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
  // res.redirect('/fetch')
 
 
  })

  // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!


//post options
app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/fetch')
  })
})

//fetch data in db\
app.get('/fetch', (req,res) => {
    db.collection('quotes').find().toArray((err, result) => {
      if (err) return console.log(err)
      // renders index.ejs
      res.render('index.ejs', {quotes: result})
  })

})

//update data
app.put('/quotes', (req, res) => {
  // Handle put request
  db.collection('quotes')
  .findOneAndUpdate({name: 'eddy'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true //upsert ensures that it searches for the name and if not existing adds the new updated record
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'A darth vadar quote got deleted'})
  })
})




//generating the html with render function
// res.render(view, locals)  
//view describes a name of folder we are rendering  and the locals is an object that passes data into the view 




//connecting express server to browser using listen option
// app.listen(3000, function(){
//   console.log('listening on 3000')
// })
