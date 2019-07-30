const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const jsonParser = bodyParser.json()

const mysql = require('mysql2');
const request = require('request');
const weatherAPI_1 = `http://api.openweathermap.org/data/2.5/forecast?zip=`;
const weatherAPI_2 = `,us&appid=d35c7f0ad46fbf782fd4c83b92f61017`;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'FakeUmberellaDB'
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors()); //Cross Origin


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
  // res.send(zipDaysLogic());
  // res.send('Customers who will experience rain in next 5 days list')
  let data = {};

  connection.query(
  'SELECT DISTINCT location FROM `customers`',
  function(err, qresult, fields) {
    // console.log(fields);
    qresult.forEach(function(value,index,arr){
      let zip = value['location'];
      data[zip] = [];
      request(weatherAPI_1 + zip + weatherAPI_2, function(error, response, body){
        if (!error && response.statusCode == 200) {
          const prediction = JSON.parse(body).list;
          prediction.forEach(function(value,index,arr){
            // console.log(value);
            const day = new Date(value.dt_txt);
            let options = { weekday: 'long'};
            let dayName = new Intl.DateTimeFormat('en-US', options).format(day);
            // console.log(`${value.dt_txt} : ${value.weather[0].main}`);
            if((value.weather[0].main === 'Rain') && (data[zip].indexOf(dayName) === -1)){
              data[zip].push(dayName);  
            }
            // data[value.dt_txt] = value.weather.main;
          });
          // console.log(data);
          
        }else{
          console.log(error);
        }
      });
    })
    // let delay = 3000;
    // setTimeout(function(){
    //   console.log(data);  
    //   res.send(data);
    // }, delay);

    let retData = [];
    connection.query(
    'SELECT id,name,location FROM `customers`',
    function(err, qresult, fields) {
      console.log(data);
      qresult.forEach(function(value,index,arr){
        const obj = {
          id: value['id'],
          name: value['name'],
          location: value['location'],
          rainData: data[value['location']]
        }
        retData.push(obj);
        // retData[value['id']] = {};
        // retData[value['id']]['name'] = value['name'];
        // retData[value['id']]['location'] = value['location'];
        // retData[value['id']]['rainData'] = data[value['location']];
      });
        
      if(err){
        console.log(err);
      }
    });

    let delay = 3000;
    setTimeout(function(){
      console.log(retData);
      res.send(retData);
    }, delay);
  
  });
})

app.get('/customers/topfour', function (req, res) {
  // res.send('Top 4 employee count customers chart (Green for will rain Red for Will Not)')
  //options to navigate through the app
  connection.query(
  'SELECT id, name, employee, location  FROM `customers` ORDER BY employee DESC LIMIT 4',
  function(err, qresult, fields) {
    
    // console.log(qresult);
    let retData = {};
    retData['rain'] = [];
    retData['noRain'] = [];
    let data = [];
    qresult.forEach(function(value,index,arr){
      let zip = value['location'];
      data[zip] = [];
      request(weatherAPI_1 + zip + weatherAPI_2, function(error, response, body){
        if (!error && response.statusCode == 200) {
          const prediction = JSON.parse(body).list;
          prediction.forEach(function(value,index,arr){
            // console.log(value);
            const day = new Date(value.dt_txt);
            let options = { weekday: 'long'};
            let dayName = new Intl.DateTimeFormat('en-US', options).format(day);
            // console.log(`${value.dt_txt} : ${value.weather[0].main}`);
            if((value.weather[0].main === 'Rain') && (data[zip].indexOf(dayName) === -1)){
              data[zip].push(dayName);  
            }
            // data[value.dt_txt] = value.weather.main;
          });
          const obj = {
            id: value['id'],
            name: value['name'],
            location: zip,
            employee: value['employee'],
            rainData: data[zip]
          }
          if(obj.rainData.length > 0){
            retData['rain'].push(obj);
          }else{
            retData['noRain'].push(obj);
          }
          
        }else{
          console.log(error);
        }

      });
    })
    let delay = 3000;
    setTimeout(function(){
      // retData['noRain'][0] = retData['rain'][0];
      // retData['rain'].splice(0,1);
      console.log(JSON.stringify(retData));
      res.send(JSON.stringify(retData));
    }, delay);
  })
})


const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${port}....`));