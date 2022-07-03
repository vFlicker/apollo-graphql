import { gql } from '@apollo/client';

export const GET_MODULE_AND_PARENT_TRACK = gql`
  query getModuleAndParentTrack($moduleId: ID!, $trackId: ID!) {
    module(id: $moduleId) {
      id
      title
      content
      durationInSeconds
      videoUrl
    }
    track(id: $trackId) {
      id
      title
      modules {
        id
        title
        durationInSeconds
      }
    }
  }
`;
