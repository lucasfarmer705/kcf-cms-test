/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageRoute } from "../types";
import { resolveImageUrl } from "../imageMap";
import { CmsSection, CmsSectionRenderer } from "./CmsSectionRenderer";

interface HomeProps {
  onNavigate: (route: PageRoute) => void;
  cmsSections?: CmsSection[];
}

export const Home: React.FC<HomeProps> = ({ onNavigate, cmsSections }) => {
  if (cmsSections && cmsSections.length > 0) {
    return <CmsSectionRenderer sections={cmsSections} onNavigate={onNavigate} />;
  }

  return (
    <>
      <section className="spacer"></section>
      
      <section className="sec1">
        <div>
          <h1 className="fade-in">WELCOME TO KCF!</h1>
          <button 
            type="button" 
            onClick={() => onNavigate(PageRoute.ImNew)}
          >
            Plan Your Visit
          </button>
          <p>Sundays | 10:00 AM</p>
        </div>
      </section>

      <section className="sec2">
        <div>
          <img src={resolveImageUrl("Img/kcf-sec1-new-color.png")} alt="Kokomo Christian Fellowship church service" referrerPolicy="no-referrer" />
        </div>
        <div>
          <h2>About Us</h2>
          <p>
            We at the Kokomo Christian Fellowship endeavor to be a church that seeks to live for Jesus and to follow Him in all we do. Like Paul, we have not yet arrived, but we make every effort to know Him, to be like Him, and to let Him live through us. We long to do His will and to love everyone He puts in our path. That is what this life is all about: loving God with all our hearts, abiding in Him, obeying Him, and loving all people.
          </p>
        </div>
      </section>

      <section className="sec3">
        <div>
          <h2>Watch Online</h2>
          <p>
            Kokomo Christian Fellowship offers a live stream of each service, allowing you to join in worship from anywhere! Whether you're traveling, or unable to attend in person, you can experience the message, music, and fellowship online. The live stream is easy to access and ensures you stay connected to our church community, no matter where you are.
          </p>
        </div>
        
        <div className="Live_div">
          <div className="sap-embed-player">
            <iframe 
              src="https://subsplash.com/+5k4q/embed/mi/*recent?audio&video&logoWatermark&shareable"
              frameBorder="0" 
              allowFullScreen
              title="Recent Subsplash Sermons"
            ></iframe>
          </div>
          <style dangerouslySetInnerHTML={{__html: `div.sap-embed-player{position:relative;width:100%;height:0;padding-top:56.25%;}div.sap-embed-player>iframe{position:absolute;top:0;left:0;width:100%;height:100%;}`}} />
        </div>
      </section>

      <section className="sec5">
        <div className="sec5_div">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#ffffff">
            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z"></path>
          </svg>
          <h6>EVENTS</h6>
          <button type="button" onClick={() => onNavigate(PageRoute.Events)}>Click Here</button>
        </div>
        <div className="Line_div"></div>
        <div className="sec5_div">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#ffffff">
            <path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path>
          </svg>
          <h6>MEMBERS</h6>
          <button type="button" onClick={() => onNavigate(PageRoute.MembersLogin)}>Click Here</button>
        </div>
        <div className="Line_div"></div>
        <div className="sec5_div">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#ffffff">
            <path d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"></path>
          </svg>
          <h6>CONNECT CARD</h6>
          <a href="https://share.fluro.io/form/65314ac3c549de0037b5dee7" target="_blank" rel="noreferrer">
            <button type="button">Click Here</button>
          </a>
        </div>
      </section>
    </>
  );
};
