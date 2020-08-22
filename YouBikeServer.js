var request = require('request');
var fs = require('fs');
var path = require('path');
var http = require('http');
const zlib = require('zlib');

function sendServerSendEvent(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    var sseId = (new Date()).toLocaleTimeString();

    setInterval(function () {
        writeServerSendEvent(res, sseId, (new Date()).toLocaleTimeString());
    }, 60000);

    writeServerSendEvent(res, sseId, (new Date()).toLocaleTimeString());
}

function writeServerSendEvent(res, sseId, data) {
    request('http://data.taipei/youbike', {encoding: null}, function(err, response, body){
        zlib.gunzip(body, function(err, dezipped) {
            res.write("data: " + dezipped.toString() + '\n\n');         
        });
    });  
}

http.createServer(function (req, res) {
    if (req.headers.accept && req.headers.accept == 'text/event-stream') {
        if (req.url == '/events') {
            sendServerSendEvent(req, res);
        } else {
            res.writeHead(404);
            res.end();
        }
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
      res.write(fs.readFileSync(__dirname + '/public/YouBikeClient.html'));
       res.end();
    }
}).listen(3000);












//這段程式OK
// request('http://data.taipei/youbike').pipe(fs.createWriteStream("youbike.gz"));

//     http.createServer(function(req, res) {
        
      
//           localPath = path.join(__dirname, 'youbike.gz'); //path.resolve('public/',filename);
//           fs.readFile(localPath,function(err, contents) {
//             if (!err) {
//               res.writeHead(200, {
//                 "Content-Type": 'application/json',
//                 "Content-Length": contents.length,
//                 "Content-Encoding": 'gzip'
//               });
//               res.end(contents);
//             } else {
//               res.writeHead(500);
//               res.end();
//             }
//           });
//       }).listen(3000);