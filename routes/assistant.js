var config = require('../config');
var express = require('express'); 
var bodyParser = require('body-parser');
var AssistantV1 = require('watson-developer-cloud/assistant/v1');

var router = express.Router();
var jsonParser = bodyParser.json();

var watsonAssistant = new AssistantV1(config.watson.assistant);

router.post('/', jsonParser, function(req, res, next) {
  watsonAssistant.message({ 
   'input': req.body.input, 
   'context': req.body.context, 
   'workspace_id': config.watson.assistant.workspace_id 
   }, 
   function(err, response) { 
     if (err) {
       console.log('error:', err); 
     } else { 
      console.log("Detected input: " + response.input.text);
      if (response.intents.length > 0) {
        var intent = response.intents[0];
        console.log("Detected intent: " + intent.intent);
        console.log("Confidence: " + intent.confidence);
      }
      if (response.entities.length > 0) {
        var entity = response.entities[0];
        console.log("Detected entity: " + entity.entity);
        console.log("Value: " + entity.value);
        if ((entity.entity === 'help') && (entity.value === 'time')) {
          var msg = 'The current time is ' + new Date().toLocaleTimeString();
          console.log(msg);
          response.output.text = msg;
        }
      }
       // console.log(JSON.stringify(response, null, 2)); 
      res.json(response);
     } 
   }); 
});

module.exports = router;