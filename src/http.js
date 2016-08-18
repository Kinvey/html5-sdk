import { KinveyMiddleware } from 'kinvey-javascript-sdk-core/dist/rack';
import { Promise } from 'es6-promise';
import parseHeaders from 'parse-headers';

export class HttpMiddleware extends KinveyMiddleware {
  constructor(name = 'Kinvey HTML5 Http Middleware') {
    super(name);
  }

  handle(request) {
    const promise = new Promise(resolve => {
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
        let data = xhr.response || null;
        if (xhr.response) {
          data = xhr.responseText || null;
        }

        // Resolve
        return resolve({
          response: {
            statusCode: statusCode,
            headers: parseHeaders(xhr.getAllResponseHeaders()),
            data: data
          }
        });
      };

      // Send xhr
      xhr.send(body);
    });
    return promise;
  }
}
