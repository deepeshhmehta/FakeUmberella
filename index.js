const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const jsonParser = bodyParser.json()

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'FakeUmberellaDB'
});
 
// // simple query
// connection.query(
//   'SELECT * FROM `customers`',
//   function(err, results, fields) {
//     console.log(results); // results contains rows returned by server
//     // console.log(fields); // fields contains extra meta data about results, if available
//     let temp_customers = results;

//     if(err){
//       console.log(err);
//     }
//   }
// );

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors()); //Cross Origin

// let temp_customers = [
// 						{id:1, name:'test1', employee : 5, location : "L4H2A5", person: "John", telephone: "6477732820"},
// 						{id:2, name:'test2', employee : 6, location : "M9W6C9", person: "John", telephone: "6477732820"},
// 						{id:3, name:'test3', employee : 7, location : "LHLHLH", person: "John", telephone: "6477732820"},
// 					];

app.get('/', function (req, res) {
  res.send('Welcome To Fake Umberella API ROUTE');
  //options to navigate through the app
})

app.get('/customers', function (req, res) {
  //fetch from db
  console.log('customers hit');
  res.header("Access-Control-Allow-Origin", "*");
  connection.query(
  'SELECT * FROM `customers`',
  function(err, results, fields) {
    console.log(results); // results contains rows returned by server
    // console.log(fields); // fields contains extra meta data about results, if available
    res.send(results);

    if(err){
      console.log(err);
    }
  });
  // res.send([]);
})

app.post('/customers', function (req, res) {
  let cust = req.body;
  console.log(cust);
  console.log(["'"+cust.name+"'","'"+cust.person+"'","'"+cust.location+"'","'"+cust.telephone+"'",cust.employee]);
  
  connection.execute(
  "INSERT INTO `customers`(id,name,person,location,telephone,employee) VALUES (null,?,?, ?, ?, ?);",
  [cust.name, cust.person, cust.location, cust.telephone, cust.employee],
  function(err, results, fields) {
    console.log(results);
    console.log(fields); 
    res.header("Access-Control-Allow-Origin", "*");
    if(err){
      console.log(err);
      res.send(err);
    }

    res.send(results);
  });
  
})

app.put('/customers', function (req, res) {
  const cust = req.body;
  connection.execute(
  "UPDATE customers SET name = ?, person = ?, location = ?, telephone = ?, employee = ? WHERE id = ?;",
  [cust.name, cust.person, cust.location, cust.telephone, cust.employee, cust.id],
  function(err, results, fields) {
    console.log(results);
    console.log(fields); 
    res.header("Access-Control-Allow-Origin", "*");
    if(err){
      console.log(err);
      res.send(err);
    }

    res.send(results);
  });
})

app.delete('/customers/:id', function (req, res) {
  connection.execute(
  "DELETE FROM customers WHERE id = ?;",
  [req.params.id],
  function(err, results, fields) {
    console.log(results);
    console.log(fields); 
    res.header("Access-Control-Allow-Origin", "*");
    if(err){
      console.log(err);
      res.send(err);
    }
  });

  connection.query(
  'SELECT * FROM `customers`',
  function(err, results, fields) {
    console.log(results); // results contains rows returned by server
    // console.log(fields); // fields contains extra meta data about results, if available
    res.send(results);

    if(err){
      console.log(err);
    }
  });

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