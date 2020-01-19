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

const Curation = require("./curation"),
  Order = require("./order"),
  Response = require("./response"),
  Care = require("./care"),
  UCL = require("./ucl"),
  Survey = require("./survey"),
  GraphAPi = require("./graph-api"),
  i18n = require("../i18n.config");

module.exports = class Receive {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  // Check if the event is a message or postback and
  // call the appropriate handler function
  handleMessage() {
    let event = this.webhookEvent;

    let responses;

    try {
      if (event.message) {
        let message = event.message;
        if (message.quick_reply) {
          responses = this.handleQuickReply();
        } else if (message.attachments) {
          responses = this.handleAttachmentMessage();
        } else if (message.text) {
          responses = this.handleTextMessage();
        }
      } else if (event.postback) {
        responses = this.handlePostback();
      } else if (event.referral) {
        responses = this.handleReferral();
      }
    } catch (error) {
      //console.error(error);
      responses = {
        text: `An error has occured: '${error}'. We have been notified and \
        will fix the issue shortly!`
      };
    }

    if (Array.isArray(responses)) {
      let delay = 0;
      for (let response of responses) {
        if(typeof response.then == 'function'){
          Promise.resolve(response).then(data => {
            this.sendMessage(data, delay * 1000);
          }).catch(err => {
            console.log("error: ", err)
          })
        }else{
          this.sendMessage(response, delay * 1000);
        }
        delay++;
      }
    } else {
      if(typeof responses.then == 'function'){
        Promise.resolve(responses).then(data => {
          this.sendMessage(data);
        }).catch(err =>{
          console.log("error: ", err)
        })
      } else{
        this.sendMessage(responses);
      }
    }
  }

  // Handles messages events with text
  handleTextMessage() {
    /*console.log(
      "Received text:",
      `${this.webhookEvent.message.text} for ${this.user.psid}`
    );*/

    // check greeting is here and is confident
    let greeting = this.firstEntity(this.webhookEvent.message.nlp, "greetings");

    let message = this.webhookEvent.message.text.trim().toLowerCase();

    let response;

    if (
      (greeting && greeting.confidence > 0.8) ||
      message.includes("start over")
    ) {
      response = Response.genNuxMessage(this.user);
    } else if (message.includes("#")) {
      response = Survey.handlePayload("CSAT_SUGGESTION");
    } else if(message.includes(i18n.__("ucl.timetable").toLowerCase())){
      let ucl = new UCL(this.user, this.webhookEvent);
      response = ucl.handlePayload("UCL_TIMETABLE");
    } else if(message.includes("now")) {
      let ucl = new UCL(this.user, this.webhookEvent);
      response = ucl.handlePayload("UCL_TIMETABLE_NOW");
    } else if(message.includes("monday")) {
      let ucl = new UCL(this.user, this.webhookEvent);
      response = ucl.handlePayload("UCL_TIMETABLE_MONDAY");
    } else if(message.includes("tuesday")) {
      let ucl = new UCL(this.user, this.webhookEvent);
      response = ucl.handlePayload("UCL_TIMETABLE_TUESDAY");
    } else if(message.includes("wednesday")) {
      let ucl = new UCL(this.user, this.webhookEvent);
      response = ucl.handlePayload("UCL_TIMETABLE_WEDNESDAY");
    } else if(message.includes("thursday")) {
      let ucl = new UCL(this.user, this.webhookEvent);
      response = ucl.handlePayload("UCL_TIMETABLE_THURSDAY");
    } else if(message.includes("friday")) {
      let ucl = new UCL(this.user, this.webhookEvent);
      response = ucl.handlePayload("UCL_TIMETABLE_FRIDAY");
    } else if(message.includes("saturday")) {
      let ucl = new UCL(this.user, this.webhookEvent);
      response = ucl.handlePayload("UCL_TIMETABLE_SATURDAY");
    } else if(message.includes("sunday")) {
      let ucl = new UCL(this.user, this.webhookEvent);
      response = ucl.handlePayload("UCL_TIMETABLE_SUNDAY");
    } else {
      response = [
        Response.genText(
          i18n.__("fallback.any", {
            message: this.webhookEvent.message.text
          })
        ),
        Response.genText(i18n.__("get_started.guidance")),
        Response.genQuickReply(i18n.__("get_started.help"), [
          {
            title: i18n.__("menu.suggestion"),
            payload: "TIMETABLE"
          },
          {
            title: i18n.__("menu.help"),
            payload: "ROOM"
          }
        ])
      ];
    }

    return response;
  }

  // Handles mesage events with attachments
  handleAttachmentMessage() {
    let response;

    // Get the attachment
    let attachment = this.webhookEvent.message.attachments[0];
    //console.log("Received attachment:", `${attachment} for ${this.user.psid}`);

    response = Response.genQuickReply(i18n.__("fallback.attachment"), [
      {
        title: i18n.__("menu.start_over"),
        payload: "GET_STARTED"
      }
    ]);

    return response;
  }

  // Handles mesage events with quick replies
  handleQuickReply() {
    // Get the payload of the quick reply
    let payload = this.webhookEvent.message.quick_reply.payload;

    return this.handlePayload(payload);
  }

  // Handles postbacks events
  handlePostback() {
    let postback = this.webhookEvent.postback;
    // Check for the special Get Starded with referral
    let payload;
    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
      payload = postback.referral.ref;
    } else {
      // Get the payload of the postback
      payload = postback.payload;
    }
    return this.handlePayload(payload.toUpperCase());
  }

  // Handles referral events
  handleReferral() {
    // Get the payload of the postback
    let payload = this.webhookEvent.referral.ref.toUpperCase();

    return this.handlePayload(payload);
  }
  
  // handleCallback(code, client_id) {
