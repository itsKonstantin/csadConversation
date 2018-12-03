var config = require('../config');
var express = require('express'); 
var bodyParser = require('body-parser');
var AssistantV1 = require('watson-developer-cloud/assistant/v1');
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

var router = express.Router();
var jsonParser = bodyParser.json();

var watsonAssistant = new AssistantV1(config.watson.assistant);
var discovery = new DiscoveryV1(config.watson.discovery);

function callDiscovery(response, res) {
  var params = {
    'query': response.input.text,
    'environment_id': config.watson.discoveryEnv.environmentId,
    'collection_id': config.watson.discoveryEnv.collectionId,
    'passages': true,
    return: 'text, title, sourceUrl, passages'
  };
  discovery.query(params, (error, results) => {
    if (error) {
      console.log("Discovery Error: " + error);
    } else {
      console.log(results);
      response.output.text = results.passages[0].passage_text;
      res.json(response);
    }
  });
}

router.post('/', jsonParser, function(req, res) {
  watsonAssistant.message({ 
   'input': req.body.input, 
   'context': req.body.context, 
   'workspace_id': config.watson.assistant.workspace_id 
  }, 
  function(err, response) {
    var isDiscovery = false; 
    var intent = null;
    var entity = null;
    if (err) {
       console.log('error:', err); 
    } else { 
      if (!response.input.text) {
        return res.json(response);
      }
      if (response.entities.length > 0) {
        entity = response.entities[0];
        console.log("Detected input: " + response.input.text);
        if (response.intents.length > 0) {
          intent = response.intents[0];
          console.log("Detected intent: " + intent.intent);
          console.log("Confidence: " + intent.confidence);
          if (intent.intent === "out_of_scope" && response.entities.indexOf("cardevice") >= -1) {  
            isDiscovery = true;
            callDiscovery(response, res);
          }
        }   
        if (entity && entity.entity !== 'cardevice') {
          console.log("Detected entity: " + entity.entity);
          console.log("Value: " + entity.value);
          if ((entity.entity === 'help') && (entity.value === 'time')) {
            var msg = 'The current time is ' + new Date().toLocaleTimeString();
            console.log(msg);
            response.output.text = msg;
          }
        }
      }
      if (!isDiscovery)  // the result is sent as passed from Watson Assistant
        res.json(response);        
    } 
  }); 
});

module.exports = router;