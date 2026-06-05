/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { resolveImageUrl } from "../imageMap";

export const Leadership: React.FC = () => {
  return (
    <>
      <section className="spacer"></section>
      
      <section className="Leadership_Header">
        <h2>LEADERSHIP</h2>
      </section>

      <section className="Leadership1">
        <div>
          <img className="Nicky" src={resolveImageUrl("Img/Nicky2.png")} alt="Nicky Farmer - Head Pastor" referrerPolicy="no-referrer" />
          <h3>Nicky Farmer</h3>
          <p>Head Pastor</p>
        </div>

        <div>
          <img className="Nicky" src={resolveImageUrl("Img/Jerry2.png")} alt="Jerry Richardson - Executive Pastor" referrerPolicy="no-referrer" />
          <h3>Jerry Richardson</h3>
          <p>Executive Pastor</p>
        </div>

        <div>
          <img className="Nicky" src={resolveImageUrl("Img/Jenn2.png")} alt="Jenn Farmer - Pastors Wife" referrerPolicy="no-referrer" />
          <h3>Jenn Farmer</h3>
          <p>Pastors Wife</p>
        </div>
      </section>

      <section className="Leadership2">
        <div>
          <img className="Nicky" src={resolveImageUrl("Img/Derrek2.png")} alt="Derek Kidwell - Elder" referrerPolicy="no-referrer" />
          <h3>Derek Kidwell</h3>
          <p>Elder</p>
        </div>

        <div>
          <img className="Nicky" src={resolveImageUrl("Img/Brett2.png")} alt="Brett Sanders - Elder" referrerPolicy="no-referrer" />
          <h3>Brett Sanders</h3>
          <p>Elder</p>
        </div>

        <div>
          <img className="Nicky" src={resolveImageUrl("Img/Nate2.png")} alt="Nate Smith - Elder" referrerPolicy="no-referrer" />
          <h3>Nate Smith</h3>
          <p>Elder</p>
        </div>
      </section>

      <section className="Leadership2">
        <div>
          <img className="Nicky" src={resolveImageUrl("Img/Laura2.png")} alt="Laura Kidwell - Coordinator" referrerPolicy="no-referrer" />
          <h3>Laura Kidwell</h3>
          <p>Coordinator</p>
        </div>

        <div>
          <img className="Nicky" src={resolveImageUrl("Img/kcf-bo-logo-photoblank.png")} alt="Lucas Farmer - Tech Director" referrerPolicy="no-referrer" />
          <h3>Lucas Farmer</h3>
          <p>Tech Director</p>
        </div>

        <div>
          <img className="Nicky" src={resolveImageUrl("Img/kcf-bo-logo-photoblank.png")} alt="Kim Branyan - Childrens Director" referrerPolicy="no-referrer" />
          <h3>Kim Branyan</h3>
          <p>Childrens Director</p>
        </div>
      </section>

      <section className="Leadership3">
        <h6>BE A PART OF OUR STORY...</h6>
        <div className="Leadership_map">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3034.6899096867437!2d-86.16713702359759!3d40.48212467142929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x881486b369f4747b%3A0xd625ab13db54296d!2sKokomo%20Christian%20Fellowship!5e0!3m2!1sen!2sus!4v1721077081989!5m2!1sen!2sus" 
            width="100%" 
            height="450" 
            style={{ border: 0, borderRadius: "10px" }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Kokomo Christian Fellowship Location Map"
          ></iframe>
        </div>
      </section>
    </>
  );
};
