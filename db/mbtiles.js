const MBTiles = require("@mapbox/mbtiles");
const resolve = (path) => require("path").resolve(__dirname, path);

let mbtiles = null;
new MBTiles(resolve("../../tiles/0-14.mbtiles"), (err, mb) => {
  if (err) throw err
  mbtiles = mb;
});

function getFromMbtiles(x,y,z) {
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

module.exports = {
  getFromMbtiles,
  mbtiles
}