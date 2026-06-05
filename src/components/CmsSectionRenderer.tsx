import React from "react";
import { PageRoute } from "../types";
import { resolveImageUrl } from "../imageMap";

export interface CmsSection {
  type: "hero" | "image_text" | "video_embed" | "cards_grid" | "standard_header" | "text_columns" | "paragraph_block";
  title?: string;
  subtext?: string;
  text?: string;
  buttonText?: string;
  buttonRoute?: string;
  externalUrl?: string;
  image?: string;
  videoUrl?: string;
  columns?: Array<{ subtitle: string; body: string }>;
  items?: Array<{ icon: string; title: string; buttonText: string; route?: string; externalUrl?: string }>;
}

interface CmsSectionRendererProps {
  sections: CmsSection[];
  onNavigate?: (route: PageRoute) => void;
}

export const CmsSectionRenderer: React.FC<CmsSectionRendererProps> = ({ sections, onNavigate }) => {
  return (
    <>
      {sections.map((section, idx) => {
        switch (section.type) {
          case "hero":
            return (
              <section key={idx} className="sec1" id={`cms-section-${idx}`}>
                <div>
                  <h1 className="fade-in uppercase">{section.title || "WELCOME"}</h1>
                  {section.buttonText && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigate && section.buttonRoute) {
                          onNavigate(section.buttonRoute as PageRoute);
                        }
                      }}
                    >
                      {section.buttonText}
                    </button>
                  )}
                  {section.subtext && <p>{section.subtext}</p>}
                </div>
              </section>
            );

          case "image_text":
            return (
              <section key={idx} className="sec2" id={`cms-section-${idx}`}>
                <div>
                  <img 
                    src={resolveImageUrl(section.image || "")} 
                    alt={section.title || "Image content"} 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <div>
                  <h2>{section.title || "About Us"}</h2>
                  <p>{section.text}</p>
                </div>
              </section>
            );

          case "video_embed":
            return (
              <section key={idx} className="sec3" id={`cms-section-${idx}`}>
                <div>
                  <h2>{section.title || "Watch Online"}</h2>
                  <p>{section.text}</p>
                </div>
                <div className="Live_div">
                  <div className="sap-embed-player">
                    <iframe
                      src={section.videoUrl || "https://subsplash.com/+5k4q/embed/mi/*recent?audio&video&logoWatermark&shareable"}
                      frameBorder="0"
                      allowFullScreen
                      title="Recent Sermons Streamed Online"
                    ></iframe>
                  </div>
                  <style dangerouslySetInnerHTML={{__html: `div.sap-embed-player{position:relative;width:100%;height:0;padding-top:56.25%;}div.sap-embed-player>iframe{position:absolute;top:0;left:0;width:100%;height:100%;}`}} />
                </div>
              </section>
            );

          case "cards_grid":
            return (
              <section key={idx} className="sec5" id={`cms-section-${idx}`}>
                {(section.items || []).map((item, itemIdx) => (
                  <React.Fragment key={itemIdx}>
                    {itemIdx > 0 && <div className="Line_div"></div>}
                    <div className="sec5_div">
                      {item.icon === "clock" || item.icon === "time" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#ffffff">
                          <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z"></path>
                        </svg>
                      ) : item.icon === "calendar" || item.icon === "members" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#ffffff">
                          <path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#ffffff">
                          <path d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"></path>
                        </svg>
                      )}
                      <h6>{item.title}</h6>
                      {item.externalUrl ? (
                        <a href={item.externalUrl} target="_blank" rel="noreferrer">
                          <button type="button">{item.buttonText}</button>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (onNavigate && item.route) {
                              onNavigate(item.route as PageRoute);
                            }
                          }}
                        >
                          {item.buttonText}
                        </button>
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </section>
            );

          case "standard_header":
            return (
              <section key={idx} className="Mission_Header" id={`cms-section-${idx}`}>
                <div className="sec1div1">
                  <h2>{section.title}</h2>
                </div>
              </section>
            );

          case "text_columns":
            return (
              <section key={idx} className="mission2" id={`cms-section-${idx}`}>
                {(section.columns || []).map((col, colIdx) => (
                  <div key={colIdx}>
                    <h6>{col.subtitle}</h6>
                    <p>{col.body}</p>
                  </div>
                ))}
              </section>
            );

          case "paragraph_block":
            return (
              <section key={idx} className="Story2" id={`cms-section-${idx}`}>
                <div>
                  {section.title && <h6>{section.title}</h6>}
                  <p>{section.text}</p>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </>
  );
};
