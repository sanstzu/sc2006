FROM node:18.18.0-alpine

ARG ENVIRONMENT

ENV ENVIRONMENT=$ENVIRONMENT

WORKDIR /var/www/api

COPY [".", "./"]

RUN ["npm", "install"]

RUN if [ "$ENVIRONMENT" = "prod" ]; \
    then \
        npm run build;  \
    fi

RUN ["echo", "$ENVIRONMENT"]

CMD if [ "$ENVIRONMENT" = "prod" ]; \
    then \
        npm run prod; \
    else \
        npm run dev; \
    fi