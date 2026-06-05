/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { resolveImageUrl } from "../imageMap";

interface FAQItem {
  question: string;
  answer: string;
}

export const ImNew: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What should I wear?",
      answer: "At Kokomo Christian Fellowship, we don’t have a formal dress code. You’ll find that some people like to dress up, while others prefer to come in more casual attire. Our focus is on worshipping God together, not what you wear. Whether you feel comfortable in jeans and a T-shirt or in your Sunday best, you are welcome just as you are!"
    },
    {
      question: "What are your service times?",
      answer: "We meet at 10:00 AM on Sunday mornings (in-person and online) and at 6:00 PM on Thursday nights."
    },
    {
      question: "Do you have a Children’s Program?",
      answer: "At Kokomo Christian Fellowship, we offer engaging programs for children of all ages! We have classes for kids aged 4-11, where they can learn about God through fun activities, Bible lessons, and interactive discussions. For our youngest attendees, we provide a safe and nurturing nursery for babies and toddlers, so parents can enjoy the service knowing their little ones are well cared for."
    },
    {
      question: "Do you have a youth group?",
      answer: "Yes, we have a youth group."
    },
    {
      question: "What kind of music do you sing?",
      answer: "At our church, we sing a blend of contemporary worship songs and traditional hymns. This mix allows us to embrace both the richness of classic hymns and the freshness of modern music, creating a worship experience that resonates with people of all ages. Whether you enjoy familiar hymns or newer praise songs, there’s something for everyone to connect with as we come together in worship."
    },
    {
      question: "How long are your services?",
      answer: "Typically, our services are about 90 minutes in duration."
    },
    {
      question: "Do you have a coffee bar?",
      answer: "Yes, we have a coffee bar available, offering a variety of beverages before and after services."
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <section className="spacer"></section>

      <section className="im-new-header">
        <h2 className="fade-in">I'M NEW</h2>
      </section>

      <section className="new1">
        <div>
          <h2>New Here?</h2>
          <p>
            Kokomo Christian Fellowship is a place where people can meet Jesus, engage in life-giving community, and everyone is welcome. We believe in creating a space where people can have authentic encounters with Christ, discover their gifts and use them for God's glory.
          </p>
        </div>

        <div>
          <iframe 
            className="welcome-vid" 
            src="https://www.youtube.com/embed/QqY-s6EFr5I?si=0sxFF1lLKDHVzvSE" 
            title="KCF Welcome Video" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          ></iframe>
        </div>
      </section>

      <section className="line"></section>

      <section className="new1">
        <div>
          <img src={resolveImageUrl("Img/kcf-location-seo.png")} alt="Kokomo Christian Fellowship church building" referrerPolicy="no-referrer" />
        </div>

        <div>
          <h2>Times & Location</h2>
          <p>
            Kokomo Christian Fellowship, located at 600 S Dixon Rd, Kokomo, IN, holds services on Sunday mornings at 10:00 AM (in-person and online) and Thursday nights at 6:00 PM (in-person), offering opportunities for worship, teaching, and fellowship in a welcoming environment.
          </p>
        </div>
      </section>

      <section className="facts-and-questions">
        <div className="faq">
          <h3>FAQ's</h3>
        </div>

        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className={`faq ${isOpen ? "active" : ""}`}>
              <button 
                className={`accordion ${isOpen ? "active" : ""}`} 
                onClick={() => toggleAccordion(index)}
                type="button"
              >
                {faq.question}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  width="32" 
                  height="32" 
                  fill="currentColor"
                  style={{ transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.3s" }}
                >
                  <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                </svg>
              </button>
              <div 
                className="pannel" 
                style={{ display: isOpen ? "block" : "none" }}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="times4">
        <img src={resolveImageUrl("Img/kcf-new-map-color.png")} alt="Map of Kokomo Christian Fellowship" referrerPolicy="no-referrer" />
      </section>

      <section className="times5">
        <img src={resolveImageUrl("Img/Pastor-Nicky-kcf.png")} alt="Pastor Nicky preaching at Kokomo Christian Fellowship" referrerPolicy="no-referrer" />
        <img src={resolveImageUrl("Img/Brad-Worship-kcf.png")} alt="Worship at Kokomo Christian Fellowship" referrerPolicy="no-referrer" />
        <img src={resolveImageUrl("Img/8728FE82-A518-443F-9D7C-8FF769A682BF_1_105_c.jpeg")} alt="Pastor Nicky preaching at Kokomo Christian Fellowship" referrerPolicy="no-referrer" />
        <img src={resolveImageUrl("Img/40FD14EC-3126-4881-A6E0-60A6994A4154_1_201_a.jpeg")} alt="Worship at Kokomo Christian Fellowship" referrerPolicy="no-referrer" />
      </section>
    </>
  );
};
