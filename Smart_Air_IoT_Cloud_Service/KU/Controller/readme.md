# Opendaylight

# OS
Ubuntu 16.04

# Java
Version Java 8

$ sudo apt-get install openjdk-8-jdk

# Maven
Version 3.3.9

$ wget https://archive.apache.org/dist/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz

$ tar xvfz apache-maven-3.3.9-bin.tar.gz

$ mv apache-maven-3.3.9 /usr/local

$ cd /usr/local/

$ sudo ln -s apache-maven-3.3.9 maven


# Environment Variable
$ sudo vi /etc/profile

export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64

export M2_HOME=/usr/local/maven

PATH=$PATH:$JAVA_HOME/bin:$M2_HOME/bin

# OpenDaylight hydrogen base 1.0
https://www.opendaylight.org/software/downloads/hydrogen-base-10

Pre-built Zip file Download 

$ unzip distributions-base-0.1.1-osgipackage.zip


# Netbeans IDE
Version 8.2 Java EE

https://netbeans.org/downloads/

$ chmod +x netbeans-8.2-javaee-linux.sh

$ ./netbeans-8.2.javaee-linux.sh

# Opendaylight Repository

$ wget -q -O - https://raw.githubusercontent.com/opendaylight/odlparent/master/settings.xml > ~/.m2/settings.xml
