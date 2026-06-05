/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PageRoute } from "./types";
import { CmsSection } from "./components/CmsSectionRenderer";

export interface PageData {
  route: string;
  title: string;
  isCustom: boolean;
  status: "draft" | "published";
  publishedContent: { sections: CmsSection[] };
  draftContent: { sections: CmsSection[] };
  updatedAt?: string;
  updatedBy?: string;
}

export const defaultCmsPages: Record<string, PageData> = {
  [PageRoute.Home]: {
    route: PageRoute.Home,
    title: "Home",
    isCustom: false,
    status: "published",
    publishedContent: {
      sections: [
        {
          type: "hero",
          title: "WELCOME TO KCF!",
          buttonText: "Plan Your Visit",
          buttonRoute: PageRoute.ImNew,
          subtext: "Sundays | 10:00 AM"
        },
        {
          type: "image_text",
          title: "About Us",
          text: "We at the Kokomo Christian Fellowship endeavor to be a church that seeks to live for Jesus and to follow Him in all we do. Like Paul, we have not yet arrived, but we make every effort to know Him, to be like Him, and to let Him live through us. We long to do His will and to love everyone He puts in our path. That is what this life is all about: loving God with all our hearts, abiding in Him, obeying Him, and loving all people.",
          image: "Img/kcf-sec1-new-color.png"
        },
        {
          type: "video_embed",
          title: "Watch Online",
          text: "Kokomo Christian Fellowship offers a live stream of each service, allowing you to join in worship from anywhere! Whether you're traveling, or unable to attend in person, you can experience the message, music, and fellowship online. The live stream is easy to access and ensures you stay connected to our church community, no matter where you are.",
          videoUrl: "https://subsplash.com/+5k4q/embed/mi/*recent?audio&video&logoWatermark&shareable"
        },
        {
          type: "cards_grid",
          items: [
            {
              icon: "clock",
              title: "EVENTS",
              buttonText: "Click Here",
              route: PageRoute.Events
            },
            {
              icon: "calendar",
              title: "MEMBERS",
              buttonText: "Click Here",
              route: PageRoute.MembersLogin
            },
            {
              icon: "edit",
              title: "CONNECT CARD",
              buttonText: "Click Here",
              externalUrl: "https://share.fluro.io/form/65314ac3c549de0037b5dee7"
            }
          ]
        }
      ]
    },
    get draftContent() {
      return this.publishedContent;
    }
  },
  [PageRoute.MissionVision]: {
    route: PageRoute.MissionVision,
    title: "Mission & Vision",
    isCustom: false,
    status: "published",
    publishedContent: {
      sections: [
        {
          type: "standard_header",
          title: "MISSION & VISION"
        },
        {
          type: "text_columns",
          columns: [
            {
              subtitle: "THE MISSION",
              body: "Kokomo Christian Fellowship exists to be a true local expression of the Church Universal, where disciples of Jesus Christ can worship God together, pray together, reach towards one another with the “59 one anothers” of the New Testament, and reach out to others together, while growing in the grace and knowledge of our Lord and Savior Jesus Christ through a vibrant, obedient, intimate, deepening walk with Him by the Word of God and the Holy Spirit."
            },
            {
              subtitle: "THE VISION",
              body: "Prayerfully expecting to see revival in ourselves, our city, and our nation. Within ourselves, we are trusting to see a UNITY of INTENSITY, that every member called here is present (whether previously lost or under-churched), our lives saying that Jesus Christ is worthy to be pursued with all our might, with all on the altar. For our city, we seek to be a positive, uniting, example to the Church of Kokomo, as she arises from the ashes of sectarianism, God duplicating this work nationally, and globally, in answer to our prayers."
            }
          ]
        }
      ]
    },
    get draftContent() {
      return this.publishedContent;
    }
  },
  [PageRoute.WhatWeBelieve]: {
    route: PageRoute.WhatWeBelieve,
    title: "What We Believe",
    isCustom: false,
    status: "published",
    publishedContent: {
      sections: [
        {
          type: "standard_header",
          title: "WHAT WE BELIEVE"
        },
        {
          type: "text_columns",
          columns: [
            {
              subtitle: "STATEMENT OF FAITH - PART I",
              body: "We believe: in the Eternal, Almighty God, Who has revealed Himself to mankind as Father, Son, and Holy Spirit; that through Him all things were created. We believe: that the Bible is inspired of God and is to be regarded as the final authority in all matters of faith."
            },
            {
              subtitle: "STATEMENT OF FAITH - PART II",
              body: "We believe that man, created in God's image, fell from God's favor at the beginning of time and is depraved, \"deceitful above all things, and desperately wicked\" (Jeremiah 17:9). We believe that once man is born of God, he is called to discipleship through self-denial and obedience."
            }
          ]
        }
      ]
    },
    get draftContent() {
      return this.publishedContent;
    }
  },
  [PageRoute.OurStory]: {
    route: PageRoute.OurStory,
    title: "Our Story",
    isCustom: false,
    status: "published",
    publishedContent: {
      sections: [
        {
          type: "standard_header",
          title: "OUR STORY"
        },
        {
          type: "paragraph_block",
          title: "HOW IT ALL STARTED...",
          text: "In 1975, a small group of people from various churches in the Kokomo area began to meet together weekly for prayer. Despite a good emphasis on the basic message of salvation, they were unfulfilled by a lack of teaching in their churches regarding the deeper Christian walk. This small group of people asked the Lord to send them a man of God who would teach them how to walk with Him. Meanwhile, in Lincoln, Nebraska, a certain pastor by the name of Reimar Schultze had been led by God to spend hours a day in the Word and in prayer. Suddenly, after thousands of hours on his knees, the Lord spoke to him and said, \"Start packing, you're leaving next Tuesday.\" Of course, he did not have a clue where he was going, but he rejoiced that God had spoken. Several days later, a pastor friend of Pastor Schultze was minding his own business in his son-in-law's garage, when the Lord said to him, \"Tell Schultze, 'Go to Kokomo.'\" He and his family rejoiced and made their way to their new home where God and six people were waiting for them. When they arrived in Kokomo in 1977 it was just the beginning of all the wonderful miracles and changed lives that God had planned."
        },
        {
          type: "image_text",
          title: "EXPANDING THE VISION...",
          text: "In 2023 the Lord helped us to buy a new property! We have recently moved and are excited about all the new ways we can reach out to others, serve our community, and share the love and hope of Jesus to all those around us.",
          image: "Img/280759CF-3C51-41EF-B264-4F0B87D7B91E_1_105_c.jpeg"
        }
      ]
    },
    get draftContent() {
      return this.publishedContent;
    }
  }
};
