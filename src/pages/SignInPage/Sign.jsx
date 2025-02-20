import React, { useContext } from "react";
import { FaGoogle } from "react-icons/fa6";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import { AuthContext } from "../../provider/AuthProvider";

const Sign = () => {
  const { gooleSignIn, setUser } = useContext(AuthContext);
  const signIn = () => {
    gooleSignIn()
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  return (
    <div className="flex gap-10 mx-auto my-10 w-8/12">
      <div className="flex flex-col justify-around w-1/2">
        <h1 className="text-5xl">Todo List</h1>

        <div className="flex flex-col gap-10">
          {/* Sign In Form */}
          <h1 className="text-3xl">Sign In</h1>

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
        {/* <DotLottieReact
          src="https://lottie.host/2b8326f0-06cf-45c4-823b-304231c708c6/RoJW1OgDz6.lottie"
          loop
          autoplay
        /> */}

        <Player
          autoplay
          loop
          src="https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"
          style={{ height: "300px", width: "300px" }}
        >
          <Controls
            visible={true}
            buttons={["play", "repeat", "frame", "debug"]}
          />
        </Player>
      </div>
    </div>
  );
};

export default Sign;
