// @ts-nocheck
import React from 'react';
import { BrowserRouter } from '@viter/runtime';
import Routes from './routes'
export default function renderRouter() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}

