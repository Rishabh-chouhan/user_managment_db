FROM node:21.5.0

WORKDIR /appfolder

COPY package*.json ./

COPY . /appfolder

RUN npm install

EXPOSE 3002

CMD ["node","app1.js"]