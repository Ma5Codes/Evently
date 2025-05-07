var Url = require('url');
var Q = require('kew');
var Request = require('request');


function checkError(err, req, res, body) {
  if (err) {
    return err;
  }
  if (res.statusCode < 400) {
    return null;
  }
  var payload = typeof body === 'string' ? JSON.parse(body) : body;
  var cErr = new Error(payload.reason || 'couch returned ' + res.statusCode);
  cErr.statusCode = res.statusCode,
  cErr.request = req;
  cErr.response = res;
  return cErr;
}


function stringifySearchParams(qs) {
  var s = {};
  Object.keys(qs).forEach(function(key) {
    if (typeof qs[key] !== 'string') {
      try {
        s[key] = JSON.stringify(qs[key]);
      }
      catch(e) {
      }
    }
    else {
      s[key] = qs[key];
    }
  });
  return s;
}


module.exports = function(dbUrl) {

  return {

    load: function load(id, qs) {
      var defer = Q.defer();
      var req = Request.get(dbUrl + '/' + id, { qs: qs }, function(resErr, res, body) {
        var err = checkError(resErr, req, res, body);
        if (err) {
          return defer.reject(err);
        }
        defer.resolve(JSON.parse(body));
      });
      return defer.promise;
    },


    //
    // id is optional
    //
    save: function save(doc, qs) {
      var defer = Q.defer();
      var method = 'post';
      var url = dbUrl;
      qs = qs || {};

      function replacer(key, value) {
        if (typeof value === 'function') {
          return value.toString();
        }
        return value;
      }

      if (doc._id) {
        // create or update with id
        method = 'put';
        url += '/' + doc._id;
        if (doc._rev) {
          // update with rev
          qs.rev = doc._rev;
        }
      }

      var req = Request({
        url: url,
        method: method,
        qs: qs,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: typeof doc === 'string' ? doc : JSON.stringify(doc, replacer)

      }, function(resErr, res, body) {
        var err = checkError(resErr, req, res, body);
        if (err) {
          return defer.reject(err);
        }
        defer.resolve(JSON.parse(body));
      });
      return defer.promise;
    },


    bulkSave: function bulkSave(docs, qs) {
      var defer = Q.defer();
      var req = Request({
        url: dbUrl + '/_bulk_docs',
        method: 'post',
        qs: qs,
        json: docs

      }, function(resErr, res, body) {
        var err = checkError(resErr, req, res, body);
        if (err) {
          return defer.reject(err);
        }
        defer.resolve(body);
      });
      return defer.promise;
    },


    bulkLoad: function bulkLoad(keys, qs) {
      var defer = Q.defer();
      var req = Request({
        url: dbUrl + '/_all_docs',
        method: 'post',
        qs: qs,
        json: { keys: keys || [] }

      }, function(resErr, res, body) {
        var err = checkError(resErr, req, res, body);
        if (err) {
          return defer.reject(err);
        }
        defer.resolve(body);
      });
      return defer.promise;
    },


    destroy: function destroy(id, rev) {
      var defer = Q.defer();
      var qs = { rev: rev };

      var req = Request({
        method: 'delete',
        url: dbUrl + '/' + id,
        qs: qs

      }, function(resErr, res, body) {
        var err = checkError(resErr, req, res, body);
        if (err) {
          return defer.reject(err);
        }
        defer.resolve(JSON.parse(body));
      }
                       );
      return defer.promise;
    },


    view: function view(designName, viewName, qs) {
      var defer = Q.defer();

      var req = Request.get(
        dbUrl + '/_design/' + designName + '/_view/' + viewName,
        { qs: stringifySearchParams(qs) },

        function(resErr, res, body) {
          var err = checkError(resErr, req, res, body);
          if (err) {
            return defer.reject(err);
          }
          defer.resolve(JSON.parse(body));
        }
      );
      return defer.promise;
    },


    uuids: function uuids(count) {
      count = count || 1;
      var defer = Q.defer();
      var parts = Url.parse(dbUrl);

      var req = Request.get(
        parts.protocol + '//' + parts.host + '/_uuids',
        { qs: { count: count }},

        function(resErr, res, body) {
          var err = checkError(resErr, req, res, body);
          if (err) {
            return defer.reject(err);
          }
          defer.resolve(JSON.parse(body));
        }
      );
      return defer.promise;
    },


    info: function info() {
      var defer = Q.defer();
      var req = Request.get(
        dbUrl,
        {},
        function(resErr, res, body) {
          var err = checkError(resErr, req, res, body);
          if (err) {
            return defer.reject(err);
          }
          defer.resolve(JSON.parse(body));
        }
      );
      return defer.promise;
    },


    createDB: function createDB(name) {
      var defer = Q.defer();
      var req = Request({
        url: dbUrl,
        method: 'put'

      }, function(resErr, res, body) {
          var err = checkError(resErr, req, res, body);
          if (err) {
            return defer.reject(err);
          }
          defer.resolve(JSON.parse(body));
      });
      return defer.promise;
    },


    destroyDB: function destroyDB(name) {
      var defer = Q.defer();
      var req = Request({
        url: dbUrl,
        method: 'delete'

      }, function(resErr, res, body) {
          var err = checkError(resErr, req, res, body);
          if (err) {
            return defer.reject(err);
          }
          defer.resolve(JSON.parse(body));
      });
      return defer.promise;
    }
  };
};