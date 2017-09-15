import expect from 'expect';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { NotFoundError } from 'kinvey-js-sdk/dist/export';
import { CookieStorageAdapter } from '../../../src/middleware/src/storage/webstorage';
import { randomString } from '../utils';

chai.use(chaiAsPromised);
chai.should();

function storageMock() {
  return {
    value_: {},
    get cookie() {
      const output = Object.keys(this.value_).reduce((output, key) => {
        output.push(`${key}=${this.value_[key]}`);
        return output;
      }, []);
      return output.join(';');
    },

    set cookie(string) {
      if (string) {
        const indexOfSeparator = string.indexOf('=');
        const key = string.substr(0, indexOfSeparator);
        const value = string.substring(indexOfSeparator + 1);
        this.value_[key] = value;
        return `${key}=${value}`;
      }

      return null;
    }
  };
}

describe('CookieStorageAdapter', () => {
  const document = global.document;

  beforeEach(() => {
    global.document = storageMock();
  });

  afterEach(() => {
    global.document = document;
  });

  describe('load()', () => {
    it('should return an instance of the SessionStorageAdapter', () => {
      const promise = CookieStorageAdapter.load(randomString())
        .then((adapter) => {
          expect(adapter).toBeA(CookieStorageAdapter);
        });
      return promise.should.be.fulfilled;
    });
  });

  describe('find()', () => {
    let adapter;
    const collection = 'books';
    const entities = [{
      title: randomString()
    }];

    beforeEach(() => {
      adapter = new CookieStorageAdapter(randomString());
      return adapter.save(collection, entities);
    });

    afterEach(() => {
      return adapter.clear();
    });

    it('should return all entities', () => {
      return adapter.find(collection)
        .then((savedEntities) => {
          expect(savedEntities).toEqual(entities);
        });
    });
  });

  describe('findById()', () => {
    let adapter;
    const collection = 'books';
    const entity = {
      _id: randomString(),
      title: randomString()
    };

    beforeEach(() => {
      adapter = new CookieStorageAdapter(randomString());
      return adapter.save(collection, [entity]);
    });

    afterEach(() => {
      return adapter.clear();
    });

    it('should return an entity', () => {
      return adapter.findById(collection, entity._id)
        .then((savedEntity) => {
          expect(savedEntity).toEqual(entity);
        });
    });
  });

  describe('save()', () => {
    let adapter;
    const collection = 'books';
    const entities = [{
      title: randomString()
    }];

    beforeEach(() => {
      adapter = new CookieStorageAdapter(randomString());
    });

    afterEach(() => {
      return adapter.clear();
    });

    it('should save the entities', () => {
      return adapter.save(collection, entities)
        .then(() => {
          return adapter.find(collection);
        })
        .then((savedEntities) => {
          expect(savedEntities).toEqual(entities);
        });
    });
  });

  describe('removeById()', () => {
    let adapter;
    const collection = 'books';
    const entity = {
      _id: randomString(),
      title: randomString()
    };

    beforeEach(() => {
      adapter = new CookieStorageAdapter(randomString());
      return adapter.save(collection, [entity]);
    });

    afterEach(() => {
      return adapter.clear();
    });

    it('should remove an entity', () => {
      return adapter.removeById(collection, entity._id)
        .then((result) => {
          expect(result).toEqual({ count: 1 });
          return adapter.findById(collection, entity._id);
        })
        .catch((error) => {
          expect(error).toBeA(NotFoundError);
        });
    });
  });

  describe('clear()', () => {
    let adapter;
    const collection = 'books';
    const entities = [{
      title: randomString()
    }];

    beforeEach(() => {
      adapter = new CookieStorageAdapter(randomString());
      return adapter.save(collection, entities);
    });

    afterEach(() => adapter.clear());

    it('should remove all entities', () => {
      return adapter.clear()
        .then(() => adapter.find(collection))
        .then((savedEntities) => {
          expect(savedEntities).toEqual([]);
        });
    });
  });
});
