FROM node:18.18.0-alpine

ARG ENVIRONMENT

ENV ENVIRONMENT=$ENVIRONMENT

WORKDIR /var/www/db-updater

COPY [".", "./"]

RUN ["npm", "install"]

RUN if [ "$ENVIRONMENT" = "prod" ]; \
    then \
        npm run build; \
    fi
    
CMD if [ "$ENVIRONMENT" = "prod" ]; \
    then \
        npm run prod; \
    else \
        npm start; \
    fi