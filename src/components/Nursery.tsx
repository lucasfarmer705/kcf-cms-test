/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { resolveImageUrl } from "../imageMap";

export const Nursery: React.FC = () => {
  return (
    <>
      <section className="spacer"></section>

      <section className="Nursery1">
        <div>
          <h3>JESUS SAID, "LET THE LITTLE CHILDREN COME TO ME..."</h3>
          <h6>Matthew 19:14</h6>
          <p>
            For those with little children from birth to 5, we have a nursery where children (and moms who want to stay with their children) are welcome. The nursery is furnished with comfy rocking chairs and a large tv screen where moms who decide to stay can still listen to and watch the service. Nursery workers are available to help watch any children for moms who would like to go back to the service. Please speak with one of our helpful ushers upon arrival if you have any further questions.
          </p>
        </div>
      </section>

      <section className="Nursery2">
        <div>
          <img src={resolveImageUrl("Img/299F7657-5979-4265-A477-E9C414DFFE0C_1_201_a.jpeg")} alt="Nursery Room Cribs and Toys" referrerPolicy="no-referrer" />
        </div>
        <div>
          <img src={resolveImageUrl("Img/719C044D-AAB6-4C4E-9222-0AAC5E3D75A3_1_201_a.jpeg")} alt="Play Area and Seating" referrerPolicy="no-referrer" />
        </div>
        <div>
          <img src={resolveImageUrl("Img/053CA262-33F8-4C45-90EC-F255683D2CB8_1_201_a.jpeg")} alt="Baby Changing Table and Nursery Facilities" referrerPolicy="no-referrer" />
        </div>
      </section>

      <section className="Nursery3">
        <h5>SUNDAY MORNINGS</h5>
        <div>
          <div>
            <h6>10:00 AM - 10:30 AM</h6>
            <p>
              Feel free to keep your little ones with you in the service for as long as you like. We usually have a time of worship and testimonies where many parents keep their small children with them, though the nursery is also available for the entire service.
            </p>
          </div>

          <div>
            <h6>10:30 AM - 11:30 AM</h6>
            <p>
              The nursery is available for the rest of the service for moms to either stay with their children or for the children to be dropped off and supervised by one of our nursery workers.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
