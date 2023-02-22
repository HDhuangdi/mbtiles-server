const dayjs = require('dayjs')

function logger(log, params) {
  const time = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const id = params.x + "/" + params.y + "/" + params.z;
  const str = `${time} 瓦片编号:${id} ${log}`
  console.log(str);
  return str;
}

module.exports = logger;
