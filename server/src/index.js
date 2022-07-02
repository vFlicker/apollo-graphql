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

server.listen().then(() => {
  console.log(`
    🚀  Server is running!
    🔉  Listening on port 4000
    📭  Query at https://studio.apollographql.com/dev
  `);
});
