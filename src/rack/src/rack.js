import { Rack as CoreRack } from 'kinvey-javascript-rack/dist/rack';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars
import result from 'lodash/result';

export class Rack extends CoreRack {
  async execute(request) {
    const { response } = await super.execute(result(request, 'toPlainObject', request));
    return response;
  }
}
