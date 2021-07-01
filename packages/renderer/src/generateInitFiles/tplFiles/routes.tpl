{{if dynamic}}
import { dynamic } from '@viter/runtime';
{{/if}}
import React from 'react';
{{each modules}}
import {{$value.name}} from '{{$value.path}}';

{{/each}}
import { Navigate } from 'react-router-dom';

{{if loadingComponent }}
import LoadingComponent from '{{@ loadingComponent}}';
{{/if}}
import { useRoutes } from 'react-router-dom';
const config = {{@ config}};
const Routes: React.FC = () => {
  return useRoutes(config);
};
export default Routes;
