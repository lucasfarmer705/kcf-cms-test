/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { resolveImageUrl } from "../imageMap";

export const Children: React.FC = () => {
  return (
    <>
      <section className="spacer"></section>

      <section className="Nursery1">
        <div>
          <h3>JESUS SAID, "LET THE LITTLE CHILDREN COME TO ME..."</h3>
          <h6>Matthew 19:14</h6>
          <p>
            We believe that children are important because they are important to Jesus. Rather than sending them off for the entire service to be with others their own age, we invite the children to join us in singing praises to God and hearing testimonies of God working in our lives. We want them to feel included as part of the church because they are. After the offering, the children ages 5-11 are invited to join in a class time where they will hear the word of God and pray together that is on their level and that they can relate to. We have two teachers who lead them in prayer, stories, Bible, snacks, and games.
          </p>
        </div>
      </section>

      <section className="Nursery2">
        <div>
          <img src={resolveImageUrl("Img/299F7657-5979-4265-A477-E9C414DFFE0C_1_201_a-jpeg")} alt="Children class activities" referrerPolicy="no-referrer" />
        </div>
        <div>
          <img src={resolveImageUrl("Img/719C044D-AAB6-4C4E-9222-0AAC5E3D75A3_1_201_a-jpeg")} alt="Children drawing and building" referrerPolicy="no-referrer" />
        </div>
        <div>
          <img src={resolveImageUrl("Img/053CA262-33F8-4C45-90EC-F255683D2CB8_1_201_a-jpeg")} alt="Kids playing board games" referrerPolicy="no-referrer" />
        </div>
      </section>

      <section className="Nursery3">
        <h5>SUNDAY MORNINGS</h5>
        <div>
          <div>
            <h6>10:00 AM - 10:30 AM</h6>
            <p>
              During this time the children join us in our worship service with some songs and testimonies. After the offering they head to the Children's Church room with their teachers.
            </p>
          </div>

          <div>
            <h6>10:30 AM - 11:30 AM</h6>
            <p>
              This is the time the children will pray together, listen to inspiring stories and learn from the Word of God, do crafts, and play games together.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
