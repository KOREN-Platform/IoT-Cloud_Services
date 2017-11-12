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
        DB.writePoints([{
            measurement: topic_name,
            tags: {
            },
            fields: {
		id : messageJSON.ID,
          	light: where == 'JNU' ? messageJSON.light : 0,
		temp: where == 'JNU' ?  messageJSON.temp : 0,
		latitude: messageJSON.latitude,
		longitude: messageJSON.longitude,
		dust: messageJSON.dust,
		alcohol_gas: where == 'JNU' ? messageJSON.alcohol_gas : 0,
		co_gas: where == 'JNU' ? messageJSON.co_gas : 0
            },
        }])
        console.log(messageJSON);
	} catch (err) {
	console.log("이상한값 들어옴");
	}
    });

});

