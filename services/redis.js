"use strict";

/*globals console */

var redis       = require("redis");
var nconf       = require("nconf");


var client = redis.createClient(
  nconf.get("redis:port"),
  nconf.get("redis:host")
);

client.on("connect"     , console.log("Redis is connected"));
client.on("ready"       , console.log("and now ready to go"));
client.on("reconnecting", console.log("reconnecting"));
client.on("error"       , console.log("error"));
client.on("end"         , console.log("end"));

module.exports = client;
