/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CmsSection, CmsSectionRenderer } from "./CmsSectionRenderer";

interface WhatWeBelieveProps {
  cmsSections?: CmsSection[];
}

export const WhatWeBelieve: React.FC<WhatWeBelieveProps> = ({ cmsSections }) => {
  if (cmsSections && cmsSections.length > 0) {
    return <CmsSectionRenderer sections={cmsSections} />;
  }

  return (
    <>
      <section className="spacer"></section>

      <section className="Believe_Header">
        <div className="sec1div1">
          <h2>WHAT WE BELIEVE</h2>
        </div>
      </section>

      <section className="Believe1">
        <div>
          <h6>STATEMENT OF FAITH</h6>
          <p>
            We believe: in the Eternal, Almighty God, Who has revealed Himself to mankind as Father, Son, and Holy Spirit; that through Him all things were created.
          </p>
          <p>
            We believe: that the Bible is inspired of God and is to be regarded as the final authority in all matters of faith; that man, created in God's image, fell from God's favor at the beginning of time and is depraved, "deceitful above all things, and desperately wicked" (Jeremiah 17:9).
          </p>
          <p>
            We believe that once man is born of God, he is called to discipleship. He is called to follow Jesus through self-denial and obedience. He is to seek the will of God daily and that joy unspeakable and full of glory belong to those who follow Jesus, leading to the precious fruit of the Spirit and to all the wonderful things that God has prepared for them.
          </p>
        </div>
      </section>
    </>
  );
};
