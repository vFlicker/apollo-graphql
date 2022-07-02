import React from 'react';
import { useQuery } from '@apollo/client';
import { Layout, QueryResult, TrackDetail } from '../components';
import { GET_TRACK } from '../query';

const Track = ({ trackId }) => {
  const { loading, error, data } = useQuery(GET_TRACK, {
    variables: { trackId }
  });

  return (
    <Layout grid>
      <QueryResult error={error} loading={loading} data={data}>
        <TrackDetail track={data?.track} />
      </QueryResult>
    </Layout>
  );
};

export default Track;
