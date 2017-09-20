FROM resin/rpi-raspbian:wheezy
MAINTAINER Seungryong Kim <srkim@nm.gist.ac.kr>

#Update & Install wget, vim
RUN apt-get update
RUN apt-get -y install wget
RUN apt-get -y install vim

#Timezone
RUN cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime

#Install Oracle JAVA
RUN mkdir -p /opt
RUN curl -O -v -j -k -L -H "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-arm32-vfp-hflt.tar.gz
RUN tar -xvzf jdk-8u131-linux-arm32-vfp-hflt.tar.gz -C /opt


#Configurate environmental variables
ENV JAVA_HOME /opt/jdk1.8.0_131
ENV PATH $PATH:/opt/jdk1.8.0_131/bin
RUN ln -s /opt/jdk1.8.0_131/bin/java /usr/bin/java

#Install Flume
RUN sudo wget --no-check-certificate http://www.apache.org/dist/flume/1.6.0/apache-flume-1.6.0-bin.tar.gz -O - | tar -zxv
RUN sudo mv apache-flume-1.6.0-bin /flume

ADD plugins.d /flume/plugins.d
ADD flume-conf.properties /flume/conf/

#Csharp Programming
COPY seri.py /flume/
COPY autosensor.sh /flume/

#Working directory
WORKDIR /flume
