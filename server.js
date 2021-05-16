var express = require('express')
var path = require('path')

var app = express()
app.use(express.static("public"));
port = process.env.port || 5000
app.get('/', function(req, res) {
    res.sendFile('/index.html');
  });
  

app.listen(port,()=>{
    console.log('server started at:',port)
})