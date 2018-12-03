var config = { 
  watson: {
   assistant: { 
      username: "<yourServiceUsername>", 
      password: "<yourServicePassword>", 
      version: "2018-07-10",
      workspace_id: "<yourWorkspaceId>" 
    },
    discovery: {
      version: "2018-08-01",
      username: "<your discovery username>",
      password: "<your discovery password>",
      url: "https://gateway.watsonplatform.net/discovery/api"
    },
    discoveryEnv: {
      collectionId: "<your collectionId>",
      environmentId: "<your environmentId>"
    }
  } 
}; 
module.exports = config;