'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _db = require('./src/db');

Object.keys(_db).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _db[key];
    }
  });
});

var _indexeddb = require('./src/indexeddb');

Object.keys(_indexeddb).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _indexeddb[key];
    }
  });
});

var _memory = require('./src/memory');

Object.keys(_memory).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _memory[key];
    }
  });
});

var _websql = require('./src/websql');

Object.keys(_websql).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _websql[key];
    }
  });
});

var _webstorage = require('./src/webstorage');

Object.keys(_webstorage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _webstorage[key];
    }
  });
});