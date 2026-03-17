const Redis = require("ioredis");

const redis = new Redis({
  port: process.env.REDIS_PORT,
});
redis.on("error", (err) => {
  console.log("Redis not connected",err);
});
module.exports = redis;