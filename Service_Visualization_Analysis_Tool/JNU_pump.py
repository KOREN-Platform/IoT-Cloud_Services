#!/usr/bin/env python
#coding=utf-8

from datetime import datetime, timedelta
import pprint
from influxdb import InfluxDBClient
from copy import deepcopy
import pytz
import random
import time

import sys
sys.path.insert(0,'/home/sohyun')
from JNU_data import c_messageJSON

##########################################################################################
local_tz = pytz.timezone('Asia/Seoul') # use your local timezone name here
##########################################################################################
def utc_to_local(utc_dt):
	local_dt = utc_dt.replace(tzinfo=pytz.utc).astimezone(local_tz)
	return local_tz.normalize(local_dt) # .normalize might be unnecessary

##########################################################################################
def get_ifdb(db, host='localhost', port=8086, user='root', passwd='root'):
	client = InfluxDBClient(host, port, user, passwd, db)
	try:
		client.create_database(db)
	except:
		pass
	return client

##########################################################################################
def my_test(ifdb):
	tablename = "JNU_2_1"
	deviceid="JNU_Device"
	messageJSON = c_messageJSON(deviceid)

	json_body = [
	]
	status= 'status'
	lat='lat'
	lon='lon'
	dust='dust'
	alcohol_gas ='alcohol_gas'
	co_gas ='co_gas'
	temp='temp'
	light='light'
	

	point = {
		"measurement": tablename,
		"tags": {
			"host":messageJSON.hostname,
			"device_ID":messageJSON.deviceid,
		},
		"fields": {
			status :messageJSON.status,
			lat :messageJSON.lat,
			lon:messageJSON.lon,
			dust:messageJSON.dust,
			alcohol_gas:messageJSON.alcohol_gas,
			co_gas:messageJSON.co_gas,
			temp:messageJSON.temp,
			light:messageJSON.light,

		},
		"time": None,
	}
	
	while True:
		messageJSON.random_data()
		dt = datetime.now()
		ldt = utc_to_local(dt)
		print "UTC now=<%s> local now=<%s>" % (dt, ldt)
		np = deepcopy(point)
		np['fields'][lat] =messageJSON.lat
		np['fields'][lon] =messageJSON.lon 
		np['fields'][status] =messageJSON.status
		np['fields'][dust]= messageJSON.dust
		np['fields'][alcohol_gas]=messageJSON.alcohol_gas
		np['fields'][co_gas]=messageJSON.co_gas
		np['fields'][temp]=messageJSON.temp
		np['fields'][light]=messageJSON.light
		
		np['time'] = dt
		json_body.append(np)
#		dt += timedelta(seconds=1)
		ifdb.write_points(json_body)
	
		result = ifdb.query('select * from %s' % tablename)
		pprint.pprint(result.raw)
		time.sleep(2)

##########################################################################################
def do_test():
	ifdb = get_ifdb(db='resource_2_1')
	my_test(ifdb)

##########################################################################################
if __name__ == '__main__':
	do_test()

