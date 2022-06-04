const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient

// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }))

// All your handlers here...
// app.get('/', (req,res) => {
//     res.sendFile(__dirname + '/index.html')
// })

app.listen(3000, function () {
  console.log('listening on 3000')
})

// MongoClient.connect('mongodb+srv://IsaacHHB:Hollowhorn7@cluster0.lkpys.mongodb.net/?retryWrites=true&w=majority', (err, client) => {
//     if(err) return console.error(err)
//     console.log('Connected to Database')
// })
MongoClient.connect('mongodb+srv://IsaacHHB:Hollowhorn7@cluster0.lkpys.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('Isaacs-stuff')
    const quotesCollection = db.collection('quotes')
    app.set('view engine', 'ejs')
    app.use(express.static('public'))
    app.use(bodyParser.json())
    app.get('/', (req, res) => {
      console.log('client get')
      quotesCollection.find().toArray()
        .then(results => {
          console.log(results)
          res.render('index.ejs', { quotes: results })
        })
        .catch(error => console.error(error))
    })
    app.post('/quotes', (req, res) => {
      console.log('client post')
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })
    app.put('/quotes', (req, res) => {
      console.log(req.body)
      quotesCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => {
          res.json('Success')
        })
        .catch(error => console.error(error))
    })
    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
      .then(result => {
        if (result.deletedCount === 0) {
          return res.json('No quote to delete')
        }
        res.json(`Deleted Darth Vadar's quote`)
      })
      .catch(error => console.error(error))
    })     
  })
  .catch(error => console.error(error))
