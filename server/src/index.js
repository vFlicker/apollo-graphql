import 'dotenv/config.js';

import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import isEmail from 'isemail';

import resolvers from './resolvers.js';
import typeDefs from './schema.js';
import { createStore } from './utils.js'
import LaunchAPI from './datasources/launch.js';
import UserAPI from './datasources/user.js';

// creates a sequelize connection once. NOT for every request
const store = createStore();

// set up any dataSources our resolvers need
const dataSources = () => ({
  launchAPI: new LaunchAPI(),
  userAPI: new UserAPI({ store }),
});

// the function that sets up the global context for each resolver, using the req
const context = async ({ req }) => {
  /* Our context function does:
  1. Obtain the value of the Authorization header (if any) included in the
  incoming request.
  2. Decode the value of the Authorization header.
  3. If the decoded value resembles an email address, obtain user details
  for that email address from the database and return an object that includes
  those details in the user field */
  
  // simple auth check on every request
  const auth = (req.headers && req.headers.authorization) || '';
  const email = Buffer.from(auth, 'base64').toString('ascii');

  // if the email isn't formatted validly, return null for user
  if (!isEmail.validate(email)) return { user: null };
  // find a user by their email
  const users = await store.users.findOrCreate({ where: { email } });
  const user = users && users[0] ? users[0] : null;

  return { user };
};

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  introspection: true,
  apollo: {
    key: process.env.APOLLO_KEY,
  },
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
});

const startApolloServer = async (server) => {
  const { url } = await server.listen({ port: process.env.PORT || 4000 });
  console.log(`🚀  Server ready at ${url}`);
}

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test
if (process.env.NODE_ENV !== 'test') {
  startApolloServer(server);
}
