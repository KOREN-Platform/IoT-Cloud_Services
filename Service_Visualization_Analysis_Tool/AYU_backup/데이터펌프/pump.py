import os 
from datetime import datetime
import time


state_data ="1,20,30,25,50,40,1,0,"+datetime.now().strftime("%Y-%m-%d-%H:%M:%S")
data = "1,25,40,"+datetime.now().strftime("%Y-%m-%d-%H:%M:%S")
while True:
	os.system('python data_pump2.py --data '+data)
	os.system("python state_pump2.py --data "+state_data)
	time.sleep(2)



