FROM node:18.18.0-alpine

ARG ENVIRONMENT

ENV ENVIRONMENT=$ENVIRONMENT

WORKDIR /var/www/api

COPY ["package.json", "package-lock.json", "./"]

RUN ["npm", "install"]

RUN ["echo", "$ENVIRONMENT"]

CMD if [ "$ENVIRONMENT" = "prod" ]; \
    then \
        npm run build; npm run prod; \
    else \
        npm run dev; \
    fi