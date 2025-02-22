import React, { useContext } from "react";
import { FaGoogle } from "react-icons/fa6";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import { AuthContext } from "../../provider/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
// import Lottie from "lottie-react";
import signInLottie from "../../assets/sign.json";
import "@lottiefiles/lottie-player";

const Sign = () => {
  const { gooleSignIn, setUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/"; // Default to home if no redirect

  const signIn = () => {
    gooleSignIn()
      .then((result) => {
        const user = result.user;
        setUser(user);
        console.log(user);

        navigate(from, { replace: true }); // 🔥 Redirect to the previous page or home
      })
      .catch((error) => {
        console.error("Login Error:", error.message);
      });
  };
  return (
    <div className="flex md:flex-row flex-col gap-10 mx-auto py-20 w-8/12 min-h-[100vh]">
      <div className="flex flex-col justify-between w-1/2">
        <div>
          <h1 className="font-bold text-5xl">Todo List</h1>
        </div>

        <div className="flex flex-col gap-10">
          {/* Sign In Form */}
          <h1 className="font-bold text-3xl">Log In</h1>

          <button
            onClick={signIn}
            className="flex justify-center items-center border-gray-300 btn-outline btn"
          >
            <FaGoogle className="font-bold text-green-700" /> Continue with
            Google
          </button>
        </div>
      </div>

      {/* Lottie */}
      <div className="flex flex-col justify-end w-1/2">
        <lottie-player
          autoplay
          loop
          mode="normal"
          src="https://lottie.host/bac1c12a-9bf1-433f-9307-61388827aa5c/vQCnomjpIJ.json"
        ></lottie-player>
      </div>
    </div>
  );
};

export default Sign;
