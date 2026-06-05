/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { resolveImageUrl } from "../imageMap";
import { CmsSection, CmsSectionRenderer } from "./CmsSectionRenderer";

interface OurStoryProps {
  cmsSections?: CmsSection[];
}

export const OurStory: React.FC<OurStoryProps> = ({ cmsSections }) => {
  if (cmsSections && cmsSections.length > 0) {
    return <CmsSectionRenderer sections={cmsSections} />;
  }

  return (
    <>
      <section className="spacer"></section>

      <section className="Story2">
        <div>
          <h6>HOW IT ALL STARTED...</h6>
          <p>
            In 1975, a small group of people from various churches in the Kokomo area began to meet together weekly for prayer. Despite a good emphasis on the basic message of salvation, they were unfulfilled by a lack of teaching in their churches regarding the deeper Christian walk. This small group of people asked the Lord to send them a man of God who would teach them how to walk with Him. Meanwhile, in Lincoln, Nebraska, a certain pastor by the name of Reimar Schultze had been led by God to spend hours a day in the Word and in prayer. Suddenly, after thousands of hours on his knees, the Lord spoke to him and said, "Start packing, you're leaving next Tuesday." Of course, he did not have a clue where he was going, but he rejoiced that God had spoken. Several days later, a pastor friend of Pastor Schultze was minding his own business in his son-in-law's garage, when the Lord said to him, "Tell Schultze, 'Go to Kokomo.'" He and his family rejoiced and made their way to their new home where God and six people were waiting for them. When they arrived in Kokomo in 1977 it was just the beginning of all the wonderful miracles and changed lives that God had planned.
          </p>
        </div>
      </section>

      <section className="Story3">
        <div>
          <img src={resolveImageUrl("Img/280759CF-3C51-41EF-B264-4F0B87D7B91E_1_105_c.jpeg")} alt="Kokomo Christian Fellowship Expanding the Vision Property" referrerPolicy="no-referrer" />
        </div>
        <div>
          <h6>EXPANDING THE VISION...</h6>
          <p>
            In 2023 the Lord helped us to buy a new property! We have recently moved and are excited about all the new ways we can reach out to others, serve our community, and share the love and hope of Jesus to all those around us.
          </p>
        </div>
      </section>
    </>
  );
};
