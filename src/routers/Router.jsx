import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../pages/Home/Home";
import Sign from "../pages/SignInPage/Sign";
import PrivateRouter from "./PrivateRouter";
import "../App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "", // ✅ Corrected path
        element: (
          <PrivateRouter>
            <Home />
          </PrivateRouter>
        ),
      },
      {
        path: "login",
        element: <Sign />,
      },
    ],
  },
]);

export default router;
