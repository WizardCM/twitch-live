var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');

var server = http.createServer(function(req, res){
  if(req.method.toLowerCase() == 'get'){
    switch(req.url){
      case '/':
      case '/login':
      displayForm(req, res);
      break;
      case '/styles/style.css':
      sendCss(req,res);
      break;
    }
} else if(req.method.toLowerCase() == 'post'){
    evaluateForm(req, res);
  } else{
    res.writeHead(404, {'Content-Type': 'text/html'});
    fs.createReadStream('/views/404.html').pipe(res);
  }
});

server.listen(3000, '127.0.0.1');
console.log('Listening on port 3000');

function displayForm(req, res){
    console.log('displaying form \n');
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(__dirname + '/index.html').pipe(res);
}

function sendCss(req,res){
  console.log('sending css \n');
  res.writeHead(200, {"Content-Type": "text/css"});
  fs.createReadStream(__dirname + '/styles/style.css').pipe(res);
}

function evaluateForm(req,res){
  console.log('evaluating form \n');

  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files){
    var dataReceived = util.inspect({
      fields: fields,
      files: files
    });
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('received the data:' + JSON.stringify(dataReceived));
    res.end();
  });
}
