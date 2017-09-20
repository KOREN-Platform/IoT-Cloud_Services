var app = require('express')();
const influx = require('influx');
const path = require('path');
var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);

// InfluxDB
var DB = new influx.InfluxDB({
    // single-host configuration
    host: 'nuc',
    port: 8086, // optional, default 8086
    protocol: 'http', // optional, default 'http'
    username: 'dnslabInflux',
    password: 'dnslab',
    database: 'dnslabdatabases'
});

let raspIsOn = false;
let raspIsOn2 = false;

function getBieberTweet(cb) {
  cb('check out');
}

// localhost:3000으로 서버에 접속하면 클라이언트로 index.html을 전송한다
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use('/dist/',require('express').static(path.join(__dirname,'/dist'), { maxAge: 259200000}))
app.use('/img/',require('express').static(path.join(__dirname,'/img'), { maxAge: 259200000} ))


// connection event handler
// connection이 수립되면 event handler function의 인자로 socket인 들어온다
io.on('connection', function(socket) {

socket.on("init", function() {
DB.query(`
        select * from jnusensor
        where time > now() - 3s
        order by time desc
        limit 1
      `).then(result => {
         if(result[0] != undefined)
           raspIsOn = true;
         else
	   raspIsOn2 = false;
         socket.emit('rasp', result[0]);
      }).catch(err => {
         raspIsOn = false;
         socket.emit('rasp', null)
      })

DB.query(`
        select * from jnusensor2
        where time > now() - 3s
        order by time desc
        limit 1
      `).then(result => {
         if(result[0] != undefined)
           raspIsOn2 = true;
         else
           raspIsOn2 = false;
         socket.emit('rasp2', result[0]);
      }).catch(err => {
        raspIsOn2 = false;
         socket.emit('rasp2', null)
      })
})


var tweets = setInterval(function () {
    getBieberTweet(function (tweet) {
        DB.query(`
        select * from jnusensor
        where time > now() - 3s
        order by time desc
        limit 1
      `).then(result => {
         console.log("jnusensor : " + raspIsOn,result[0]);
         
         if(raspIsOn && result[0] == undefined){
           socket.volatile.emit('rasp', result[0]);
	   raspIsOn = false;
	 } else if(!raspIsOn && result[0] != undefined) {
	   socket.volatile.emit('rasp', result[0]);
           raspIsOn = true;
         }
      }).catch(err => {
         socket.volatile.emit('rasp', null)
      })
    });
  }, 3000);

var tweets2 = setInterval(function () {
    getBieberTweet(function (tweet) {
        DB.query(`
        select * from jnusensor2
        where time > now() - 3s
        order by time desc
        limit 1
      `).then(result => {
         //console.log("jnusensor2 : " + raspIsOn2,result[0]);

         if(raspIsOn2 && result[0] == undefined){
           socket.volatile.emit('rasp2', result[0]);
           raspIsOn2 = false;
         } else if(!raspIsOn2 && result[0] != undefined) {
           socket.volatile.emit('rasp2', result[0]);
           raspIsOn2 = true;
         }
      }).catch(err => {
         socket.volatile.emit('rasp2', null)
      })
    });
  }, 3000);

  // force client disconnect from server
  socket.on('forceDisconnect', function() {
    socket.disconnect();
    clearInterval(tweets);
    clearInterval(tweets2);
  })

  socket.on('disconnect', function() {
    clearInterval(tweets);
    clearInterval(tweets);
    console.log('user disconnected: ' + socket.name);
  });
});

server.listen(4000, function() {
  console.log('Socket IO server listening on port 4000');
});
