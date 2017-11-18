#!/usr/bin/env python
#coding=utf-8

##########################################################################################
from datetime import datetime, timedelta
import pprint
from influxdb import InfluxDBClient
from copy import deepcopy
import pytz
import argparse

parser=argparse.ArgumentParser()
parser.add_argument("--data",help="sensor data input")
args=parser.parse_args()
sensor_data = args.data
print(sensor_data)

interest_count= sensor_data.split(',')[0]
home_distance= sensor_data.split(',')[1]
sensor1_distance = sensor_data.split(',')[2]
sensor2_distance= sensor_data.split(',')[3]
sensor3_distance= sensor_data.split(',')[4]
sensor4_distance= sensor_data.split(',')[5]
connect= sensor_data.split(',')[6]
mode = sensor_data.split(',')[7]
send_time = sensor_data.split(',')[8]

##########################################################################################
local_tz = pytz.timezone('Asia/Seoul') # use your local timezone name here
##########################################################################################
def utc_to_local(utc_dt):
	local_dt = utc_dt.replace(tzinfo=pytz.utc).astimezone(local_tz)
	return local_tz.normalize(local_dt) # .normalize might be unnecessary

##########################################################################################
def get_ifdb(db, host='localhost', port=8086, user='id', passwd='password'):
	client = InfluxDBClient(host, port, user, passwd, db)
	try:
		client.create_database(db)
	except:
		pass
	return client

##########################################################################################
def my_test(ifdb):
	json_body = [
	]
	tablename = 'Drone1_state'
	fieldname1 = 'count'
	fieldname2 = 'home_distance'
	fieldname3 = 'sensor1_distance'
	fieldname4 = 'sensor2_distance'
	fieldname5 = 'sensor3_distance'
	fieldname6 = 'sensor4_distance'
	fieldname7 = 'connect'
	fieldname8 = 'mode'
	fieldname9 = 'send_time'
	
	point = {
		"measurement": tablename,
		"tags": {
			"host": "Anyang",
			"team": "NeeDroN"
		},
		"fields": {
			fieldname1: 0,
			fieldname2: 0,
			fieldname3: 0,
			fieldname4: 0,
			fieldname5: 0,
			fieldname6: 0,
			fieldname7: 0,
			fieldname8: 0,
			fieldname8: None 
		},
		"time": None,
	}
	dt = datetime.now()
	ldt = utc_to_local(dt)
	print "UTC now=<%s> local now=<%s>" % (dt, ldt)
	global interest_count,home_distance,sensor1_distance,sensor2_distance,senxor3_distance,connect,mode,send_time
	np=deepcopy(point)
	np['fields'][fieldname1] = int(interest_count)
	np['fields'][fieldname2] = float(home_distance)
	np['fields'][fieldname3] = float(sensor1_distance)
	np['fields'][fieldname4] = float(sensor2_distance)
	np['fields'][fieldname5] = float(sensor3_distance)
	np['fields'][fieldname6] = float(sensor4_distance)
	np['fields'][fieldname7] = int(connect)
	np['fields'][fieldname8] = mode
	np['fields'][fieldname9] = send_time
	np['time'] = dt
	json_body.append(np)
	ifdb.write_points(json_body)

##########################################################################################
def do_test():
	ifdb = get_ifdb(db='NeeDroN')
	my_test(ifdb)

##########################################################################################
if __name__ == '__main__':
	do_test()
