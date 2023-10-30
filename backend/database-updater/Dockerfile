FROM node:18.18.0-alpine

ARG ENVIRONMENT

ENV ENVIRONMENT=$ENVIRONMENT

WORKDIR /var/www/db-updater

COPY [".", "./"]r

RUN ["npm", "install"]

RUN ["npm", "run", "build"]

CMD if [ "$ENVIRONMENT" = "prod" ]; \
    then \
        npm run prod; \
    else \
        npm start; \
    fi