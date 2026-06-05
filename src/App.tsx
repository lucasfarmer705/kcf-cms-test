/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { PageRoute } from "./types";
import { getRouteFromHref, getHrefFromRoute } from "./utils";

// Subpage components
import { Home } from "./components/Home";
import { MissionVision } from "./components/MissionVision";
import { WhatWeBelieve } from "./components/WhatWeBelieve";
import { OurStory } from "./components/OurStory";
import { Leadership } from "./components/Leadership";
import { Contact } from "./components/Contact";
import { Nursery } from "./components/Nursery";
import { Children } from "./components/Children";
import { Volunteer } from "./components/Volunteer";
import { Media } from "./components/Media";
import { Give } from "./components/Give";
import { ImNew } from "./components/ImNew";
import { AppPage } from "./components/AppPage";
import { Calendar } from "./components/Calendar";
import { Events } from "./components/Events";
import { MembersLogin } from "./components/MembersLogin";
import { Members } from "./components/Members";
import { Menu } from "./components/Menu";
import { resolveImageUrl } from "./imageMap";

// CMS dynamic imports
import { Admin } from "./components/Admin";
import { CmsSectionRenderer } from "./components/CmsSectionRenderer";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { PageData } from "./cmsDefaults";

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(PageRoute.Home);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pagesMap, setPagesMap] = useState<Record<string, PageData>>({});
  const [previewEnabled, setPreviewEnabled] = useState<boolean>(false);

  // Sync route rendering with URL hash
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#")) {
        const parsedPath = hash.substring(1);
        setCurrentRoute(getRouteFromHref(parsedPath));
      } else {
        setCurrentRoute(getRouteFromHref(window.location.pathname));
      }
      // Instantly scroll back to top of page on route change
      window.scrollTo({ top: 0, behavior: "instant" as any });
    };

    window.addEventListener("hashchange", handleUrlChange);
    window.addEventListener("popstate", handleUrlChange);
    handleUrlChange();

    return () => {
      window.removeEventListener("hashchange", handleUrlChange);
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  // Real-time synchronization of Firebase CMS Page documents
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pages"), (snapshot) => {
      const data: Record<string, PageData> = {};
      snapshot.forEach((doc) => {
        data[doc.id] = doc.data() as PageData;
      });
      setPagesMap(data);
    }, (error) => {
      console.warn("Firestore pages index loaded failed:", error);
    });

    const isPreview = localStorage.getItem("cms_preview_enabled") === "true";
    setPreviewEnabled(isPreview);

    return () => unsubscribe();
  }, [currentRoute]);

  const getCmsSections = (route: string) => {
    const page = pagesMap[route];
    if (!page) return undefined;
    return previewEnabled 
      ? page.draftContent?.sections 
      : page.publishedContent?.sections;
  };

  const customPages = (Object.values(pagesMap) as PageData[]).filter(p => p.isCustom);

  const navigateToRoute = (route: PageRoute) => {
    window.location.hash = getHrefFromRoute(route);
    setCurrentRoute(route);
    setIsSidebarOpen(false);
  };

  // Intercept standard local page relative links
  const handleGlobalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    let target = e.target as HTMLElement | null;
    while (target && target.tagName !== "A") {
      target = target.parentElement;
    }
    if (target && target.tagName === "A") {
      const href = target.getAttribute("href");
      if (href && (href.startsWith("./") || href.startsWith("/") || !href.includes("://"))) {
        // Skip dummy hash links, empty paths, or anchors
        if (href === "#" || href === "" || href.startsWith("#")) {
          return;
        }
        e.preventDefault();
        const nextRoute = getRouteFromHref(href);
        navigateToRoute(nextRoute);
      }
    }
  };

  const showSidebar = () => setIsSidebarOpen(true);
  const hideSidebar = () => setIsSidebarOpen(false);

  // Render subpage content main body
  const renderPageContent = () => {
    switch (currentRoute) {
      case PageRoute.Home:
        return <Home onNavigate={navigateToRoute} cmsSections={getCmsSections(PageRoute.Home)} />;
      case PageRoute.MissionVision:
        return <MissionVision cmsSections={getCmsSections(PageRoute.MissionVision)} />;
      case PageRoute.WhatWeBelieve:
        return <WhatWeBelieve cmsSections={getCmsSections(PageRoute.WhatWeBelieve)} />;
      case PageRoute.OurStory:
        return <OurStory cmsSections={getCmsSections(PageRoute.OurStory)} />;
      case PageRoute.Admin:
        return <Admin />;
      case PageRoute.Leadership:
        return <Leadership />;
      case PageRoute.Contact:
        return <Contact />;
      case PageRoute.Nursery:
        return <Nursery />;
      case PageRoute.Children:
        return <Children />;
      case PageRoute.Volunteer:
        return <Volunteer />;
      case PageRoute.Media:
        return <Media />;
      case PageRoute.Give:
        return <Give />;
      case PageRoute.ImNew:
        return <ImNew />;
      case PageRoute.App:
        return <AppPage />;
      case PageRoute.Calendar:
        return <Calendar />;
      case PageRoute.Events:
        return <Events />;
      case PageRoute.MembersLogin:
        return <MembersLogin onNavigate={navigateToRoute} />;
      case PageRoute.Members:
        return <Members onNavigate={navigateToRoute} />;
      case PageRoute.Menu:
        return <Menu />;
      default:
        // Try rendering custom dynamic CMS pages
        const customPage = pagesMap[currentRoute];
        if (customPage) {
          const sections = previewEnabled 
            ? customPage.draftContent?.sections 
            : customPage.publishedContent?.sections;
          return <CmsSectionRenderer sections={sections || []} onNavigate={navigateToRoute} />;
        }
        return <Home onNavigate={navigateToRoute} cmsSections={getCmsSections(PageRoute.Home)} />;
    }
  };

  // Check custom special header types
  const hasSimpleHeader = currentRoute === PageRoute.Calendar;
  const hasNoHeaderFooter = currentRoute === PageRoute.MembersLogin || currentRoute === PageRoute.Menu || currentRoute === PageRoute.Admin;

  return (
    <div onClick={handleGlobalClick} id="app-root-container">
      {/* CMS PREVIEW WORKSPACE DECORATOR BAR */}
      {previewEnabled && (
        <div style={{ backgroundColor: "#f59e0b", color: "#0f172a", fontSize: "11px", fontWeight: "bold", padding: "6px 12px", textAlign: "center", position: "fixed", bottom: "16px", right: "16px", zIndex: 100000, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", borderRadius: "4px" }}>
          <span>✨ Previewing draft edits live!</span>
          <button 
            onClick={() => {
              localStorage.removeItem("cms_preview_enabled");
              window.location.reload();
            }}
            style={{ marginLeft: "8px", backgroundColor: "#0f172a", color: "white", outline: "none", border: "none", fontSize: "9px", padding: "2px 6px", cursor: "pointer", borderRadius: "2px" }}
          >
            Exit
          </button>
        </div>
      )}

      {/* 1. RENDER HEADER NAV BAR */}
      {!hasNoHeaderFooter && (
        <header>
          <nav>
            {hasSimpleHeader ? (
              // Simple Header layout for Calendar
              <li>
                <a href="./" onClick={(e) => { e.preventDefault(); navigateToRoute(PageRoute.Home); }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                    <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path>
                  </svg>
                </a>
              </li>
            ) : (
              // Full navigation header
              <>
                <ul className="sidebar" style={{ display: isSidebarOpen ? "flex" : "none" }}>
                  <li onClick={hideSidebar}>
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <i id="x" className="fa-solid fa-x" style={{ color: "#ffffff" }}></i>
                    </a>
                  </li>
                  <li><a href="./">Home</a></li>
                  <li><a href="./mission & vision">Mission & Vision</a></li>
                  <li><a href="./what we believe">What We Believe</a></li>
                  <li><a href="./our story">Our Story</a></li>
                  <li><a href="./leadership">Leadership</a></li>
                  <li><a href="./contact">Contact</a></li>
                  <li><a href="./nursery">Nursery</a></li>
                  <li><a href="./children">Children</a></li>
                  <li><a href="./volunteer">Volunteer</a></li>
                  <li><a href="./media">Media</a></li>
                  <li><a href="./give">Give</a></li>
                  <li><a href="./i'm new">I'm New</a></li>
                  <li><a href="./app">App</a></li>
                  {customPages.map(cp => (
                    <li key={cp.route}><a href={`./${cp.route}`}>{cp.title}</a></li>
                  ))}
                </ul>

                <li className="brand-li">
                  <a href="./" className="logo-link" onClick={(e) => { e.preventDefault(); navigateToRoute(PageRoute.Home); }}>
                    <img className="logo" src={resolveImageUrl("Img/kcf-box-logo-big.png")} alt="Kokomo Christian Fellowship church logo" referrerPolicy="no-referrer" />
                  </a>
                  <a href="./" className="word-logo" onClick={(e) => { e.preventDefault(); navigateToRoute(PageRoute.Home); }}>
                    <strong>Kokomo Christian</strong>&nbsp;Fellowship
                  </a>
                </li>

                <ul className="top-ul">
                  <li className="HideOnMoble"><a href="./">Home</a></li>
                  <li>
                    <a className="HideOnMoble" href="" onClick={(e) => e.preventDefault()}>
                      About&nbsp;
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                      </svg>
                    </a>
                    <ul className="dropdown">
                      <li className="HideOnMoble"><a href="./mission & vision">Mission & Vision</a></li>
                      <li className="HideOnMoble"><a href="./what we believe">What We Believe</a></li>
                      <li className="HideOnMoble"><a href="./our story">Our Story</a></li>
                      <li className="HideOnMoble"><a href="./leadership">Leadership</a></li>
                      <li className="HideOnMoble"><a href="./contact">Contact</a></li>
                    </ul>
                  </li>
                  <li>
                    <a className="HideOnMoble" href="" onClick={(e) => e.preventDefault()}>
                      Connect&nbsp;
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                      </svg>
                    </a>
                    <ul className="dropdown">
                      <li className="HideOnMoble"><a href="./nursery">Nursery</a></li>
                      <li className="HideOnMoble"><a href="./children">Children</a></li>
                      <li className="HideOnMoble"><a href="./volunteer">Volunteer</a></li>
                      <li className="HideOnMoble"><a href="./app">App</a></li>
                      {customPages.map(cp => (
                        <li key={cp.route} className="HideOnMoble"><a href={`./${cp.route}`}>{cp.title}</a></li>
                      ))}
                    </ul>
                  </li>
                  <li className="HideOnMoble"><a href="./media">Media</a></li>
                  <li className="HideOnMoble"><a href="./give">Give</a></li>
                  <li className="HideOnMoble"><a href="./i'm new">I'm New</a></li>
                  <li onClick={showSidebar}>
                    <a className="menu" href="#" onClick={(e) => e.preventDefault()}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24" width="21" viewBox="0 0 448 512">
                        <path fill="#5b5b5b" d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/>
                      </svg>
                    </a>
                  </li>
                </ul>
              </>
            )}
          </nav>
        </header>
      )}

      {/* 2. MAIN ACTIVE VIEW CONTENT */}
      <main id="sp-content">
        {renderPageContent()}
      </main>

      {/* 3. FOOTER DIRECTIVES */}
      {!hasNoHeaderFooter && !hasSimpleHeader && (
        <>
          <section className="sec7">
            <div className="info_div">
              <ul className="bottom nav">
                <li><a href="./"><img className="logobottom" src={resolveImageUrl("Img/1.png")} alt="Church box white logo emblem" referrerPolicy="no-referrer" /></a></li>
                <li className="info_li"><a href="tel:+7654576061">Phone: 765-457-6061</a></li>
                <li className="info_li"><a href="https://www.google.com/maps/place/Kokomo+Christian+Fellowship/@40.4821247,-86.1645621,17z/data=!3m1!4b1!4m6!3m5!1s0x881486b369f4747b:0xd625ab13db54296d!8m2!3d40.4821247!4d-86.1645621!16s%2Fg%2F1trprdgl?entry=ttu" target="_blank" rel="noreferrer">600 S Dixon Rd, Kokomo, IN 46901</a></li>
              </ul>
            </div>

            <div className="HideNav">
              <ul className="bottom nav">
                <h6>About</h6>
                <li><a href="./mission & vision">Mission & Vision</a></li>
                <li><a href="./what we believe">What We Believe</a></li>
                <li><a href="./leadership">Leadership</a></li>
                <li><a href="./our story">Our Story</a></li>
                <li><a href="./contact">Contact</a></li>
              </ul>
            </div>

            <div className="HideNav"> 
              <ul className="bottom nav">
                <h6>Connect</h6>
                <li><a href="./nursery">Nursery</a></li>
                <li><a href="./children">Children</a></li>
                <li><a href="./volunteer">Volunteer</a></li>
                <li><a href="./app">App</a></li>
              </ul>
            </div>

            <div className="HideNav">
              <ul className="bottom nav">
                <h6>Other</h6>
                <li><a href="./media">Media</a></li>
                <li><a href="./give">Give</a></li>
                <li><a href="./i'm new">I'm New</a></li>
                {customPages.map(cp => (
                  <li key={cp.route}><a href={`./${cp.route}`}>{cp.title}</a></li>
                ))}
                <li style={{ marginTop: "16px" }}><a href="./admin" style={{ color: "#9ca3af", fontSize: "0.75rem", textDecoration: "underline", textDecorationStyle: "dotted", display: "block" }}>CMS Admin Portal</a></li>
              </ul>
            </div>
          </section>

          <footer style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "20px" }}>
            <div>© 2025 Kokomo Christian Fellowship. | All Rights Reserved.</div>
            <div>
              <a href="./admin" style={{ color: "#60a5fa", textDecoration: "underline", fontWeight: "bold", fontSize: "0.95rem" }}>
                🔒 Go to Website Admin Portal (/admin)
              </a>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
