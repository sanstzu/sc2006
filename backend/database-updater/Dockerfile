FROM node:18.18.0-alpine

WORKDIR /var/www/db-updater

COPY ["package*.json", "./"]
RUN ["npm", "install"]

COPY [".", "./"]
CMD ["npm", "start"]