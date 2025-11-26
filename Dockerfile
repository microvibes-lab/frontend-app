FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY pages ./pages
# COPY next.config.js . 

EXPOSE 3000

CMD ["npm", "run", "dev"]
