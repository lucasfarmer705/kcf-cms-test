/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageRoute } from "../types";

interface MembersProps {
  onNavigate: (route: PageRoute) => void;
}

export const Members: React.FC<MembersProps> = ({ onNavigate }) => {
  return (
    <>
      <section className="spacer"></section>

      <section className="members1">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" fill="rgba(255,255,255,1)">
            <path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM8 13V15H6V13H8ZM13 13V15H11V13H13ZM18 13V15H16V13H18ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path>
          </svg>
          <h6>EVENT SCHEDULE</h6>
          <a href="https://calendar.google.com/calendar/embed?src=kokomochristianfellowship%40gmail.com&ctz=America%2FNew_York" target="_blank" rel="noreferrer">
            <button type="button">Click Here</button>
          </a>
        </div>
        
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" fill="rgba(255,255,255,1)">
            <path d="M20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM19 20V4H5V20H19ZM8 7H16V9H8V7ZM8 11H16V13H8V11ZM8 15H16V17H8V15Z"></path>
          </svg>
          <h6>PHONE LIST</h6>
          <a href="https://kokomochristianfellowship.snappages.site/phonelist" target="_blank" rel="noreferrer">
            <button type="button">Click Here</button>
          </a>
        </div>
        
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" fill="rgba(255,255,255,1)">
            <path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM8 13V15H6V13H8ZM13 13V15H11V13H13ZM18 13V15H16V13H18ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path>
          </svg>
          <h6>CALENDAR</h6>
          <button type="button" onClick={() => onNavigate(PageRoute.Calendar)}>Click Here</button>
        </div>
        
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" fill="rgba(255,255,255,1)">
            <path d="M20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM19 20V4H5V20H19ZM8 7H16V9H8V7ZM8 11H16V13H8V11ZM8 15H16V17H8V15Z"></path>
          </svg>
          <h6>TECH SUPPORT</h6>
          <a href="https://subsplash.com/u/-BHDRCR/forms/d/784c08e7-c0d9-426c-bdb8-a9b129fefbbe" target="_blank" rel="noreferrer">
            <button type="button">Click Here</button>
          </a>
        </div>
      </section>
    </>
  );
};
