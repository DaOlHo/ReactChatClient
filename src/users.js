const EventEmitter = require('events')
const Stream = new EventEmitter()
var express = require('express');
var router = express.Router();
var history = [];

/* GET users listing. */
// router.get('/', (req, res, next) => {
//   res.json(history);
// });

// router.get('/stream', function(request, response){
//   response.writeHead(200, {
//     'Content-Type': 'text/event-stream',
//     'Cache-Control': 'no-cache',
//     'Connection': 'keep-alive'
//   });

//   Stream.on("push", function(event, data) {
//     response.write("event: " + String(event) + "\n" + "data: " + JSON.stringify(data) + "\n\n");
//   });
// });

router.post('/', (req, res) => {
  if (history.length === 40) history.shift()
  history.push(req.body)
  Stream.emit("push", "test", { msg: "admit one" })
  // res.json(history)
})

module.exports = router;
