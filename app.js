const Koa = require("koa");
const cors = require("koa2-cors");
const router = require('./routes/index')

const app = new Koa();

app.use(
  cors({
    origin: () => '*',
    credentials: true, //是否允许发送Cookie
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //设置所允许的HTTP请求方法'
    allowHeaders: ["Content-Type", "Authorization", "Accept"], //设置服务器支持的所有头信息字段
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"], //设置获取其他自定义字段
  })
);
app.use(router.routes());
app.listen(8087);
