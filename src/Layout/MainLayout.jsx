import React from "react";
import Home from "../pages/Home/Home";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="mx-auto w-8/12">
      <Outlet />
    </div>
  );
};

export default MainLayout;
