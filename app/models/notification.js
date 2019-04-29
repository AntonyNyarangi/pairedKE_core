const options = {
  apiKey: "2cb0f4582034bad0b91eca8f4ff9bc0f03aa6dc1a6a2a43704a70823b3de4509", // use your sandbox app API key for development in the test environment
  username: "sandbox" // use 'sandbox' for development in the test environment
};
const Africastalking = require("africastalking")(options);

// Initialize a service e.g. SMS
sms = Africastalking.SMS;

// Use the service
// const options = {
//     to: ['+254711XXXYYY', '+254733YYYZZZ'],
//     message: "I'm a lumberjack and its ok, I work all night and sleep all day"
// }
const caseID = 8959;
const messageoptions = {
  to: [`+254715898985`],
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
