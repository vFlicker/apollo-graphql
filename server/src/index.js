import 'dotenv/config.js';
import { ApolloServer } from 'apollo-server';
import isEmail from 'isemail';

import LaunchAPI from './datasources/launch.js';
import UserAPI from './datasources/user.js';
import resolvers from './resolvers.js';
import typeDefs from './schema.js';
import { createStore } from './utils.js'

const store = createStore();

const server = new ApolloServer({
  context: async ({ req }) => {
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

    if (!isEmail.validate(email)) return { user: null };

    // find a user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = (users && users[0]) || null;

    return { user: { ...user.dataValues } };
  },
  typeDefs,
  resolvers,
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
