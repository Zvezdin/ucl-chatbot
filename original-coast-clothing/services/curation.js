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
  uclapi = require('@uclapi/sdk'),
  config = require("./config"),
  i18n = require("../i18n.config");

const api = new uclapi.DefaultApi();
const token = "uclapi-bb81bb2b604648d-eb658ab7fc9c50d-4b5b4c4f233bf94-329560a06598893";


function formatRoomInfo(roomObj){
  let roomAddress = roomObj.location.address.join('\n');
  return `${roomObj.roomname} with capacity ${roomObj.capacity}\nThe room is located at:\n${roomAddress}`
}

const promisfyFreeRooms = (startDateTime, roomType) => {
  let endDateTime = new Date(startDateTime);
  endDateTime.setHours(endDateTime.getHours() + 1);

  return [Response.genText("There are a few, the closest to you is the following: "), new Promise((resolve, reject)=> {
      api.roombookingsFreeroomsGet(
              token,
              startDateTime.toISOString(),
              endDateTime.toISOString(),
              (error, data, response) => {
                  console.log('Response: ', formatRoomInfo(response.body.free_rooms.filter(room => room.classification === roomType)[0]));
                  if(error){
                      reject()
                  }else{
                      resolve(Response.genText(formatRoomInfo(response.body.free_rooms.filter(room => room.classification === roomType)[0])))
                  }
              }
      )
      })
  ];
}

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
        response = Response.genQuickReply(i18n.__("curation.roomTimePrompt"), [
        {
            title: i18n.__("curation.now"),
            payload: "ROOM_NOW"
          },
          {
            title: i18n.__("curation.hour"),
            payload: "ROOM_HOUR"
          },
          {
            title: i18n.__("curation.2hours"),
            payload: "ROOM_2HOURS"
          }
          ]);
          break;
        
        case "ROOM_NOW":
          response = Response.genQuickReply(i18n.__("curation.roomTypePrompt"), [
            {
              title: i18n.__("curation.lt"),
              payload: "ROOM_LT_NOW"
            },
            {
              title: i18n.__("curation.cr"),
              payload: "ROOM_CR_NOW"
            },
            {
              title: i18n.__("curation.ss"),
              payload: "ROOM_SS_NOW"
            },
            {
              title: i18n.__("curation.pc1"),
              payload: "ROOM_PC1_NOW"
            }
          ])
          break;

        case "ROOM_HOUR":
          response = Response.genQuickReply(i18n.__("curation.roomTypePrompt"), [
            {
              title: i18n.__("curation.lt"),
              payload: "ROOM_LT_HOUR"
            },
            {
              title: i18n.__("curation.cr"),
              payload: "ROOM_CR_HOUR"
            },
            {
              title: i18n.__("curation.ss"),
              payload: "ROOM_SS_HOUR"
            },
            {
              title: i18n.__("curation.pc1"),
              payload: "ROOM_PC1_HOUR"
            }
          ])
          break;
        
        case "ROOM_2HOURS":
          response = Response.genQuickReply(i18n.__("curation.roomTypePrompt"), [
            {
              title: i18n.__("curation.lt"),
              payload: "ROOM_LT_2HOURS"
            },
            {
              title: i18n.__("curation.cr"),
              payload: "ROOM_CR_2HOURS"
            },
            {
              title: i18n.__("curation.ss"),
              payload: "ROOM_SS_2HOURS"
            },
            {
              title: i18n.__("curation.pc1"),
              payload: "ROOM_PC1_2HOURS"
            }
          ])
          break;
        
        case "ROOM_LT_NOW":
        case "ROOM_LT_HOUR":
        case "ROOM_LT_2HOURS":
        case "ROOM_CR_NOW":
        case "ROOM_CR_HOUR":
        case "ROOM_CR_2HOURS":
        case "ROOM_SS_NOW":
        case "ROOM_SS_HOUR":
        case "ROOM_SS_2HOURS":
        case "ROOM_PC1_NOW":
        case "ROOM_PC1_HOUR":
        case "ROOM_PC1_2HOURS":
          response = this.genRoomResponse(payload);
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

  genRoomResponse(payload){
    let response;
    let startDateTime = new Date();
    let payloadArr = payload.split("_");
    let roomType  = payloadArr[1];
    let startTime = payloadArr[2].toLowerCase();

    if(startTime === '2hours'){
      startDateTime.setHours(startDateTime.getHours() + 2);
    }
    
    if(startTime === 'hour'){
      startDateTime.setHours(startDateTime.getHours() + 1);
    }

    response = promisfyFreeRooms(startDateTime, roomType);
    
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