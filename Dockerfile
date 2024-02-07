FROM 'node:20.11.0-bullseye'

COPY . ./app
WORKDIR ./app

RUN npm install

EXPOSE 4200

CMD ["npm", "start"]