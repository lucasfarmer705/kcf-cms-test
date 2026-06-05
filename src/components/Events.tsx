/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";

export const Events: React.FC = () => {
  const isEmbedLoaded = useRef(false);

  useEffect(() => {
    if (isEmbedLoaded.current) return;

    const container = document.getElementById("subsplash-embed-9h566p2");
    if (container) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://dashboard.static.subsplash.com/production/web-client/external/embed-1.1.0.js";
      script.async = true;
      script.onload = () => {
        if ((window as any).subsplashEmbed) {
          (window as any).subsplashEmbed(
            "+5k4q/lb/ca/+9h566p2?embed",
            "https://subsplash.com/",
            "subsplash-embed-9h566p2"
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

      <section className="event2">
        <div id="subsplash-embed-9h566p2"></div>
      </section>
    </>
  );
};
