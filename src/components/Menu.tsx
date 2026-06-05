/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { resolveImageUrl } from "../imageMap";

export const Menu: React.FC = () => {
  return (
    <section className="Calander" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <img className="kcfCalander" src={resolveImageUrl("Img/Menu.png")} alt="Kokomo Christian Fellowship Menu" referrerPolicy="no-referrer" />
    </section>
  );
};
