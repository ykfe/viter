import React from 'react';
import { Outlet } from 'viter';

function Layout() {
  return (
    <div
      style={{
        boxShadow: '10px 10px 5px rgba(165,165,165,0.75)',
        width: '50%',
        margin: '0 auto',
        padding: '5px',
      }}
    >
      <Outlet></Outlet>
    </div>
  );
}

export default Layout;
