# GESPRO PROJECT
<h1 align="center"><strong>Nestjs Framework, Prisma database layer w/ Angular and Apollo.</strong></h1>

<h3>Nestjs Framework (TypeScript)</h3>
<p>Nestjs is a framework for building efficient, scalable Node.js server-side applications. It uses progressive JavaScript, is built with TypeScript (preserves compatibility with pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).</p>

<h3>Prisma ORM-like layer (scala)</h3>
<p>Prisma is a performant open-source GraphQL [ORM-like layer] doing the heavy lifting in your GraphQL server. It turns your database into a GraphQL API which can be consumed by your resolvers via Prisma client. Prisma's auto-generated GraphQL API provides powerful abstractions and modular building blocks to develop flexible and scalable GraphQL backends:</p>

- **Type-safe API** including filters, aggregations, pagination and transactions.
- **Data modeling & migrations** with declarative GraphQL SDL.
- **Realtime API** using GraphQL subscriptions.
- **Advanced API composition** using GraphQL bindings and schema stitching.
- **Works with all frontend frameworks** like React, Vue.js, Angular.

<h3>Apollo Server (TypeScript)</h3>
<p>Apollo Server is a community-maintained open-source GraphQL server. It works with pretty much all Node.js HTTP server frameworks, and we’re happy to take PRs for more! Apollo Server works with any GraphQL schema built with GraphQL.js, so you can build your schema with that directly or with a convenience library such as graphql-tools.</p>

<h3>Apollo angular library (Typescript)</h3>
<p>Apollo Angular allows you to fetch data from your GraphQL server and use it in building complex and reactive UIs using the Angular framework. Apollo Angular may be used in any context that Angular may be used. In the browser, in NativeScript, or in Node.js when you want to do server side rendering.</p>

<h3>Angular Framework (TypeScript)</h3>
<p>Angular is a development platform for building mobile and desktop web applications using Typescript/JavaScript and other languages.</p>

<h3>PM2 or Process Manager 2</h3>
<p>PM2 or Process Manager 2, is an Open Source, production Node.js process manager helping Developers and Devops manage Node.js applications in production environment. In comparison with other process manager like Supervisord, Forever, Systemd, some key features of PM2 are automatic application load balancing, declarative application configuration, deployment system and monitoring.</p>

## Environment
 
+ Ubuntu version 18.04.1
+ Docker version 18.06
+ Docker Compose version 1.22.0

## Node Environment
+ Node version ^10.13.0 (lts)
+ Prisma version ^1.30
+ Nestjs version ^5.4.0
+ Angular version ^7.0.0


## Development

* Clone this project (git clone https://github.com/ysantalla/gespro.git)
* docker-compose up -d
* cd server && npm install
* npm run prisma deploy
* npm run prisma seed
* npm run dev
* cd client && npm install
* npm run ng serve

## Production with docker

* With docker compose file
* docker-compose -f docker-compose-prod.yml up -d

## Production with pm2

* npm install -g pm2
* pm2 completition instalL
* pm2 install pm2-logrotate

### Server

* pm2 start --name server dist/src/main.js -i max

### Client

* pm2 start --name=client dist/server.js -i max


## Build Production

* docker-compose -f docker-compose-prod.yml build

## Credentials

* Email -> admin@gmail.com
* Password -> ********

## Roadmap (Prisma, Nestjs, Apollo, Angular)

* [x] Authentication (JWT)
* [x] Apollo Server 2
* [ ] Realtime subscription
* [x] Prisma client Graphql
* [X] File upload via graphql with percent value.
* [X] Server Side Renderer


