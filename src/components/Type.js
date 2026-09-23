import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <Typewriter
      options={{
        strings: [
          "Disposable Chat Rooms",
          "Real-Time Messaging",
          "No Signups. Zero Tracking.",
          "Code & Markdown Sharing",
          "Fast on Any Network",
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type;
