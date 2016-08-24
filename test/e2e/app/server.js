import express from 'express';
import path from 'path';

// Create an app
const app = express();

// Serve the public directory
app.use(express.static(`${__dirname}/public`));
app.use('/sdk', express.static(path.resolve(__dirname, '../../../dist/')));

// Support Backbone routes
app.get('*', (request, response) => {
  response.sendFile(`${__dirname}/public/index.html`);
});

// Start the app on port 3000
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
