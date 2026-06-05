/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export const Give: React.FC = () => {
  return (
    <>
      <section className="spacer"></section>

      <section className="giving_header">
        <div className="sec1div1">
          <h2 className="fade-in">GIVING</h2>
        </div>
      </section>

      <section className="give1">
        <h4>WHY WE GIVE</h4>
        <div>
          <p>
            God is generous and so he calls us to be as well. What we do with what God has given us shows the world where our hearts are at and helps proclaim the gospel. We want to glorify God with every area of our lives, and that includes what we do with our finances.
          </p>
        </div>
      </section>

      <section className="give2">
        <div className="giving">
          <h6>GIVE ONLINE</h6>
          <p>
            We now have online giving that can be done at the box on the right. Sign up for one time giving or recurring giving.
          </p>
          <h6>GIVE IN PERSON</h6>
          <p>
            We have an offering during the service where you can put your offering in.
          </p>
          <h6>MAIL A CHECK</h6>
          <p>
            If you'd like to mail in a check, please send it to:<br />
            Kokomo Christian Fellowship<br />
            PO Box 299<br />
            Kokomo, IN 46903
          </p>
        </div>
        
        <div className="giving">
          <iframe 
            src="https://wallet.subsplash.com/ui/embed/BHDRCR" 
            width="100%" 
            height="630" 
            style={{ border: "none", overflow: "hidden" }} 
            frameBorder="0" 
            scrolling="no"
            title="Subsplash Giving Portal"
          ></iframe>
        </div>
      </section>
    </>
  );
};
