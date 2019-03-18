# Nestjs + Graphql + Prisma

## Quick start
<p>GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. It is an elegant approach that solves many of these problems that we have with typical REST apis. There is a great comparison between GraphQL and REST. </p>

<p>The GraphQLModule is nothing more than a wrapper around the Apollo server. We don't reinvent the wheel but provide a ready to use module instead, that brings a clean way to play with the GraphQL and Nest together.</p>

## Steps
1. npm install -g @nestjs/cli
2. npm install
3. docker-compose up -d

## Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:5000/graphql`. The app will automatically reload if you change any of the source files.

## Production server

Run `npm run start` for a prod server. Navigate to `http://localhost:4000/graphql`. 

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Environments files

.env

# ORM-like layer Prisma

**Prisma is a performant open-source GraphQL [ORM-like layer](#is-prisma-an-orm)** doing the heavy lifting in your GraphQL server. It turns your database into a GraphQL API which can be consumed by your resolvers via Prisma client.

Prisma's auto-generated GraphQL API provides powerful abstractions and modular building blocks to develop flexible and scalable GraphQL backends:

- **Type-safe API** including filters, aggregations, pagination and transactions.
- **Data modeling & migrations** with declarative GraphQL SDL.
- **Realtime API** using GraphQL subscriptions.
- **Advanced API composition** using GraphQL bindings and schema stitching.
- **Works with all frontend frameworks** like React, Vue.js, Angular.


## GraphQL API

The most important component in Prisma is the GraphQL API:

* Query, mutate & stream data via a auto-generated GraphQL CRUD API
* Define your data model and perform migrations using GraphQL SDL

Prisma's auto-generated GraphQL APIs are fully compatible with the [OpenCRUD](https://www.opencrud.org/) standard.
