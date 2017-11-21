var app = require('express')();
const influx = require('influx');
const path = require('path');
var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);
var eye = require('eyes');
var http = require('http');
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;

// InfluxDB
var DB = new influx.InfluxDB({
    // single-host configuration
    host: '210.114.90.191',
    port: 8086, // optional, default 8086
    protocol: 'http', // optional, default 'http'
    username: 'id',
    password: 'password',
    database: 'station'
});

let raspIsOn2 = false;
let raspIsOn3 = false;
let raspIsOn4 = false;
let raspIsOn5 = false;
let raspIsOn6 = false;
let raspIsOn7 = false;


function getBieberTweet(cb) {
    cb('check out');
}

// localhost:3000으로 서버에 접속하면 클라이언트로 index.html을 전송한다

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/main.html');
});

app.use('/dist/', require('express').static(path.join(__dirname, '/dist'), {maxAge: 259200000}))
app.use('/img/', require('express').static(path.join(__dirname, '/img'), {maxAge: 259200000}))
app.use('/html/', require('express').static(path.join(__dirname, '/html'), {maxAge: 259200000}))



// connection event handler
// connection이 수립되면 event handler function의 인자로 socket인 들어온다
io.on('connection', function (socket) {

    socket.on("init", function () {

        DB.query(`
        select * from JNU01_rasp
        where time > now() - 5s
        order by time desc
        limit 1
      `).then(result => {
	console.log(result[0])
            if (result[0] != undefined)
                socket.emit('JNU01rasp', null);
            else
		socket.emit('JNU01rasp', result[0]);
        }).catch(err => {
            socket.emit('JNU01rasp', null)
        })

        DB.query(`
        select * from JNU02_drone
        where time > now() - 5s
        order by time desc
        limit 1
      `).then(result => {
            if (result[0] != undefined)
                socket.emit('JNU02drone', null);
            else
            	socket.emit('JNU02drone', result[0]);
        }).catch(err => {
            socket.emit('JNU02drone', null)
        })


        DB.query(`
        select * from JNU03_demo
        where time > now() - 5s
        order by time desc
        limit 1
      `).then(result => {
            if (result[0] != undefined)
            	socket.emit('JNU03demo', null);
	    else
            	socket.emit('JNU03demo', result[0]);
        }).catch(err => {
            socket.emit('JNU03demo', null)
        })


        DB.query(`
        select * from KU01_phone
        where time > now() - 5s
        order by time desc
        limit 1
      `).then(result => {
            if (result[0] != undefined)
            	socket.emit('KU01phone', null);
            else
            socket.emit('KU01phone', result[0]);
        }).catch(err => {     
            socket.emit('KU01phone', null)
        })

        DB.query(`
        select * from KU02_demo
        where time > now() - 5s
        order by time desc
        limit 1
      `).then(result => {
            if (result[0] != undefined)
                socket.emit('KU02demo', null);
            else
            socket.emit('KU02demo', result[0]);
        }).catch(err => {
            socket.emit('KU02demo', null)
        })


        DB.query(`
        select * from GIST01_rasp
        where time > now() - 5s
        order by time desc
        limit 1
      `).then(result => {
            if (result[0] != undefined)
                socket.emit('GIST01rasp', null)
            else
            socket.emit('GIST01rasp', result[0]);
        }).catch(err => {
            socket.emit('GIST01rasp', null)
        })

        DB.query(`
        select * from JEJU01_rasp
        where time > now() - 5s
        order by time desc
        limit 1
      `).then(result => {
            if (result[0] != undefined)
           socket.emit('JEJU01rasp', null)
            else
            socket.emit('JEJU01rasp', result[0]);
        }).catch(err => {
            socket.emit('JEJU01rasp', null)
        })
    })



    var tweets1 = setInterval(function () {
        getBieberTweet(function (tweet) {
            DB.query(`
        select * from JNU01_rasp
        where time > now() - 5s
        order by time desc
        limit 1
      `).then(result => {
                //console.log("jnusensor(rasp) : " + raspIsOn1,result[0]);

                if (result[0] == undefined) {
                    socket.volatile.emit('JNU01rasp', null);
                } else if (result[0] != undefined) {
                    socket.volatile.emit('JNU01rasp', result[0]);
                }
            }).catch(err => {
                socket.volatile.emit('JNU01rasp', null)
            })
        });
    }, 5000);

    var tweets2 = setInterval(function () {
        getBieberTweet(function (tweet) {
            DB.query(`
        select * from JNU02_drone
        where time > now() - 5s
        order by time desc
        limit 1
      `).then(result => {
                // console.log("jnusensor2(drone) : " + raspIsOn2, result[0]);

                if (result[0] == undefined) {
                    socket.volatile.emit('JNU02drone', null);
                } else if (result[0] != undefined) {
                    socket.volatile.emit('JNU02drone', result[0]);
                }
            }).catch(err => {
                socket.volatile.emit('JNU02drone', null)
            })
        });
    }, 5000);

    var tweets3 = setInterval(function () {
        getBieberTweet(function (tweet) {
            DB.query(`
        select * from JNU03_demo
        where time > now() - 5s
        order by time desc
        limit 1
      `).then(result => {
                //console.log("jnusensor3(demo) : " + raspIsOn3, result[0]);

                if (result[0] == undefined) {
                    socket.volatile.emit('JNU03demo', null);
                } else if (result[0] != undefined) {
                    socket.volatile.emit('JNU03demo', result[0]);
                }
            }).catch(err => {
                socket.volatile.emit('JNU03demo', null)
            })
        });
    }, 5000);


    var tweets4 = setInterval(function () {
        getBieberTweet(function (tweet) {
            DB.query(`
        select * from KU01_phone
        where time > now() - 5s
        order by time desc
        limit 1
      `).then(result => {
                //console.log("kusensor(phone) : " + raspIsOn4, result[0]);

                if ( result[0] == undefined) {
                    socket.volatile.emit('KU01phone', null);
                } else if ( result[0] != undefined) {
                    socket.volatile.emit('KU01phone', result[0]);
                }
            }).catch(err => {
                socket.volatile.emit('KU01phone', null)
            })
        });
    }, 5000);


    var tweets5 = setInterval(function () {
        getBieberTweet(function (tweet) {
            DB.query(`
        select * from KU02_demo
        where time > now() - 5s
        order by time desc
        limit 1
      `).then(result => {
                //console.log("kusensor(demo) : " + raspIsOn5, result[0]);

                if (result[0] == undefined) {
                    socket.volatile.emit('KU01demo', null);
                } else if (result[0] != undefined) {
                    socket.volatile.emit('KU01demo', result[0]);
                }
            }).catch(err => {
                socket.volatile.emit('KU01demo', null)
            })
        });
    }, 5000);
    
     var tweets6 = setInterval(function () {
        getBieberTweet(function (tweet) {
            DB.query(`
        select * from GIST01_rasp
        where time > now() - 5s
        order by time desc
        limit 1
      `).then(result => {
             

                if ( result[0] == undefined) {
                    socket.volatile.emit('GIST01rasp', null);
                } else if ( result[0] != undefined) {
                    socket.volatile.emit('GIST01rasp', result[0]);
                }
            }).catch(err => {
                socket.volatile.emit('GIST01rasp', null)
            })
        });
    }, 5000);
    
     var tweets7 = setInterval(function () {
        getBieberTweet(function (tweet) {
            DB.query(`
        select * from JEJU01_rasp
        where time > now() - 5s
        order by time desc
        limit 1
      `).then(result => {
                

                if (result[0] == undefined) {
                    socket.volatile.emit('JEJU01rasp', null);
                } else if (result[0] != undefined) {
                    socket.volatile.emit('JEJU01rasp', result[0]);
                }
            }).catch(err => {
                socket.volatile.emit('JEJU01rasp', null)
            })
        });
    }, 5000);


    var videoTweets1 = setInterval(function () {
	getBieberTweet(function (tweet) {
	var data = '';	
	var isTrue = false;
	 http.get('http://168.131.161.200:1936/stat.xml', function(res) {
     	if (res.statusCode >= 200 && res.statusCode < 400) {
       	res.on('data', function(data_) { data += data_.toString(); });
       	res.on('end', function() {

        var doc = new dom().parseFromString(data);

        var streams = xpath.select("//live/stream/name",doc);
        for(var i = 0 ; i < streams.length ; i++){
        if(streams[i].firstChild.data == 'jnu2')
	isTrue = true;
        }
	socket.volatile.emit('JNUCAM', isTrue)
	});
     }
   });


	});
    }, 5000);
    

    var videoTweets2 = setInterval(function () {
        getBieberTweet(function (tweet) {
	
	var data = '';
        var isTrue = false;
         http.get('http://168.131.161.200:1936/stat.xml', function(res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
        res.on('data', function(data_) { data += data_.toString(); });
        res.on('end', function() {

        var doc = new dom().parseFromString(data);

        var streams = xpath.select("//live/stream/name",doc);
        for(var i = 0 ; i < streams.length ; i++){
        if(streams[i].firstChild.data == 'ku')
        isTrue = true;
        }
        socket.volatile.emit('KUCAM', isTrue)
        });
     }
   });


        });
    }, 5000);
    

    // force client disconnect from server
    socket.on('forceDisconnect', function () {
        socket.disconnect();
        clearInterval(tweets1);
        clearInterval(tweets2);
        clearInterval(tweets3);
        clearInterval(tweets4);
        clearInterval(tweets5);
        clearInterval(tweets6);
        clearInterval(tweets7);
	clearInterval(videoTweets1);
	clearInterval(videoTweets2);
    })

    socket.on('disconnect', function () {
        clearInterval(tweets1);
        clearInterval(tweets2);
        clearInterval(tweets3);
        clearInterval(tweets4);
        clearInterval(tweets5);
        clearInterval(tweets6);
        clearInterval(tweets7);
	clearInterval(videoTweets1);
	clearInterval(videoTweets2);
        console.log('user disconnected: ' + socket.name);
    });
});

server.listen(4000, function () {
    console.log('Socket IO server listening on port 4000');
});
