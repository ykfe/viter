
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'vite/dynamic-import-polyfill';
import Router from './router';
{{ #imports }}
{{{ imports }}}
{{ /imports }}



ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root'),
);