import React from 'react';
import { useQuery } from '@apollo/client';
import { Layout, ModuleDetail, QueryResult } from '../components';
import { GET_MODULE_AND_PARENT_TRACK } from '../query';

const Module = ({ moduleId, trackId }) => {
  const { loading, error, data } = useQuery(GET_MODULE_AND_PARENT_TRACK, {
    variables: { moduleId, trackId }
  });

  return (
    <Layout fullWidth>
      <QueryResult error={error} loading={loading} data={data}>
        <ModuleDetail track={data?.track} module={data?.module} />
      </QueryResult>
    </Layout>
  );
};

export default Module;
