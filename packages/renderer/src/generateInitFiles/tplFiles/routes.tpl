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
  return <div style={ {fontSize:'12px',color:'#333'} }>loading</div>;
};
{{/if}}

const config = {{@ config}};
const Routes: React.FC = () => {
  return useRoutes(config{{if routerBase}},{ basename: '{{@ routerBase}}' }{{/if}});
};
export default Routes;
