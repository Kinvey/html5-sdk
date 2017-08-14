const http = require('http');

const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

function serveTests() {

  new Promise(function (resolve) {

    const serve = serveStatic(global.appRoot);

    const server = http.createServer(function (req, res) {
      const done = finalhandler(req, res);
      serve(req, res, done);
    });

    server.listen(0, () => {
      global.staticPort = server.address().port;
      console.log(`Serving static files on port: ${global.staticPort}`);
      resolve();
    });
  });
};

module.exports = () => ['serveTests', serveTests];
