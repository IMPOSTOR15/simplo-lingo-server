FROM node:18

WORKDIR /app

COPY package*.json ./
COPY static /app/
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
