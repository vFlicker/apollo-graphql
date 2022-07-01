import { gql } from '@apollo/client';

export const TRACKS = gql`
  query getTracks {
    takesForHome {
      id
      title
      thumbnail
      length
      modulesCount
      author {
        id
        name
        photo
      }
    }
  }
`;