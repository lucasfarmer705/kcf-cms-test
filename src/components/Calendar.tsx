/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export const Calendar: React.FC = () => {
  return (
    <section className="Calander">
      <div>
        <iframe 
          src="https://fluro-sap-storage.s3.us-west-2.amazonaws.com/64f3438e7ea2230034d6839e/image/variants/6736102aa47eed0036600250/NxN/png-kcd-Nov-Calendar.png?AWSAccessKeyId=AKIAYMPGSOLD6R2OVQET&Expires=1731607176&Signature=%2BGUjMA8Wj2mEoBSR8Ik62n6QYCY%3D&response-content-disposition=inline%3B%20filename%3D%22kcd-Nov-Calendar.png%22&response-content-type=image%2Fpng" 
          frameBorder="0"
          title="KCF Calendar"
          style={{ width: "100%", height: "100%" }}
        ></iframe>
      </div>
    </section>
  );
};
