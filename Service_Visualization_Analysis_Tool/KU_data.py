import random

class c_messageJSON():
    deviceid=0;status=0;lat=0;lan=0; dust=0;hostname="KU";


    def __init__(self,deviceid):
        self.deviceid = deviceid

    def setData(self,lat,lan,dust):
        self.lat = round(lat,1)
        self.lan= round(lan,1)
        self.dust=round(dust,1)

    def random_data(self):
        self.lat = round(random.uniform(-90.0,90.0),1)
        self.lan = round(random.uniform(-180.0,190.0),1)
        self.dust = round(random.uniform(0.0,750.0),1)
