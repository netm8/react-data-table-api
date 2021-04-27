FROM node:latest

WORKDIR /var/www/api

COPY package.json yarn.lock tsconfig.json ./

RUN npm install -g typescript
RUN yarn

COPY . .

CMD ["yarn", "start:dev"]