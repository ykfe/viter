
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Router from './router';
{{@ imports}}



ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root'),
);