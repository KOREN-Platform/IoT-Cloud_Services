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
from KU_data import c_messageJSON

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
	tablename = "KU_2_1"
	deviceid="KU_Device"
	messageJSON = c_messageJSON(deviceid)

	json_body = [
	]
	lat='lat'
	lan='lan'
	dust="dust"

	point = {
		"measurement": tablename,
		"tags": {
			"host":messageJSON.hostname,
			"device_ID":messageJSON.deviceid,
		},
		"fields": {
			
			lat :messageJSON.lat,
			lan:messageJSON.lan,
			dust:messageJSON.dust,
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
		np['fields'][lan] =messageJSON.lan 
		np['fields'][dust] =messageJSON.dust

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

