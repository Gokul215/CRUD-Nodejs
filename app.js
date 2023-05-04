const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectId=require('objectid');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let db;
MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, (err, client) => {
  if (err) return console.error(err);
  console.log('Connected to Database');
  db = client.db('testdb');
});

app.get('/', (req, res) => {
  db.collection('items').find().toArray((err, result) => {
    if (err) return console.error(err);
    res.render('index.ejs', { items: result });
  });
});

app.post('/add', (req, res) => {
  db.collection('items').insertOne(req.body, (err, result) => {
    if (err) return console.error(err);
    res.redirect('/');
  });
});

app.post('/edit', (req, res) => {
  const id = req.body.id;
  db.collection('items').updateOne({ _id: ObjectId(id) }, { $set: { name: req.body.name } }, (err, result) => {
    if (err) return console.error(err);
    res.redirect('/');
  });
});

app.post('/delete', (req, res) => {
  const id = req.body.id;
  db.collection('items').deleteOne({ _id: ObjectId(id) }, (err, result) => {
    if (err) return console.error(err);
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
