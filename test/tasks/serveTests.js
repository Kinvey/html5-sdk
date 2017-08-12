const http = require('http');

const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

function serveTests() {

  new Promise(function (resolve) {

    //TODO: fix dirname to be from/in config
    const serve = serveStatic(__dirname);

    const server = http.createServer(function (req, res) {
      const done = finalhandler(req, res);
      serve(req, res, done);
    });

    server.listen(0, () => {
      //TODO: set config port
      //config.staticPort = server.address().port;
      console.log(`Serving static files on port: ${server.address().port}`);
      return resolve();
    });
  });
};

module.exports = () => ['serveTests', serveTests];
