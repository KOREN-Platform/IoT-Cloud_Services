import serial
import time

nullstr = 9999
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
ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
if(ser.isOpen() == False):
    ser.open()
ser.readline()
time.sleep(2)
while 1:
        response = ser.readline()
        if response :
                temp = response.split(' ; ')[0]
                a = response.split(' ; ')[1]
                light = a
                co_gas = response.split(' ; ')[2]
                alcohol_gas = response.split(' ; ')[3]
                dust = response.split(' ; ')[4]
                f = open("/var/log/apache/flumeSpool/sensor.txt", 'a')
                data = '{ "ID" : %s , "light" : %s , "temp" : %s , "latitude" : %s , "longitude" : %s , "dust" : %s , "alcohol_gas" : %s , "co_gas" : %s }\n' %(id,light,temp,latitude,longitude,dust,alcohol_gas,co_gas)
                f.write(data)
