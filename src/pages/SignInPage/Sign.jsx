import React from "react";
import { FaGoogle } from "react-icons/fa6";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

const Sign = () => {
  return (
    <div className="mx-auto w-8/12">
      <div className="w-1/2">
        <h1>Todo List</h1>
        <h1>Sign In</h1>

        {/* Sign In Form */}
        <button className="btn btn-ouline">
          <FaGoogle /> Continue with Google
        </button>
      </div>

      {/* Lottie */}
      <div className="w-1/2">
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
