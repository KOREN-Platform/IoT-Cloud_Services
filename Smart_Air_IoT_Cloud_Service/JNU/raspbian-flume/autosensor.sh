#!/bin/sh
sensor="/var/log/apache/flumeSpool/sensor.txt"
temp="/var/log/apache/flumeSpool/sensor_Flume.txt"
while [ 1 ]; do
if [ -e $sensor ]
then
  mv /var/log/apache/flumeSpool/sensor.txt $temp
  cat $temp
  rm $temp
fi
done
