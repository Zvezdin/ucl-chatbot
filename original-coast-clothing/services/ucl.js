"use strict";

const Response = require('./response'),
        uclapi = require('@uclapi/sdk'),
        i18n = require("../i18n.config");

const api = new uclapi.DefaultApi();
const token = "uclapi-bb81bb2b604648d-eb658ab7fc9c50d-4b5b4c4f233bf94-329560a06598893";

const timeTableToString = function(timeTable){
    console.log("data: ", timeTable.body.timeTable);
    let scheduleFormatted;

    for(let date in timeTable.body.timetable.keys()){
        scheduleFormatted += `${date}\n`;
    }

    return "Test";
}

module.exports = class UCL{
    constructor(user, webhookEvent){
        this.user = user;
        this.webhookEvent = webhookEvent;
    }

    handlePayload(payload){
        let response;

        const callback = function(error, data, response) {
            if (error) {
                console.error('error: ', error);
            } else {
                response = Response.genText(timeTableToString(data));
            }
        };

        switch(payload){
            case "UCL_TIMETABLE":
                // Ask for user's input 
                response = Response.genQuickReply("For which module?", [
                    {
                        title: i18n.__("ucl.modules.stat0007"),
                        payload: "UCL_TIMETABLE_STAT0007"
                    },
                    {
                        title: i18n.__("ucl.modules.comp0002"),
                        payload: "UCL_TIMETABLE_COMP0002"
                    }
                ]);
                //response = Response.genText("Here is the timetable for the user!")
                break;
            case "UCL_TIMETABLE_STAT0007":
                api.timetableBymoduleGet(
                    token,
                    "STAT0007",
                    callback
                )       
                
                break;
            case "UCL_TIMETABLE_COMP0002":
                api.timetableBymoduleGet(
                    token,
                    "COMP0002",
                    callback
                );  

                break;
        }

        return response;
    }
}