import React, { Fragment, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { gql, useQuery } from '@apollo/client'
import * as GetLaunchListTypes from './__generated__/GetLaunchList';

import {
  LaunchTile,
  Header,
  Button,
  Loading
} from '../components';

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

export const GET_LAUNCHES = gql`
  query GetLaunchList($after: String) {
    launches(after: $after) {
      # The cursor field indicates the client's current position within
      # the list of launches. We can execute the query again and provide our most
      # recent cursor as the value of the $after variable to fetch the next
      # set of launches in the list.
      cursor
      # the field indicates whether there are additional launches beyond
      # the list returned by the server.
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface LaunchesProps extends RouteComponentProps {}

const Launches: React.FC<LaunchesProps> = () => {
  const {
    data,
    loading,
    error,
    fetchMore,
  } = useQuery<
    GetLaunchListTypes.GetLaunchList,
    GetLaunchListTypes.GetLaunchListVariables
  >(GET_LAUNCHES);
  const [isLoadingMore, setIsLoadingMore] = useState(false); 

  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <Fragment>
      <Header />
      {data.launches &&
        data.launches.launches &&
        data.launches.launches.map((launch: any) => (
          <LaunchTile key={launch.id} launch={launch} />
        ))}
        {data.launches && data.launches.hasMore && (isLoadingMore ? (
            <Loading />
          ) : (
            <Button
              onClick={async () => {
                setIsLoadingMore(true);
                await fetchMore({
                  variables: {
                    after: data.launches.cursor
                  }
                });
                setIsLoadingMore(false);
              }}
            >
              Load More
            </Button>
          ))}
    </Fragment>
  );
}

export default Launches;
