/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";
import { resolveImageUrl } from "../imageMap";

export const Media: React.FC = () => {
  const isEmbedLoaded = useRef(false);

  useEffect(() => {
    if (isEmbedLoaded.current) return;

    // Inject Subsplash Past Messages Script
    const container = document.getElementById("subsplash-embed-4975n4f");
    if (container) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://dashboard.static.subsplash.com/production/web-client/external/embed-1.1.0.js";
      script.async = true;
      script.onload = () => {
        if ((window as any).subsplashEmbed) {
          (window as any).subsplashEmbed(
            "+5k4q/lb/li/+sk99dw4?embed&1724689315003",
            "https://subsplash.com/",
            "subsplash-embed-4975n4f"
          );
        }
      };
      container.parentElement?.insertBefore(script, container);
      isEmbedLoaded.current = true;
    }
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section className="spacer"></section>

      <section className="media-header"></section>
  
      <section className="Media1">
        <div>
          <h2>Watch Our Online Services</h2>
          <p>Join us live at 10 am, or watch our past messages during the week.</p>
        </div>
      </section>
          
      <section className="Media2">
        <button 
          className="media-button" 
          onClick={() => scrollToSection("WatchLive")}
          type="button"
        >
          live services
        </button> 
        <button 
          className="media-button" 
          onClick={() => scrollToSection("messages")}
          type="button"
        >
          past messages
        </button>     
      </section>

      <section id="WatchLive">
        <div className="sap-embed-player">
          <iframe 
            src="https://subsplash.com/+5k4q/embed/mi/*next-live?audio&logoWatermark&video"
            frameBorder="0" 
            allowFullScreen
            title="Kokomo Christian Fellowship Live Broadcast"
            style={{ borderRadius: "20px" }}
          ></iframe>
        </div>
        <style dangerouslySetInnerHTML={{__html: `div.sap-embed-player{position:relative;width:100%;height:0;padding-top:56.25%;}div.sap-embed-player>iframe{position:absolute;top:0;left:0;width:100%;height:100%;border-radius:20px;}`}} />
      </section>

      <section id="messages">
        <div id="subsplash-embed-4975n4f"></div>
      </section>

      <section className="Media3">
        <div>
          <a href="https://channelstore.roku.com/search/kokomo+christian+fellowship" target="_blank" rel="noreferrer">
            <img src={resolveImageUrl("Img/R0ku3.png")} alt="Roku App Channel" referrerPolicy="no-referrer" />
          </a>
          <a href="https://www.youtube.com/@KokomoChristianFellowship-g6k" target="_blank" rel="noreferrer">
            <img src={resolveImageUrl("Img/YouTube.png")} alt="YouTube Sermons" referrerPolicy="no-referrer" />
          </a>
          <a href="https://www.facebook.com/KokomoChristianFellowship" target="_blank" rel="noreferrer">
            <img src={resolveImageUrl("Img/100242_facebook_icon.png")} alt="Facebook Feed" referrerPolicy="no-referrer" />
          </a>
          <a href="./app" onClick={(e) => e.preventDefault()}>
            <img src={resolveImageUrl("Img/kcf app3.png")} alt="KCF Mobile App Link" referrerPolicy="no-referrer" />
          </a>
        </div>
      </section>
    </>
  );
};
