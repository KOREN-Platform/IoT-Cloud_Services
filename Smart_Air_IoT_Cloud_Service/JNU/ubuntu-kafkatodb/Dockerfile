FROM node:7
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN curl -G -XPOST http://210.114.90.176:8086/query --data-urlencode \"u=id\" --data-urlencode \"p=password\" --data-urlencode "q=CREATE USER id WITH PASSWORD 'password' WITH ALL PRIVILEGES"
RUN curl -G -XPOST http://210.114.90.176:8086/query --data-urlencode \"u=id\" --data-urlencode \"p=password\" --data-urlencode "q=CREATE DATABASE station"

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

CMD ["npm","start"]


EXPOSE 3000
