import expect from 'expect';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { NotFoundError } from 'kinvey-js-sdk/dist/export';
import { CookieStorageAdapter } from '../../../src/middleware/src/storage/webstorage';

chai.use(chaiAsPromised);
chai.should();

function randomString() {
  let string = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 5; i += 1) {
    string += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return string;
}

function storageMock() {
  return {
    value_: '',
    get cookie() {
      return this.value_;
    },

    set cookie(value) {
      this.value_ += `${value};`;
    }
  };
}

describe('CookieStorageAdapter', () => {
  beforeEach(() => {
    global.document = storageMock();
  });

  afterEach(() => {
    delete global.document;
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

  // describe('clear()', () => {
  //   let adapter;
  //   const collection = 'books';
  //   const entities = [{
  //     title: randomString()
  //   }];

  //   beforeEach(() => {
  //     adapter = new CookieStorageAdapter(randomString());
  //     return adapter.save(collection, entities);
  //   });

  //   afterEach(() => {
  //     return adapter.clear();
  //   });

  //   it('should remove all entities', () => {
  //     return adapter.clear()
  //       .then(() => {
  //         return adapter.find(collection);
  //       })
  //       .then((savedEntities) => {
  //         expect(savedEntities).toEqual([]);
  //       });
  //   });
  // });
});