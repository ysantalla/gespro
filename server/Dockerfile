FROM node:10-alpine

RUN mkdir -p /opt/app/server
WORKDIR /opt/app/server
COPY ./ ./

# RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
