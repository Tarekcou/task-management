import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import Loading from "../components/Loading";

const PrivateRouter = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
  // console.log(children, user);
  const location = useLocation();
  if (isLoading) return <Loading />;

  // (location);
  // if (isLoading) return <Loading />;
  if (user && user.email) return children;

  return <Navigate state={location.pathname} to={"/home"}></Navigate>;
};

export default PrivateRouter;
