import 'dotenv/config.js';
import { ApolloServer } from 'apollo-server';

import typeDefs from './schema.js';

const server = new ApolloServer({ typeDefs });

const startApolloServer = async (server) => {
  const { url } = await server.listen({ port: process.env.PORT || 4000 });
  console.log(`🚀  Server ready at ${url}`);
}

startApolloServer(server);
