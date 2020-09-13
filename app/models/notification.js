const credentials = {
  apiKey: "4ba11d7dbc8848511ca38760c73cc7f126611acedd728218c93684467e49a2dc", // use your sandbox app API key for development in the test environment
  username: "sandbox" // use 'sandbox' for development in the test environment
};
const Africastalking = require("africastalking")(credentials);

// Initialize a service e.g. SMS
sms = Africastalking.SMS;

// Use the service
// const options = {
//     to: ['+254711XXXYYY', '+254733YYYZZZ'],
//     message: "I'm a lumberjack and its ok, I work all night and sleep all day"
// }
const caseID = 8959;
const messageoptions = {
  to: [`+254793720223`],
  message: `A match for your case id ${caseID} has been found, pairedke.`
};

// Send message and capture the response or error
sms
  .send(messageoptions)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });
