const express = require('express')
const app = express();

// const mysql = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   //port     : '8080',
//   user     : 'root',
//   password : '',
//   database : 'FakeUmberellaDB'

// });

// connection.on('error', function(err) {
//   console.log(err.code); // example : 'ER_BAD_DB_ERROR'
// });


// connection.connect();
// connection.query('select * from customers', function (err, rows, fields) {
//   if(err){
//     console.log('if true');
//     console.log(err);

//   }else{
//     console.log('The solution is: ', rows[0].name);
//   }
// })

// connection.end()

app.use(express.json());

let temp_customers = [
						{id:1, name:'test1', employees : 5, location : "L4H2A5", person: "John", telephone: "6477732820"},
						{id:2, name:'test2', employees : 6, location : "M9W6C9", person: "John", telephone: "6477732820"},
						{id:3, name:'test3', employees : 7, location : "LHLHLH", person: "John", telephone: "6477732820"},
					];

app.get('/', function (req, res) {
  res.send('Welcome To Fake Umberella Page');
  //options to navigate through the app
})

app.get('/customers', function (req, res) {
  // res.send('Customers CRUD operations page')
  // res.render('customers');
  res.header("Access-Control-Allow-Origin", "*");
  res.send(temp_customers);
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

app.get('/customers/:id', function (req, res) {
  // res.send('Customers CRUD operations page')
  // res.render('customers');
  const customer = temp_customers.find(c => c.id === parseInt(req.params.id));
  if(!customer) res.status(404).send(`NO CUSTOMER WITH ID ${req.params.id} FOUND`);
  res.send(customer);
  //options to navigate through the app
})

app.post('/customers/add', function (req, res) {
  // res.send('Customers CRUD operations page')
  // res.render('customers');
  // console.log(req.data)
  res.send('Done');
  //options to navigate through the app
})



const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${port}....`));