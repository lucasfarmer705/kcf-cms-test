/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";

export const AppPage: React.FC = () => {
  const isEmbedLoaded = useRef(false);

  useEffect(() => {
    if (isEmbedLoaded.current) return;

    const container = document.getElementById("subsplash-embed-5k4q");
    if (container) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://dashboard.static.subsplash.com/production/web-client/external/embed-1.1.0.js";
      script.async = true;
      script.onload = () => {
        if ((window as any).subsplashEmbed) {
          (window as any).subsplashEmbed(
            "+5k4q/ap",
            "https://subsplash.com/",
            "subsplash-embed-5k4q"
          );
        }
      };
      container.parentElement?.insertBefore(script, container);
      isEmbedLoaded.current = true;
    }
  }, []);

  return (
    <>
      <section className="spacer"></section>
      
      <section className="app1">
        <div id="subsplash-embed-5k4q"></div>
      </section>
    </>
  );
};
