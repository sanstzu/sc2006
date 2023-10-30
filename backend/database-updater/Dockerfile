FROM node:18.18.0-alpine

ARG ENVIRONMENT

ENV ENVIRONMENT=$ENVIRONMENT

WORKDIR /var/www/db-updater

COPY ["package.json", "package-lock.json", "./"]r

RUN ["npm", "install"]

CMD if [ "$ENVIRONMENT" = "prod" ]; \
    then \
        npm run build; npm run prod; \
    else \
        npm start; \
    fi