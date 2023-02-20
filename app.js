const resolve = (path) => require("path").resolve(__dirname, path);
const Koa = require("koa");
const Router = require("@koa/router");
const cors = require("koa2-cors");
const MBTiles = require("@mapbox/mbtiles");

const router = new Router();
let mbtiles = null;

new MBTiles(resolve("../tiles/0-14.mbtiles"), (err, mb) => {
  if(err) throw err
  mbtiles = mb;
});

function getTile(x, y, z) {
  return new Promise((resolve, reject) => {
    mbtiles.getTile(z, x, y, (err, data, headers) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}

router.get("/:z/:x/:y.pbf", async (ctx, next) => {
  let { x, y, z } = ctx.params;
  try {
    const data = await getTile(x, y, z);

    ctx.body = data;

    ctx.set("content-encoding", "gzip"); // 注意响应头
    ctx.set("content-type", "application/x-protobuf");
  } catch (e) {
    throw new Error(`tile:(${x}, ${y}, ${z}) not exist.`);
  }

  return next();
});

const app = new Koa();

app.use(
  // 跨域
  cors({
    origin: function (ctx) {
      //设置允许来自指定域名请求
      // if (ctx.url === '/tile') {
      return "*"; // 允许来自所有域名请求
      // }
    },
    maxAge: 500000000000, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //设置所允许的HTTP请求方法'
    allowHeaders: ["Content-Type", "Authorization", "Accept"], //设置服务器支持的所有头信息字段
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"], //设置获取其他自定义字段
  })
);

app.use(router.routes());

app.listen(8848);
