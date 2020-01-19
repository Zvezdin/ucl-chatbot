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
                    let keys = JSON.parse(fs.readFileSync("token.json"))

                    console.log(keys)

                    api.timetablePersonalGet(
                        keys.token,
                        keys.client_secret,
                        (error, data, response) => {
                            if(error){
                                reject()
                            }else{
                                var today = new Date();
                                var dd = String(today.getDate()).padStart(2, '0');
                                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                var yyyy = today.getFullYear();
                                
                                dd = "20"; //TODO: if saturday or sunday, choose monday
                                
                                today = yyyy + '-' + mm + '-' + dd;
                                
                                let timetable = response.body.timetable;

                                console.log(today);
                                console.log(timetable[today]);
                                
                                let tt = timetable[today];
                                let start_time;
                                let end_time;
                                let session_title;
                                let reply;
                                let replies = ""

                                for (var i = 0; i < tt.length; i++) {
                                    var obj = tt[i];
                                    start_time = obj["start_time"];
                                    end_time = obj["end_time"];
                                    session_title = obj["session_title"];
                                    reply = start_time + " " + end_time + " - " + session_title;
                                    replies += reply + '\n';
                                }

                                resolve(Response.genText( replies ))
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