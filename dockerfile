FROM node:18-alpine AS BUILD_IMAGE

RUN apk update && apk add yarn curl bash make && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install 
RUN npm uninstall bcrypt
RUN npm install bcryptjs
RUN npm install bcrypt

RUN npm run build
#-------------------------------------------------------------
FROM node:18-alpine

ARG PORT

WORKDIR /home/node/app

COPY --from=BUILD_IMAGE /usr/src/app/*.json /home/node/app/
COPY --from=BUILD_IMAGE /usr/src/app/.env /home/node/app/
COPY --from=BUILD_IMAGE /usr/src/app/dist /home/node/app/dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules /home/node/app/node_modules

EXPOSE ${PORT}
CMD ["npm", "run", "start:prod"]
