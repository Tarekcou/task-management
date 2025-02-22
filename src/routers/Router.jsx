import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Sign from "../pages/SignInPage/Sign";
import PrivateRouter from "./PrivateRouter";
import HomePage from "../pages/Home/Home";
import HomePage2 from "../pages/Home/Home2";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "", // ✅ Corrected path
        element: (
          <PrivateRouter>
            <HomePage />
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
