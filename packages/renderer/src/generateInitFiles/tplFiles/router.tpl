import React from 'react';
import { BrowserRouter } from 'viter';
import Routes from './routes'
export default function renderRouter() {
  return (
    <BrowserRouter {{if routerBase}}basename='{{@ routerBase}}'{{/if}}>
      <Routes />
    </BrowserRouter>
  );
}

