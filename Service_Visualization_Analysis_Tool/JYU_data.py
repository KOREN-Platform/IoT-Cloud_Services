import random

class c_messageJSON():
    deviceid=0;lat=0;lan=0 ;temp=0;light=0;humidity=0; dust=0;carbon_monoxide=0;hostname="JYU";

    def __init__(self,deviceid):
        self.deviceid = deviceid

    def setData(self,lat,lan,temp,light,humidity,dust,carbon_monoxide):
        self.lat = round(lat,6)
        self.lan= round(lan,6)
        self.temp=round(temp,2)
        self.light=round(light,1)
        self.humidity=round(humidity,2)
        self.dust=round(dust,1)
        self.carbon_monoxide = round(carbon_monoxide,1)

    def random_data(self):
        self.lat = round(random.uniform(37.700000,37.710000),6)
        self.lan = round(random.uniform(126.445000,126.447000),6)
        self.temp=round(random.uniform(30.00,30.50),2)
        self.light=round(random.uniform(10000.0,25000.0),1)
        self.humidity=round(random.uniform(65.00,67.00),2)
        self.dust = round(random.uniform(40.0,50.0),1)
        self.carbon_monoxide=round(random.uniform(0.0,2.0),1)
