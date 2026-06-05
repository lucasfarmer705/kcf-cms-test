/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PageRoute } from "../types";
import { resolveImageUrl } from "../imageMap";

interface MembersLoginProps {
  onNavigate: (route: PageRoute) => void;
}

export const MembersLogin: React.FC<MembersLoginProps> = ({ onNavigate }) => {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (passcode === "gokcf") {
      onNavigate(PageRoute.Members);
    } else {
      setError("Incorrect passcode. Please try again.");
    }
  };

  return (
    <section className="login-page">
      <div className="login-container">
        <img src={resolveImageUrl("Img/kcf-box-logo-white.png")} alt="Kokomo Christian Fellowship church logo" referrerPolicy="no-referrer" />
        <h6>Members Login</h6>
        <form className="login-form" onSubmit={handleSubmit}>
          <input 
            className="login-input"
            type="password"
            id="passcode"
            placeholder="Enter Passcode"
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value);
              setError("");
            }}
            required
            autoComplete="current-password"
          />
          <button className="login-button" type="submit">Enter</button>
        </form>
        {error && <p id="error-message" style={{ color: "red" }}>{error}</p>}
      </div>
    </section>
  );
};
