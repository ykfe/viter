import React from "react";
import { Outlet } from "viter";

function Layout() {
  return (
    <div style={{ backgroundColor: "GrayText", height: "400px" }}>
      <Outlet></Outlet>
    </div>
  );
}

export default Layout;
