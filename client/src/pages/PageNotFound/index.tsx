import React from "react";
import Lottie from "react-lottie";
import animationData from "@/assets/page-not-found.json";

const PageNotFound: React.FC = () => {
  const animationDefaultOptions = {
    loop: true,
    autoPlay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "none",
    },
  };

  return (
    <div className="w-screen h-screen">
      <Lottie
        isClickToPauseDisabled={true}
        options={animationDefaultOptions}
        height={"100%"}
        width={"100%"}
      />
    </div>
  );
};

export default PageNotFound;
