"use client";
// imports
import { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    const initVoiceflow = (d: Document, t: string) => {
      const v = d.createElement(t) as HTMLScriptElement;
      const s = d.getElementsByTagName(t)[0];

      v.onload = function () {
        // @ts-expect-error - Voiceflow types not available
        window.voiceflow.chat.load({
          verify: { projectID: "674b1ac845ea06386b0b60b8" },
          url: "https://general-runtime.voiceflow.com",
          versionID: "production",
          render: {
            mode: "embedded",
            target: document.getElementById("voiceflow-test"),
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
        id="voiceflow-test"
        className="w-4/5 h-[600px] bg-white rounded-lg border-2 border-gray-300 shadow-lg p-6"
      >
        Voiceflow div
      </div>
    </div>
  );
};

export default Page;
