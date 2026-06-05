/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CmsSection, CmsSectionRenderer } from "./CmsSectionRenderer";

interface MissionVisionProps {
  cmsSections?: CmsSection[];
}

export const MissionVision: React.FC<MissionVisionProps> = ({ cmsSections }) => {
  if (cmsSections && cmsSections.length > 0) {
    return <CmsSectionRenderer sections={cmsSections} />;
  }

  return (
    <>
      <section className="spacer"></section>
      
      <section className="Mission_Header">
        <div className="sec1div1">
          <h2>MISSION & VISION</h2>
        </div>
      </section>

      <section className="mission2">
        <div>
          <h6>THE MISSION</h6>
          <p>
            Kokomo Christian Fellowship exists to be a true local expression of the Church Universal, where disciples of Jesus Christ can worship God together, pray together, reach towards one another with the “59 one anothers” of the New Testament, and reach out to others together, while growing in the grace and knowledge of our Lord and Savior Jesus Christ through a vibrant, obedient, intimate, deepening walk with Him by the Word of God and the Holy Spirit.
          </p>
        </div>

        <div>
          <h6>THE VISION</h6>
          <p>
            Prayerfully expecting to see revival in ourselves, our city, and our nation. Within ourselves, we are trusting to see a UNITY of INTENSITY, that every member called here is present (whether previously lost or under-churched), our lives saying that Jesus Christ is worthy to be pursued with all our might, with all on the altar. For our city, we seek to be a positive, uniting, example to the Church of Kokomo, as she arises from the ashes of sectarianism, God duplicating this work nationally, and globally, in answer to our prayers.
          </p>
        </div>
      </section>
    </>
  );
};
