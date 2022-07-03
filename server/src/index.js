import { ApolloServer } from 'apollo-server';

import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { TrackAPI } from './datasources/track-api.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      trackAPI: new TrackAPI(),
    };
  },
});

const startApolloServer = async (server) => {
  const { url } = await server.listen({port: process.env.PORT || 4000});
  console.log(`🚀  Server ready at ${url}`);
}

startApolloServer(server);
