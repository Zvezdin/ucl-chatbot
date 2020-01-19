/**
 * Copyright 2019-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For Original Coast Clothing
 * https://developers.facebook.com/docs/messenger-platform/getting-started/sample-apps/original-coast-clothing
 */

"use strict";

// Imports dependencies
const Response = require("./response"),
  config = require("./config"),
  i18n = require("../i18n.config");

module.exports = class Curation {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response;
    let outfit;

    switch (payload) {
      case "TIMETABLE":
        response = Response.genQuickReply(i18n.__("curation.prompt"), [
          {
            title: i18n.__("curation.timetable"),
            payload: "TIMETABLE_ME"
          },
          {
            title: i18n.__("curation.course"),
            payload: "TIMETABLE_COURSE"
          }
        ]);
        break;
		
       case "ROOM":
		 response = Response.genQuickReply(i18n.__("curation.prompt"), [
		  {
      		title: i18n.__("aa"),
      		payload: "TIMETABLE_ME"
    	  },
    	  {
      		title: i18n.__("bb"),
      		payload: "TIMETABLE_COURSE"
    	  }
  	    ]);
  	    break;

		//       case "TIMETABLE_ME":
		// response = Response.genQuickReply(i18n.__("curation.pleaselogin"), [
		//           {
		// 	title: i18n.__("curation.openlogin"),
		//             payload: "CURATION_TIMETABLE"
		//   }
		// 	  	]);
		// 	  	break;
	  
      case "TIMETABLE_COURSE":
		  //TODO: display course timetable
        response = Response.genQuickReply(i18n.__("curation.course"));
        break;

	  case "TIMETABLE_ME": //CURATION_OCASION_WORK
        // send request to sign in
        break;

      case "CURATION_OTHER_STYLE":
        // Build the recommendation logic here
        outfit = `${this.user.gender}-${this.randomOutfit()}`;

        response = Response.genGenericTemplate(
          `${config.appUrl}/styles/${outfit}.jpg`,
          i18n.__("curation.title"),
          i18n.__("curation.subtitle"),
          [
            Response.genWebUrlButton(
              i18n.__("curation.shop"),
              `${config.shopUrl}/products/${outfit}`
            ),
            Response.genPostbackButton(
              i18n.__("curation.show"),
              "CURATION_OTHER_STYLE"
            )
          ]
        );
        break;
    }

    return response;
  }

  genCurationResponse(payload) {
    let occasion = payload.split("_")[3].toLowerCase();
    let budget = payload.split("_")[2].toLowerCase();
    let outfit = `${this.user.gender}-${occasion}`;

    let buttons = [
      Response.genWebUrlButton(
        i18n.__("curation.shop"),
        `${config.shopUrl}/products/${outfit}`
      ),
      Response.genPostbackButton(
        i18n.__("curation.show"),
        "CURATION_OTHER_STYLE"
      )
    ];

    if (budget === "50") {
      buttons.push(
        Response.genPostbackButton(i18n.__("curation.sales"), "CARE_SALES")
      );
    }

    let response = Response.genGenericTemplate(
      `${config.appUrl}/styles/${outfit}.jpg`,
      i18n.__("curation.title"),
      i18n.__("curation.subtitle"),
      buttons
    );

    return response;
  }

  randomOutfit() {
    let occasion = ["work", "party", "dinner"];
    let randomIndex = Math.floor(Math.random() * occasion.length);

    return occasion[randomIndex];
  }
};


function setRoomPreferences(sender_psid) {
    let response = {
        attachment: {
            type: "template",
            payload: {
                template_type: "button",
                text: "OK, let's set your room preferences so I won't need to ask for them in the future.",
                buttons: [{
                    type: "web_url",
                    url: SERVER_URL + "/options",
                    title: "Set preferences",
                    webview_height_ratio: "compact",
                    messenger_extensions: true
                }]
            }
        }
    };

    return response;
}