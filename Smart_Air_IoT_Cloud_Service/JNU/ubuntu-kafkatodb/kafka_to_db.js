const influx = require('influx')
var kafka = require('kafka-node');

var topic_name = process.env.TOPIC_NAME
var where = process.env.WHERE

console.log('start');
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

var resourceKafka = new kafka.Client('210.114.90.191:2181');
var resourceOffset = new kafka.Offset(resourceKafka);

console.log('fetch');
resourceOffset.fetch([{
        topic: topic_name,
        partition: 0,
        time: -1,
        maxNum: 1
    }
], function(err, data) {
    console.log(data);
    var resourceConsumer = new kafka.Consumer(resourceKafka, [{
            topic: topic_name,
            partition: 0,
            offset: data[topic_name][0]
        }
    ], {
        autoCommit: false,
        fromOffset: true
    });

    resourceConsumer.on('message', function(message) {
	try {
	var messageJSON = JSON.parse(message.value);
	var light = 0;
	var temp = 0;
	var dust = 0;
	var alco = 0;
	var cogas = 0;
	if( where == 'JNU') {
		if(messageJSON.light < 0 )
			light = 0;
		else if(messageJSON.light > 1023)
			light = 1023;
		else 
			light = messageJSON.light;

		if(messageJSON.temp < -40)
			temp = -40;
		else if(messageJSON.temp > 125)
			temp = 125;
		else
			temp = messageJSON.temp;

		if(messageJSON.alcohol_gas < 0 )
			alco = 0;
		else if(messageJSON.alcohol_gas > 1023)
			alco = 1023;
		else
			alco = messageJSON.alcohol_gas;

		if(messageJSON.co_gas < 0)
			cogas = 0;
		else if(messageJSON.co_gas > 1023)
			cogas = 1023;
		else
			cogas = messageJSON.co_gas;
	}
	if(messageJSON.dust < 0 )
		dust = 0;
	else if(messageJSON.dust > 750)
		dust = 750;
	else
		dust = messageJSON.dust;
        DB.writePoints([{
            measurement: topic_name,
            tags: {
            },
            fields: {
		id : messageJSON.ID,
          	light: light,
		temp: temp,
		latitude: messageJSON.latitude,
		longitude: messageJSON.longitude,
		dust: dust,
		alcohol_gas: alco,
		co_gas: cogas
            },
        }])
        console.log(messageJSON);
	} catch (err) {
	console.log("이상한값 들어옴");
	}
    });

});

