var express = require('express');
var router = express.Router();
var multer = require('multer')
var fs = require("fs");
var request = require('request');
var axios = require('axios');

var uploadFolder = 'public/uploads/';
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage })


router.get('/', function (req, res, next) {
  setTimeout(function () {
    res.setHeader('Content-type', 'text/plain');
    res.charset = 'UTF-8';
    res.write("Hello, world");
    res.end();
  }, 8000);
})

router.get('/jsonhandler', function (req, res, next) {
  var jsonData = [
    { name: "Jack", age: "29", email: "Jack@gmail.com" },
    { name: "Mary", age: "21", email: "Mary@hotmail.com" },
    { name: "Tom", age: "35", email: "Tom@yahoo.com" }];
  res.json(jsonData);
})

// http://localhost:3000/api/sse
router.get('/sse', function (req, res, next) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  setInterval(function () {
    constructSSE(res, (new Date()).toString());
  }, 1000)
 
  constructSSE(res, (new Date()).toString());
})

function constructSSE(res, data) { 
  res.write("event: abc\n");
  res.write("data: " + data + '\n\n');
}
// http://localhost:3000/api/youbike
router.get('/youbike', function (req, res, next) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  setInterval(function () {
    // 要求http://data.taipei/youbike的資料
    // http://data.taipei/youbike回傳的資料，透過body參數來接收
    request('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json', { encoding: 'utf-8' }, function (err, response, body) {
      res.write("data: " + body + '\n\n');
    });
  }, 60000)
  request('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json', { encoding: 'utf-8' }, function (err, response, body) {
    res.write("data: " + body + '\n\n');
  });
})

//upload.any()
router.post('/upload', upload.single('myFile'), function (req, res, next) {
  res.send(req.file);
})

// router.post("/base64", function(req, res) {
//     // fs.writeFile('image.png', base64Image, {encoding: 'base64'}, function(err) {
//     //   console.log('File created');
//     // });
//     //res.send("aaaa" + req.body);
// });


router.post('/base64', upload.fields([]), (req, res) => {
  let formData = req.body;
  fs.writeFile('public/uploads/' + formData.id + '.png', formData.imageData, { encoding: 'base64' }, function (err) {
    res.send('檔案上傳成功!!');
  });

});


// router.post("/base64", upload.array("uploads", 12), function(req, res) {
//     var fileInfo = [];
//     for(var i = 0; i < req.files.length; i++) {
//         fileInfo.push({
//             "originalName": req.files[i].originalName,
//             "size": req.files[i].size,
//             "b64": new Buffer(fs.readFileSync(req.files[i].path)).toString("base64")
//         });
//         fs.unlink(req.files[i].path);
//     }
//     res.send(fileInfo);
// });

module.exports = router;
