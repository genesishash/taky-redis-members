// Generated by IcedCoffeeScript 108.0.9
(function() {
  var Members, cache, crypto, etime, iced, log, m, _, __iced_k, __iced_k_noop,
    __slice = [].slice;

  iced = {
    Deferrals: (function() {
      function _Class(_arg) {
        this.continuation = _arg;
        this.count = 1;
        this.ret = null;
      }

      _Class.prototype._fulfill = function() {
        if (!--this.count) {
          return this.continuation(this.ret);
        }
      };

      _Class.prototype.defer = function(defer_params) {
        ++this.count;
        return (function(_this) {
          return function() {
            var inner_params, _ref;
            inner_params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            if (defer_params != null) {
              if ((_ref = defer_params.assign_fn) != null) {
                _ref.apply(null, inner_params);
              }
            }
            return _this._fulfill();
          };
        })(this);
      };

      return _Class;

    })(),
    findDeferral: function() {
      return null;
    },
    trampoline: function(_fn) {
      return _fn();
    }
  };
  __iced_k = __iced_k_noop = function() {};

  _ = require('lodash');

  etime = require('english-time');

  cache = require('memory-cache');

  crypto = require('crypto');

  module.exports = Members = (function() {
    function Members(opts) {
      if (opts == null) {
        opts = {};
      }
      if (opts.redis == null) {
        opts.redis = new (require('ioredis'))(6379, 'localhost');
      }
      if (opts.prefix == null) {
        opts.prefix = 'members';
      }
      if (opts.trim_values == null) {
        opts.trim_values = true;
      }
      if (opts.hash_group_names == null) {
        opts.hash_group_names = false;
      }
      if (opts.cache_time == null) {
        opts.cache_time = '10 minutes';
      }
      opts.cache_time = (this._secs(opts.cache_time)) * 1000;
      this.opts = opts;
      this.redis = this.opts.redis;
      this.prefix = this.opts.prefix;
    }

    Members.prototype.add = function(group_name, member, cb) {
      var cache_key, e, key, m, r, x, ___iced_passed_deferral, __iced_deferrals, __iced_k, _ref;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      key = [this.prefix];
      if (this.opts.hash_group_names) {
        key.push(this._md5(group_name));
      } else {
        key.push(group_name);
      }
      if ((_ref = this._type(member)) !== 'string' && _ref !== 'array') {
        try {
          member = member.toString();
        } catch (_error) {}
      }
      if (this._type(member) === 'string') {
        if (this.opts.trim_values) {
          member = member.trim();
        }
        cache_key = key.join(':') + member;
        (function(_this) {
          return (function(__iced_k) {
            if (!cache.get(cache_key)) {
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "/Users/douglaslauer/www/taky-redis-members/module.iced",
                  funcname: "Members.add"
                });
                _this.redis.sadd(key.join(':'), member, __iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      e = arguments[0];
                      return r = arguments[1];
                    };
                  })(),
                  lineno: 40
                }));
                __iced_deferrals._fulfill();
              })(function() {
                return __iced_k(cache.put(cache_key, true, _this.opts.cache_time));
              });
            } else {
              return __iced_k();
            }
          });
        })(this)((function(_this) {
          return function() {
            if (cb) {
              return cb(e, r);
            }
            return __iced_k();
          };
        })(this));
      } else {
        (function(_this) {
          return (function(__iced_k) {
            var _i, _len;
            if (_this._type(member) === 'array') {
              m = _this.redis.multi();
              for (_i = 0, _len = member.length; _i < _len; _i++) {
                x = member[_i];
                try {
                  x = x.toString();
                } catch (_error) {}
                if (_this.opts.trim_values) {
                  x = x.trim();
                }
                cache_key = key.join(':') + x;
                if (!cache.get(cache_key)) {
                  m.sadd(key.join(':'), x);
                  cache.put(cache_key, true, _this.opts.cache_time);
                }
              }
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "/Users/douglaslauer/www/taky-redis-members/module.iced",
                  funcname: "Members.add"
                });
                m.exec(__iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      e = arguments[0];
                      return r = arguments[1];
                    };
                  })(),
                  lineno: 59
                }));
                __iced_deferrals._fulfill();
              })(function() {
                if (cb) {
                  return cb(e, r);
                }
                return __iced_k();
              });
            } else {
              return __iced_k();
            }
          });
        })(this)(__iced_k);
      }
    };

    Members.prototype.remove = function(group_name, member, cb) {
      var cache_key, e, key, members, r, x, ___iced_passed_deferral, __iced_deferrals, __iced_k, _ref;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      key = [this.prefix];
      if (this.opts.hash_group_names) {
        key.push(this._md5(group_name));
      } else {
        key.push(group_name);
      }
      if ((_ref = this._type(member)) !== 'string' && _ref !== 'array') {
        try {
          member = member.toString();
        } catch (_error) {}
      }
      if (this._type(member) === 'string') {
        members = [member];
      } else {
        members = member;
      }
      (function(_this) {
        return (function(__iced_k) {
          var _i, _len, _ref1, _results, _while;
          _ref1 = members;
          _len = _ref1.length;
          _i = 0;
          _while = function(__iced_k) {
            var _break, _continue, _next;
            _break = __iced_k;
            _continue = function() {
              return iced.trampoline(function() {
                ++_i;
                return _while(__iced_k);
              });
            };
            _next = _continue;
            if (!(_i < _len)) {
              return _break();
            } else {
              x = _ref1[_i];
              if (_this.opts.trim_values) {
                x = x.trim();
              }
              cache_key = key.join(':') + x;
              cache.del(cache_key);
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "/Users/douglaslauer/www/taky-redis-members/module.iced",
                  funcname: "Members.remove"
                });
                _this.redis.srem(key.join(':'), member, __iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      e = arguments[0];
                      return r = arguments[1];
                    };
                  })(),
                  lineno: 85
                }));
                __iced_deferrals._fulfill();
              })(function() {
                if (e) {
                  return cb(e);
                }
                return _next();
              });
            }
          };
          _while(__iced_k);
        });
      })(this)((function(_this) {
        return function() {
          return cb(null, members.length);
        };
      })(this));
    };

    Members.prototype.list = function(group_name, cb) {
      var key;
      key = [this.prefix];
      if (this.opts.hash_group_names) {
        key.push(this._md5(group_name));
      } else {
        key.push(group_name);
      }
      return this.redis.smembers(key.join(':'), cb);
    };

    Members.prototype._secs = function(str) {
      return Math.round(etime(str) / 1000);
    };

    Members.prototype._md5 = function(str) {
      var c;
      c = crypto.createHash('md5');
      c.update(x);
      return c.digest('hex');
    };

    Members.prototype._type = function(obj) {
      if (obj === (void 0) || obj === 'undefined' || obj === null) {
        return false;
      }
      return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    };

    return Members;

  })();

  if (process.env.TAKY_DEV && !module.parent) {
    log = function(x) {
      try {
        return console.log(x);
      } catch (_error) {}
    };
    m = new Members;
    m.add('friends', ['Doug', 'Chris', 'Cody'], function() {
      return m.add('friends', 'John', function() {
        return m.list('friends', function(e, friends) {
          log(/friends before removal/);
          log(friends);
          return m.remove('friends', ['Cody', 'John', 'noexists'], function() {
            return m.list('friends', function(e, friends) {
              log(/friends after removal/);
              log(friends);
              return process.exit(1);
            });
          });
        });
      });
    });
  }

}).call(this);
