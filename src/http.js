import { KinveyMiddleware } from 'kinvey-javascript-sdk-core/es5/rack/middleware';
import parseHeaders from 'parse-headers';

export class HttpMiddleware extends KinveyMiddleware {
  constructor(name = 'Kinvey HTML5 Http Middleware') {
    super(name);
  }

  handle(request) {
    return super.handle(request).then(() => {
      const promise = new Promise((resolve, reject) => {
        const { url, method, headers, body } = request;

        // Create request
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        // xhr.responseType = request.responseType;

        // Append request headers
        const names = Object.keys(headers.toJSON());
        for (const name of names) {
          xhr.setRequestHeader(name, headers.get(name));
        }

        xhr.onload = xhr.ontimeout = xhr.onabort = xhr.onerror = () => {
          // Extract status code
          const statusCode = xhr.status;

          // Extract the response
          let responseData = xhr.response || null;
          if (xhr.response) {
            responseData = xhr.responseText || null;
          }

          // Set the response for the request
          request.response = {
            statusCode: statusCode,
            headers: parseHeaders(xhr.getAllResponseHeaders()),
            data: responseData
          };

          // Success
          if ((statusCode >= 200 && statusCode < 300) || statusCode === 304) {
            return resolve(request);
          }

          // Error
          return reject(request);
        };

        // Send xhr
        xhr.send(body);
      });
      return promise;
    });
  }
}
