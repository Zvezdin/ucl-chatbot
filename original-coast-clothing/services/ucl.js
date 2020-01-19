"use strict";

const Response = require('./response'),
        uclapi = require('@uclapi/sdk'),
        i18n = require("../i18n.config"),
        fs = require('fs');

const api = new uclapi.DefaultApi();
const token = "uclapi-bb81bb2b604648d-eb658ab7fc9c50d-4b5b4c4f233bf94-329560a06598893";

module.exports = class UCL{
    constructor(user, webhookEvent){
        this.user = user;
        this.webhookEvent = webhookEvent;
    }

    handlePayload(payload){
        let response;

        const promisfyTimetable = (moduleName) => {
            return [Response.genText("Here is your timetable"), new Promise((resolve, reject)=> {
                keys = fs.readFileSync("token.json")

                console.log(keys)

                api.timetableBymoduleGet(
                        token,
                        moduleName,
                        (error, data, response) => {
                            if(error){
                                reject()
                            }else{
                                resolve(Response.genText(Object.keys(response.body.timetable).join('\n')))
                            }
                        }
                )
                })
            ];
        }


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
                ])
                break;

            case "UCL_TIMETABLE_STAT0007":
                response = promisfyTimetable("STAT0007")
                break;

            case "UCL_TIMETABLE_COMP0002":
                response = promisfyTimetable("COMP0002")
                break;

        }

        return response;
    }
}