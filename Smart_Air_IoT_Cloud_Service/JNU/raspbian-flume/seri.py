import serial
import time

nullstr = -1
id = '"RaspberryPi"'
light = nullstr
temp = nullstr
latitude = nullstr
longitude = nullstr
dust = nullstr
humidity = nullstr
luminance = nullstr
alcohol_gas = nullstr
co_gas = nullstr
ser = serial.Serial('/dev/ttyACM0', 115200, timeout=1)
if(ser.isOpen() == False):
    ser.open()
ser.readline()
time.sleep(2)
while 1:
        response = ser.readline()
#	print(response.split(';'))
#	if response!='\r\n' and response :
	if len(response.split(';')) == 8 :
                temp = response.split(';')[0]
                light = response.split(';')[1]
                co_gas = response.split(';')[2]
                alcohol_gas = response.split(';')[3]
                dust = response.split(';')[4]
		latitude = response.split(';')[5]
		longitude = response.split(';')[6]
                f = open("/var/log/apache/flumeSpool/sensor.txt", 'a')
		#f = open("/var/log/apache/flumeSpool/sensorlog", 'a')
                data = '{ "ID" : %s , "light" : %s , "temp" : %s , "latitude" : %s , "longitude" : %s , "dust" : %s , "alcohol_gas" : %s , "co_gas" : %s }\n' %(id,light,temp,latitude,longitude,dust,alcohol_gas,co_gas)
                f.write(data)
	time.sleep(1)
