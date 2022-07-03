import React, { Fragment } from 'react';
import { Router } from '@reach/router';
/** importing our pages */
import Module from './module';
import Tracks from './tracks';
import Track from './track';

export default function Pages() {
  return (
    <Router primary={false} component={Fragment}>
      <Tracks path="/" />
      <Track path="/track/:trackId" />
      <Module path="/track/:trackId/module/:moduleId" />
    </Router>
  );
}
