FROM node:18.16.0-bullseye-slim
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
RUN npm ci --only=production && npm cache clean --force
COPY . /usr/src/app
HEALTHCHECK CMD ["npm", "run", "healthcheck"]
ENTRYPOINT exec node app.js