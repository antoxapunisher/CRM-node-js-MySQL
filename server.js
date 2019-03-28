var mysql = require('mysql');
var express = require('express');
var path = require('path');
var app = express();
var catalog = 'CRM';
var bodyParser = require('body-parser');
const fs = require("fs");
//var querysProducts = require('./js/querys');

Data = new Date();
Year = Data.getFullYear();
Month = Data.getMonth();
Day = Data.getDate();
let dateof =''+Year+'-'+Month+'-'+Day+'';
console.log(dateof);

//Подключение к базе
var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'CRM'
});

con.query("SELECT Sum(Cost) FROM Orders where OrderDate = "+dateof+" ", function (err, result, fields) {
  if (err) throw err;
  console.log(result);
});


app.get("/", function(request, response){
  let rez = '';
    let rezc = '';
    let rezy = '';
    let rezt = '';

  con.query("SELECT COUNT(*) as count FROM Customer", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
      rez  += result[0].count;
  });
  con.query("SELECT Sum(Cost) as cost FROM Orders", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    rezc  += result[0].cost;
  });
  con.query("SELECT COUNT(*) as count FROM Orders", function (err, result, fields) {
  if (err) throw err;
  console.log(result);
  rezy  += result[0].count;
  });
  con.query("SELECT COUNT(Status) as count FROM Orders where status = 0", function (err, result, fields) {
  if (err) throw err;
  console.log(result);
  rezt  += result[0].count;
  });
      fs.readFile("crm/index.html", "utf8", function(error, data){
      data = data.replace("{rezc}", rezc).replace("{rez}", rez).replace("{rezy}", rezy).replace("{rezt}", rezt);
      response.end(data);
      });
});

  app.get("/index.html", function(request, response){
    let rez = '';
      let rezc = '';
      let rezy = '';
      let rezt = '';

    con.query("SELECT COUNT(*) as count FROM Customer", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
        rez  += result[0].count;
    });
    con.query("SELECT Sum(Cost) as cost FROM Orders", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      rezc  += result[0].cost;
  });
  con.query("SELECT COUNT(*) as count FROM Orders", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    rezy  += result[0].count;
});
con.query("SELECT COUNT(Status) as count FROM Orders where status = 0", function (err, result, fields) {
  if (err) throw err;
  console.log(result);
  rezt  += result[0].count;
});
        fs.readFile("crm/index.html", "utf8", function(error, data){
        data = data.replace("{rezc}", rezc).replace("{rez}", rez).replace("{rezy}", rezy).replace("{rezt}", rezt);
        response.end(data);
        });
  });


app.get("/order.html", function(request, response){
con.query("SELECT Sum(Cost) as cost FROM Orders", function (err, result, fields) {
  if (err) throw err;
  console.log(result);
  let rezc = '';
      fs.readFile("crm/order.html", "utf8", function(error, data){
      rezc  += '<p>'+result[0].cost+'</p>';
      data = data.replace("{rezc}", rezc);
      response.end(data);
      });
});
});
app.get("/products.html", function(request, response){
var queryString = 'SELECT * FROM products';
let stroka = "";
con.query(queryString, function(err, rows, fields) {
        if (err) throw err;
        for (var i in rows) {
            stroka += '<tr><td>'+rows[i].Name+'</td><td>'+rows[i].Price+'</td><td>'+rows[i].Count+'</td><td>'+rows[i].Category+'</td><td>'+rows[i].Description+'</td><td><p style="text-align: center;"><img src="'+rows[i].Photo+'" style="max-width: 200px; max-height: 300px; align-items: center;"/></p></td></tr>';
        }
});
fs.readFile("crm/products.html", "utf8", function(error, data){
    data = data.replace("{stroka}", stroka);
    response.end(data);
});
});

app.get("/Customers.html", function(request, response){
var queryString = 'SELECT * FROM customer';
let stroka = "";
let cardrez
con.query(queryString, function(err, rows, fields) {
        if (err) throw err;
        for (var i in rows) {
            stroka += '<tr><td id="customerId">'+rows[i].id+'</td><td id="customersName">'+rows[i].Name+'</td><td>'+rows[i].Amount+'</td><td>'+rows[i].Country+'</td><td>'+rows[i].City+'</td><td> <button type="submit" class="btn btn-info btn-fill btn-wd" data-toggle="modal" data-target="#exampleModal" style="margin-left: -33px;">Карточка</button></td></tr>';
        }
});


fs.readFile("crm/Customers.html", "utf8", function(error, data){
    data = data.replace("{stroka}", stroka);
    response.end(data);
});
});


app.use('/', express.static(path.join(__dirname ,catalog)));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.listen(8080);
