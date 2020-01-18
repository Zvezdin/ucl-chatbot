"use strict";

const Response = require('./response'),
        config = require("./config"),
        i18n = require("../i18n.config");

module.exports = class UCL{
    constructor(user, webhookEvent){
        this.user = user;
        this.webhookEvent = webhookEvent;
    }

    handlePayload(payload){
        let response;

        switch(payload){
            case "UCL_TIMETABLE":
                response = Response.genText("Here is the timetable for the user!")
                break;
        }

        return response;
    }
}