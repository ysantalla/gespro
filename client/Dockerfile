FROM node:8

RUN mkdir -p /opt/app/client
WORKDIR /opt/app/client
COPY ./ ./
RUN npm install && npm run build:ssr

EXPOSE 4000
CMD ["node", "dist/server.js"]
