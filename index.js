const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Welcome To Fake Umberella Page')
  //options to navigate through the app
})

app.get('/customers', function (req, res) {
  res.send('Customers CRUD operations page')
  //options to navigate through the app
})

app.get('/customers/rainprediction', function (req, res) {
  res.send('Customers who will experience rain in next 5 days list')
  //options to navigate through the app
})

app.get('/customers/topfour', function (req, res) {
  res.send('Top 4 employee count customers chart (Green for will rain Red for Will Not)')
  //options to navigate through the app
})

app.listen(3000, () => console.log('Listening on port 3000....'));