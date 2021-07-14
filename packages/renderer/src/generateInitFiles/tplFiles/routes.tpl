{{if dynamic}}
import { dynamic, Navigate, useRoutes } from '@viter/runtime';
{{/if}}
import React from 'react';
{{each modules}}
import {{$value.name}} from '{{$value.path}}';

{{/each}}

{{if loadingComponent }}
import LoadingComponent from '{{@ loadingComponent}}';
{{/if}}
const config = {{@ config}};
const Routes: React.FC = () => {
  return useRoutes(config);
};
export default Routes;
