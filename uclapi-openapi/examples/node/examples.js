const uclapi = require('@uclapi/sdk');
const dotenv = require('dotenv');
 
dotenv.config();

var api = new uclapi.DefaultApi()

//var clientSecret = "clientSecret_example"; // {String} Client secret of the authenticating app
//var clientId = "clientId_example"; // {String} Client ID of the authenticating app.
//var code = "code_example"; // {String} Secret code obtained from the authorise endpoint.

var token = "uclapi-bb81bb2b604648d-eb658ab7fc9c50d-4b5b4c4f233bf94-329560a06598893";//process.env.UCLAPI_API_KEY;

var failedTests = 0;
var passedTests = 0;

var callback = function(error, data, response) {
  var passed = true;

  if (error) {
    failedTests ++;
    passed = false;
    console.error(error.response.body);
  } else {  
    passedTests ++;
  }
  console.log((passed ? "Passed: " : "Failed: ") + response.req._header.split('?')[0]);
  //console.log(data)
  console.log("(" + (passedTests) + " / " + (passedTests + failedTests) + ")")
};
console.log("Calling the uclapi...")
// 1. People search (token, query, callback) Y
api.searchPeopleGet(
    token,
    "Earl",
    callback
);

//2. Desktop Availability (token, callback) Y
api.resourcesDesktopsGet(
    token,
    callback
);
// 3. Room Bookings Get Bookings (token, optional, callback) 
api.roombookingsBookingsGet(
    token,
    {
      roomname: "Torrington (1-19) 433",
      roomid: "433",
      start_datetime: "2020-12-01T09:00:00+00:00",
      end_datetime: "2020-12-01T09:30:00+00:00",
      date: "20200112",
      siteid: "086",
    },
    callback
);
// 4. Room Bookings Get Equipment (token, roomid, siteid, callback) Y
api.roombookingsEquipmentGet(
  token,
  "433",
  "086",
  callback
)
// 5. Room Bookings Get Free Rooms 
// (token, start_datetime, end_datetime, callback) Y
api.roombookingsFreeroomsGet(
  token,
  "2020-12-01T09:00:00+00:00",
  "2020-12-01T09:30:00+00:00",
  callback
)
// 6. Room Bookings Rooms Get (token, optional, callback) Y
api.roombookingsRoomsGet(
  token,
    {
      roomname: "Torrington (1-19) 433",
      roomid: "433",
      siteid: "086",
      sitename: "Torrington Place, 1-19",
      classification: "SS",
      capacity: "55"
  },
  callback
)
// 7. Timetable By Modules (token, modules, callback) Y
api.timetableBymoduleGet(
  token,
  "PHAS0041, STAT0007",
  callback
)
// 8. Timetable Get Departments (token, callback) Y
api.timetableDataDepartmentsGet(
  token,
  callback
)
// 9. Timetable Get Module Taught On A Given Course 
// (token, course, optional, callback)
api.timetableDataCoursesModulesGet(
  token,
  "UMNCOMSMAT05",
  {
    term_1: true,
    term_2: true,
    term_3: true,
    term_1_next_year: true,
    summer: true,
    year_long: true,
    lsr: true,
    is_summer_school: false,
    session_1: true,
    session_2: true,
    is_undergraduate: true,
    only_available: true,
    only_compulsory: true
  },
  callback
)
// 10. Timetable Get Moudles Taught By Departmnet (token, department, callback)
api.timetableDataModulesGet(
  token,
  "COMPS_ENG",
  callback
)
// 11. Workspaces Images Map Get (token, image_id, options, callback)
api.workspacesImagesMapGet(
  token,
  "48",
  {
    image_format: "base64"
  },
  callback
)
// 12. Workspaces Get Live Image Map (token, survey id, map_id, optional, callback)
api.workspacesImagesMapLiveGet(
  token,
  "48",
  "79",
  {
    image_scale: "0.02",
    circle_radius: "128",
    absent_colour: "#016810",
    occupied_colour: "#B60202",
  },
  callback
)
// 13. Workspace Sensors Averages Time Get (token, days, optional, callback)
api.workspacesSensorsAveragesTimeGet(
  token,
  "7",
  {
    survey_ids: "79,72",
    survey_filter: "student"
  }, 
  callback
)
// 14. Workspaces Sensors Get (token, survey id, callback)
api.workspacesSensorsGet(
  token,
  "79",
  {
    return_states: false
  },
  callback
)
// 15. Workspaces Get Last Update Time (token, survey id, callback)
api.workspacesSensorsLastupdatedGet(
  token, 
  "79",
  callback
)
// 16. Workspaces Get Sensor Summary (token, optional, callback)
api.workspacesSensorsSummaryGet(
  token,
  {
    survey_ids: "46, 45",
    survey_filter: "student" 
  },
  callback  
)
// 17. Workspaces Get Surveys (token, optional, callback)
api.workspacesSurveysGet(
  token, 
  {
    survey_filter: "student"
  },
  callback
)
// ALL ENDPOINTS USING OAUTH TO ADD...

console.log("End of code.")
