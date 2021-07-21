{{if dynamic}}
import { dynamic } from '@viter/runtime';
{{/if}}
import { Navigate, useRoutes } from '@viter/runtime';
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
