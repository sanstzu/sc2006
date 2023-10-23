FROM node:18.18.0-alpine

WORKDIR /var/www/db-updater

COPY ["package.json", "package-lock.json", "./"]r

RUN ["npm", "install"]

CMD ["npm", "start"]