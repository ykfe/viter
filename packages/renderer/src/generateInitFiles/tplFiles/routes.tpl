{{if dynamic}}
import { dynamic } from 'viter';
{{/if}}
import { Navigate, useRoutes } from 'viter';
import React from 'react';
{{each modules}}
import {{$value.name}} from '{{$value.path}}';

{{/each}}

{{if loadingComponent }}
import LoadingComponent from '{{@ loadingComponent}}';
{{else if dynamic}}
const LoadingComponent = () => {
  return <div>loading</div>;
};
{{/if}}

const config = {{@ config}};
const Routes: React.FC = () => {
  return useRoutes(config);
};
export default Routes;
