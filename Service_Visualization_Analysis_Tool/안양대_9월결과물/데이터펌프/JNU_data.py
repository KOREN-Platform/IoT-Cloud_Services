import random

class c_messageJSON():
    deviceid="JNU_Device";lat=0;lon=0 ;status=0;dust=0;alcohol_gas=0;co_gas=0;temp=0; light=0;hostname="JNU";

    def __init__(self,deviceid):
        self.deviceid = deviceid

    def setData(self,lat,lon,temp,dust,alcohol_gas,co_gas,light):
        self.lat = round(lat,1)
        self.lon= round(lon,1)
        self.temp=round(temp,1)
	self.dust = round(dust,1)
	self.alcohol_gas =round(alcohol_gas,0)
	self.co_gas = round(co_gas,0)
	self.light = round(light,0)

    def random_data(self):
        self.lat = round(random.uniform(-90.0,90.0),1)
        self.lon = round(random.uniform(-180.0,190.0),1)
        self.temp=round(random.uniform(-40.0,125.0),1)
        self.light=round(random.uniform(0,1023),0)
	self.dust =round(random.uniform(0.0,750.0),1)
	self.alcohol_gas = round(random.uniform(0,1023),0)
	self.co_gas = round(random.uniform(0,1023),0)
	self.status = round(random.uniform(0,2),0)





