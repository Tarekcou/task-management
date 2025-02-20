import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";

const PrivateRouter = ({ children }) => {
  const { user } = useContext(AuthContext);
  console.log(children);
  const location = useLocation();
  // (location);
  // if (isLoading) return <Loading />;
  if (user && user.email) return children;

  return <Navigate state={location.pathname} to={"/login"}></Navigate>;
};

export default PrivateRouter;
