// @ts-nocheck

import dynamic from './dynamic';

import { Navigate, useRoutes } from 'react-router-dom';
import React from 'react';



const LoadingComponent = () => {
  return <div style={ {fontSize:'12px',color:'#333'} }>loading</div>;
};


const config = [
  {
    "path": "/home",
    "element": dynamic({ loader: () => import('/Users/jerry/github-project/viter/packages/plugins/vite-plugin-react-router-config/example/src/pages/home'), loading: <LoadingComponent />})
  },
  {
    "path": "/about",
    "element": dynamic({ loader: () => import('/Users/jerry/github-project/viter/packages/plugins/vite-plugin-react-router-config/example/src/pages/about'), loading: <LoadingComponent />})
  }
];
const Routes: React.FC = () => {
  return useRoutes(config);
};
export default Routes;
