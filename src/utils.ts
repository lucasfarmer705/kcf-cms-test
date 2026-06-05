/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PageRoute } from "./types";

/**
 * Normalizes an href path into a matching PageRoute enum value.
 */
export function getRouteFromHref(href: string): PageRoute {
  // Decode space structures and remove relative slashes
  let cleanHref = decodeURIComponent(href).trim();
  
  // Remove leading './' or '/'
  if (cleanHref.startsWith("./")) {
    cleanHref = cleanHref.substring(2);
  }
  if (cleanHref.startsWith("/")) {
    cleanHref = cleanHref.substring(1);
  }

  // Trim trailing slash or extension
  if (cleanHref.endsWith("/")) {
    cleanHref = cleanHref.substring(0, cleanHref.length - 1);
  }
  if (cleanHref.endsWith(".html")) {
    cleanHref = cleanHref.substring(0, cleanHref.length - 5);
  }

  switch (cleanHref.toLowerCase()) {
    case "":
    case "index":
    case "home":
      return PageRoute.Home;
    case "mission & vision":
    case "mission-and-vision":
    case "mission_vision":
      return PageRoute.MissionVision;
    case "what we believe":
    case "what-we-believe":
    case "what_we_believe":
      return PageRoute.WhatWeBelieve;
    case "our story":
    case "our-story":
    case "our_story":
      return PageRoute.OurStory;
    case "leadership":
      return PageRoute.Leadership;
    case "contact":
      return PageRoute.Contact;
    case "nursery":
      return PageRoute.Nursery;
    case "children":
      return PageRoute.Children;
    case "volunteer":
      return PageRoute.Volunteer;
    case "media":
      return PageRoute.Media;
    case "give":
      return PageRoute.Give;
    case "i'm new":
    case "i-m-new":
    case "im-new":
    case "im_new":
      return PageRoute.ImNew;
    case "app":
      return PageRoute.App;
    case "calendar":
    case "calander":
      return PageRoute.Calendar;
    case "events":
      return PageRoute.Events;
    case "members-login":
    case "members_login":
      return PageRoute.MembersLogin;
    case "members":
      return PageRoute.Members;
    case "menu":
      return PageRoute.Menu;
    case "admin":
      return PageRoute.Admin;
    default:
      return PageRoute.Home;
  }
}
export function getHrefFromRoute(route: PageRoute): string {
  switch (route) {
    case PageRoute.Home:
      return "./";
    case PageRoute.MissionVision:
      return "./mission & vision";
    case PageRoute.WhatWeBelieve:
      return "./what we believe";
    case PageRoute.OurStory:
      return "./our story";
    case PageRoute.Leadership:
      return "./leadership";
    case PageRoute.Contact:
      return "./contact";
    case PageRoute.Nursery:
      return "./nursery";
    case PageRoute.Children:
      return "./children";
    case PageRoute.Volunteer:
      return "./volunteer";
    case PageRoute.Media:
      return "./media";
    case PageRoute.Give:
      return "./give";
    case PageRoute.ImNew:
      return "./i'm new";
    case PageRoute.App:
      return "./app";
    case PageRoute.Calendar:
      return "./calander";
    case PageRoute.Events:
      return "./events";
    case PageRoute.MembersLogin:
      return "./members-login";
    case PageRoute.Members:
      return "./members";
    case PageRoute.Menu:
      return "./menu";
    case PageRoute.Admin:
      return "./admin";
    default:
      return "./";
  }
}
