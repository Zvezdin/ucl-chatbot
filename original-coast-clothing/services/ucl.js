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


    formatDate(date) {
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();
          
        return yyyy + '-' + mm + '-' + dd;
    }

    getNextWeekday(d, offset = 0) { d.setDate(d.getDate() + (1 + 7 + offset - d.getDay()) % 7); return d}

    handlePayload(payload){
        let response;

        const promisfyTimetable = (date) => {
            return [new Promise((resolve, reject)=> {
                    let keys = JSON.parse(fs.readFileSync("token.json"))

                    console.log(keys)

                    api.timetablePersonalGet(
                        keys.token,
                        keys.client_secret,
                        (error, data, response) => {
                            console.log('Response: ', response.body);
                            if(error){
                                console.log("ERROR THIS MESSED UP", error.stack)
                                reject()
                            } else {
                                let today = this.formatDate(date)
                                
                                let timetable = response.body.timetable;

                                console.log(today);
                                console.log(timetable[today]);
                                
                                let tt = timetable[today];
                                let start_time;
                                let end_time;
                                let session_title;
                                let reply;
                                let replies = "";
                                let dateStr = ""+date;

                                if (typeof tt != "undefined") {
                                    replies += "Here's what you have going for you on " + dateStr + "\n";
                                    for (var i = 0; i < tt.length; i++) {
                                        var obj = tt[i];
                                        start_time = obj["start_time"];
                                        end_time = obj["end_time"];
                                        session_title = obj["session_title"];
                                        reply = start_time + " " + end_time + " - " + session_title;
                                        replies += reply + '\n';
                                    }
                                } else {
                                    replies += "Horray! You have nothing on " + dateStr + "\n";
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

            case "UCL_TIMETABLE_NOW":
                response = promisfyTimetable(new Date())
                break;

            case "UCL_TIMETABLE_MONDAY":
                response = promisfyTimetable(this.getNextWeekday(new Date(), 0))
                break;

            case "UCL_TIMETABLE_TUESDAY":
                response = promisfyTimetable(this.getNextWeekday(new Date(), 1))
                break;

            case "UCL_TIMETABLE_WEDNESDAY":
                response = promisfyTimetable(this.getNextWeekday(new Date(), 2))
                break;

            case "UCL_TIMETABLE_THURSDAY":
                response = promisfyTimetable(this.getNextWeekday(new Date(), 3))
                break;

            case "UCL_TIMETABLE_FRIDAY":
                response = promisfyTimetable(this.getNextWeekday(new Date(), 4))
                break;

            case "UCL_TIMETABLE_SATURDAY":
                response = promisfyTimetable(this.getNextWeekday(new Date(), 5))
                break;
            
            case "UCL_TIMETABLE_SUNDAY":
                response = promisfyTimetable(this.getNextWeekday(new Date(), 6))
                break;

            case "UCL_TIMETABLE_STAT0007":
            case "UCL_TIMETABLE_COMP0002":
                response = promisfyTimetable(this.getNextWeekday(new Date(), 0))
                break;
        }

        return response;
    }
}