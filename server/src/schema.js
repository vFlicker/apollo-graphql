import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    launches(
    """
    The number of results to show. Must be >= 1. Default = 20
    """
    pageSize: Int
    """
    If you add a cursor here, it will only return results _after_ this cursor
    """
    after: String
    ): LaunchConnection!
    launch(id: ID!): Launch
    me: User
  }

  type Mutation {
    bookTrips(launchIds: [ID]!): TripUpdateResponse!
    cancelTrip(launchId: ID!): TripUpdateResponse!
    login(email: String): User
  }

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }

  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }

  """
  Simple wrapper around our list of launches that contains a cursor to the
  last item in the list. Pass this cursor to the launches query to fetch results
  after these.
  """
  type LaunchConnection {
    """
    indicates the current position in the data set
    """
    cursor: String!
    """
    indicates whether the data set contains any more items beyond those included
    in launches
    """
    hasMore: Boolean!
    """
    the actual data requested by a query
    """
    launches: [Launch]!
  }

  type Rocket {
    id: ID!
    name: String
    type: String
  }

  type Mission {
    name: String
    missionPatch(size: PatchSize): String
  }

  type User {
    id: ID!
    email: String!
    trips: [Launch]
    token: String
  }

  enum PatchSize {
    SMALL
    LARGE
  }
`;

export default typeDefs;
