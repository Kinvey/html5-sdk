import { Middleware } from 'kinvey-javascript-rack';
import { Promise } from 'es6-promise';
import parseHeaders from 'parse-headers';

export class XHRMiddleware extends Middleware {
  constructor(name = 'Http Middleware') {
    super(name);
  }

  handle(request) {
    const promise = new Promise(resolve => {
      const { url, method, headers, body } = request;

      // Create request
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);

      // Append request headers
      const names = Object.keys(headers);
      for (const name of names) {
        xhr.setRequestHeader(name, headers[name]);
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
