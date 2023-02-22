const { createClient } = require("redis");

const { host, port } = require("../config/redis.config");

const redis = createClient({
  url: `redis://${host}:${port}`,
});
redis.connect();

async function getFromRedis(key) {
  const res = await redis.get(key);
  if (res) return Buffer.from(res, "binary");
  return null;
}

async function setForRedis(key, buffer) {
  const bufStr = buffer.toString("binary");
  const res = await redis.set(key, bufStr);
  return res;
}

module.exports = {
  redis,
  setForRedis,
  getFromRedis
}
