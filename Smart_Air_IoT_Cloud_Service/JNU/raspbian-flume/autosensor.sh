#!/bin/sh
sensor="/var/log/apache/flumeSpool/sensor.txt"
temp="/var/log/apache/flumeSpool/sensor_Flume.txt"
while [ 1 ]
do
  if [ -e $sensor ]
    then
      mv /var/log/apache/flumeSpool/sensor.txt $temp
      tail -1 $temp
      rm $temp
      sleep 1
  fi
done

