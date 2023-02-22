const Router = require("@koa/router");
const { getFromMbtiles } = require('../db/mbtiles')
const { setForRedis, getFromRedis } = require('../db/redis')
const logger = require('./logger')

const router = new Router();

router.get("/:z/:x/:y.pbf", async (ctx, next) => {
  let { x, y, z } = ctx.params;
  ctx.set("content-encoding", "gzip"); // 注意响应头
  ctx.set("content-type", "application/x-protobuf");
  try {
    const redisKey = `${z}/${x}/${y}`;
    const redisRes = await getFromRedis(redisKey);
    if (redisRes) {
      logger('从redis中获取的数据', ctx.params)
      ctx.body = redisRes;
      return;
    }
    const data = await getFromMbtiles(x, y, z);
    ctx.body = data;
    setForRedis(redisKey, data)
    logger('从mbtiles中获取的数据', ctx.params)
  } catch (e) {
    logger('瓦片获取失败', ctx.params)
  }
  return next();
});

module.exports = router