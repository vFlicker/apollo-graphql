import 'dotenv/config.js';
import { ApolloServer } from 'apollo-server';

import LaunchAPI from './datasources/launch.js';
import UserAPI from './datasources/user.js';
import typeDefs from './schema.js';
import { createStore } from './utils.js'

const store = createStore();

const server = new ApolloServer({
  typeDefs,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store }),
  }),
});

const startApolloServer = async (server) => {
  const { url } = await server.listen({ port: process.env.PORT || 4000 });
  console.log(`🚀  Server ready at ${url}`);
}

startApolloServer(server);
