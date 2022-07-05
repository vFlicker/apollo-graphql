import { paginateResults } from './utils.js';

const resolvers = {
  Query: {
    launches: async (_, { pageSize = 20, after }, { dataSources }) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches();
      allLaunches.reverse(); // we want these in reverse chronological order

      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches
      });

      const lastCursor = launches.length // we need to get the next cursor
        ? launches[launches.length - 1].cursor
        : null;

      // if the cursor at the end of the paginated results is the same as the
      // last item in _all_ results, then there are no more results after this
      const hasMore = launches.length
        ? launches[launches.length - 1].cursor !==
          allLaunches[allLaunches.length - 1].cursor
        : false

      return {
        launches,
        cursor: lastCursor,
        hasMore,
      };
    },
    launch: (_, { id }, { dataSources }) => {
      return dataSources.launchAPI.getLaunchById({ launchId: id });
    },
    me:(_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser(),
  },
  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      if (user) {
        user.token = Buffer.from(email).toString('base64');
        return user;
      }
      throw new Error('Login failed');
    },
    bookTrips: async (_, { launchIds }, { dataSources }) => {
      const results = await dataSources.userAPI.bookTrips({ launchIds });
      const launches = await dataSources.launchAPI.getLaunchesByIds({ launchIds });
      return {
        success: results && results.length === launchIds.length,
        message: results.length === launchIds.length
        ? 'trips booked successfully'
        : `the following launches couldn't be booked: ${launchIds.filter(
            id => !results.includes(id),
          )}`,
        launches,
      };
    },
    cancelTrip: async (_, { launchId }, { dataSources }) => {
      const result = await dataSources.userAPI.cancelTrip({ launchId });

      if (!result)
        return {
          success: false,
          message: 'failed to cancel trip',
          launches: null,
        };
  
      const launch = await dataSources.launchAPI.getLaunchById({ launchId });
      return {
        success: true,
        message: 'trip cancelled',
        launches: [launch],
      };
    },
  },
  Mission: {
    missionPatch: (mission, { size } = { size: 'LARGE' }) => {
      return size === 'SMALL'
        ? mission.missionPatchSmall
        : mission.missionPatchLarge;
    },
  },
  User: {
    trips: async (_, __, { dataSources }) => {
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser();
      if (!launchIds.length) return [];
      return dataSources.launchAPI.getLaunchesByIds({ launchIds }) || [];
    },
  },
};

export default resolvers;
