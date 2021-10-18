import React from 'react';
import { Outlet } from 'viter';

function Layout() {
  return (
    <div style={{ backgroundColor: '#fff8c4' }}>
      <Outlet></Outlet>
    </div>
  );
}

export default Layout;
