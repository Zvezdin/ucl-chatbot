## Installation

Using this sdk you can import uclapi like a package from npm. This takes away the pain of having to create and worry about making requests and just get straight into coding. You can use uclapi as an npm module with the following command in your project:

``` npm install @uclapi/sdk ```

You can find a comprehensive documentation of the sdk here: 

https://www.npmjs.com/package/@uclapi/sdk

In addition the file examples.js has examples of how to use all of the endpoints that do not require oauth. If you do require to make an oauth application then you will need to have a website live to make callbacks to for the authentication steps. If you need help with this, please get in touch!

## Examples

The examples have been written as a set of tests to check the definition of the open api. This means they show you how to make the calls but not the outputs. Play around with the callback function and commenting out certain functions to leave only one. The JSON that is outputted is all summarised at https://www.uclapi.com/docs. 

## How Do I use it

```
var api = new uclapi.DefaultApi()
var token = process.env.UCLAPI_API_KEY;

var callback = function(error, data, response) {
  data.people.forEach( (person) => {
  	console.log(person.name)
  })
};

console.log("Calling the uclapi...")

api.searchPeopleGet(
    token,
    "John",
    callback
);

```

