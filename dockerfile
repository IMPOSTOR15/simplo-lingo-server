FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

COPY backup_simplolingo.sql /backup_simplolingo.sql

CMD ["npm", "start"]

# CMD bash -c "psql -h postgres -U postgres -d simplo_lingo < /backup_simplolingo.sql & npm start"
