"use client";
// imports
import { useEffect } from "react";
import styles from "./voiceflow.module.css";

const Page = () => {
  useEffect(() => {
    const initVoiceflow = (d: Document, t: string) => {
      const v = d.createElement(t) as HTMLScriptElement;
      const s = d.getElementsByTagName(t)[0];

      v.onload = function () {
        // @ts-expect-error - Voiceflow types not available
        window.voiceflow.chat.load({
          verify: { projectID: "674b8e45bb2730de151d6ae0" },
          url: "https://general-runtime.voiceflow.com",
          versionID: "production",
          // assistant: {
          //   title: "string",
          //   description: "string",
          //   image: "string",
          //   // color: "string",
          //   stylesheet: "styles", 
          // },
          render: {
            mode: "embedded",
            target: document.getElementById("voiceflow"),
          },
          autostart: false,
        });
      };

      v.src = "https://cdn.voiceflow.com/widget/bundle.mjs";
      v.type = "text/javascript";
      s.parentNode?.insertBefore(v, s);
    };

    initVoiceflow(document, "script");

    // Cleanup
    return () => {
      const script = document.querySelector(
        'script[src="https://cdn.voiceflow.com/widget/bundle.mjs"]'
      );
      script?.parentNode?.removeChild(script);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div
        id="voiceflow"
        className="w-4/5 h-[600px] bg-white rounded-lg border-2 border-gray-300 shadow-lg p-6"
      >
      </div>
    </div>
  );
};

export default Page;