// 	  let response;
// 	  response = Survey.handlePayload("TIMETABLE_CALLBACK");
//   }

  handlePayload(payload) {
    //console.log("Received Payload:", `${payload} for ${this.user.psid}`);

    
    // Log CTA event in FBA
    GraphAPi.callFBAEventsAPI(this.user.psid, payload);

    let response;

    // Set the response based on the payload
    if (
      payload === "GET_STARTED" ||
      payload === "DEVDOCS" ||
      payload === "GITHUB"
    ) {
      response = Response.genNuxMessage(this.user);
    } else if(payload.includes("UCL")) {
      let ucl = new UCL(this.user, this.webhookEvent);
      response = ucl.handlePayload(payload);
    
    } else if (payload.includes("TIMETABLE") || payload.includes("ROOM")) {
      let curation = new Curation(this.user, this.webhookEvent);
      response = curation.handlePayload(payload);
    } else if (payload.includes("CSAT")) {
      response = Survey.handlePayload(payload);
    } else if (payload.includes("CHAT-PLUGIN")) {
      response = [
        Response.genText(i18n.__("chat_plugin.prompt")),
        Response.genText(i18n.__("get_started.guidance")),
        Response.genQuickReply(i18n.__("get_started.help"), [
          {
            title: i18n.__("care.order"),
            payload: "CARE_ORDER"
          },
          {
            title: i18n.__("care.billing"),
            payload: "CARE_BILLING"
          },
          {
            title: i18n.__("care.other"),
            payload: "CARE_OTHER"
          }
        ])
      ];
    } else {
      response = {
        text: `This is a default postback message for payload: ${payload}!`
      };
    }

    return response;
  }

  handlePrivateReply(type,object_id) {
    let welcomeMessage = i18n.__("get_started.welcome") + " " +
      i18n.__("get_started.guidance") + ". " +
      i18n.__("get_started.help");

    let response = Response.genQuickReply(welcomeMessage, [
      {
        title: i18n.__("menu.suggestion"),
        payload: "TIMETABLE"
      },
      {
        title: i18n.__("menu.help"),
        payload: "ROOM"
      }
    ]);

    let requestBody = {
      recipient: {
        [type]: object_id
      },
      message: response
    };

    GraphAPi.callSendAPI(requestBody);
  }

  sendMessage(response, delay = 0) {
    // Check if there is delay in the response
    if ("delay" in response) {
      delay = response["delay"];
      delete response["delay"];
    }

    // Construct the message body
    let requestBody = {
      recipient: {
        id: this.user.psid
      },
      message: response
    };

    // Check if there is persona id in the response
    if ("persona_id" in response) {
      let persona_id = response["persona_id"];
      delete response["persona_id"];

      requestBody = {
        recipient: {
          id: this.user.psid
        },
        message: response,
        persona_id: persona_id
      };
    }

    setTimeout(() => GraphAPi.callSendAPI(requestBody), delay);
  }

  firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
  }
};
