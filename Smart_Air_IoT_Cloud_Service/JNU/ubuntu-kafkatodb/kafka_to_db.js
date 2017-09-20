const influx = require('influx')
var kafka = require('kafka-node');

var topic_name = process.env.TOPIC_NAME
console.log('start');
// InfluxDB
var DB = new influx.InfluxDB({
    // single-host configuration
    host: '210.114.90.176',
    port: 8086, // optional, default 8086
    protocol: 'http', // optional, default 'http'
    username: 'id',
    password: 'password',
    database: 'station'
});

var resourceKafka = new kafka.Client('210.114.90.176:2181');
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
	var messageJSON = JSON.parse(message.value);
        DB.writePoints([{
            measurement: topic_name,
            tags: {
            },
            fields: {
		id : messageJSON.ID,
          	light: messageJSON.light,
		temp: messageJSON.temp,
		latitude: messageJSON.latitude,
		longitude: messageJSON.longitude,
		dust: messageJSON.dust,
		alcohol_gas: messageJSON.alcohol_gas,
		co_gas: messageJSON.co_gas
            },
        }])
        console.log(messageJSON);

    });

});

