var nconf         = require("nconf"),
    kue           = require("kue"),
    moment        = require('moment');

var jobs = kue.createQueue({
  prefix: "kue",
  redis: {
    port: nconf.get("redis:port"),
    host: nconf.get("redis:host"),
    db: 3
  }
});



jobs.process('articlePublisher', function(job, done){
  /**
   * Article Publisher Handler Code
   */
});


module.exports = jobs;
/***

 La doc pour les fonctions à appeler est provisoirement  ici :
 http://git.rednet.io/krommatik/ec2-workers/blob/master/launcher.js

 ***/
