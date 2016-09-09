import { Middleware } from 'kinvey-javascript-rack';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars

export class SerializeMiddleware extends Middleware {
  constructor(name = 'Serialize Middleware') {
    super(name);
  }

  async handle(request) {
    if (request && request.body) {
      const contentType = request.headers['content-type'] || request.headers['Content-Type'];

      if (contentType) {
        if (contentType.indexOf('application/json') === 0) {
          request.body = JSON.stringify(request.body);
        } else if (contentType.indexOf('application/x-www-form-urlencoded') === 0) {
          const body = request.body;
          const keys = Object.keys(body);
          const str = [];

          for (const key of keys) {
            str.push(`${global.encodeURIComponent(key)}=${global.encodeURIComponent(body[key])}`);
          }

          request.body = str.join('&');
        }
      }
    }

    return { request: request };
  }
}
