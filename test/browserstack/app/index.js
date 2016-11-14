var express = require('express');
var path = require('path');

// Create an server
var server = express();

// Serve the public directory
server.use(express.static(path.resolve(__dirname, 'static')));
server.use('/kinvey', express.static(path.resolve(__dirname, '../../../dist/')));

// Send 404 for unknown routes
server.get('*', (request, response) => {
  response.sendFile(`${__dirname}/static/404.html`);
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server listening on port http://localhost:3000...');
});
