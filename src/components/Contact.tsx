/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export const Contact: React.FC = () => {
  return (
    <>
      <section className="spacer"></section>

      <section className="Contact1">
        <div>
          <iframe 
            className="connect_card" 
            src="https://share.fluro.io/form/65314ac3c549de0037b5dee7" 
            frameBorder="0" 
            scrolling="no" 
            title="Contact Us Form"
            style={{ width: "100%", height: "100%" }}
          ></iframe>
        </div>
      </section>

      <section className="Leadership3">
        <h2>BE A PART OF OUR STORY...</h2>
        <div className="Leadership_map">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3034.6899096867437!2d-86.16713702359759!3d40.48212467142929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x881486b369f4747b%3A0xd625ab13db54296d!2sKokomo%20Christian%20Fellowship!5e0!3m2!1sen!2sus!4v1721077081989!5m2!1sen!2sus" 
            width="100%" 
            height="450" 
            style={{ border: 0, borderRadius: "10px" }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Kokomo Christian Fellowship Map Location"
          ></iframe>
        </div>
      </section>
    </>
  );
};
