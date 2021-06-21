import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes'
export default function renderRouter() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}

