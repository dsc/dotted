var root, _, i$, ref$, len$, mod, ex, ref1$, hasOwn, objToString, isPlainObject, ref2$, TOMBSTONE, DEFAULT_DELEGATE_OPTIONS, DEFAULT_NESTED_OPTIONS, dotted, slice$ = [].slice;
root = function(){
  return this;
}();
_ = root._;
if (typeof _ != 'function' && typeof require == 'function') {
  for (i$ = 0, len$ = (ref$ = ['lodash', 'underscore']).length; i$ < len$; ++i$) {
    mod = ref$[i$];
    try {
      _ = require(mod);
      if (typeof _ == 'function') {
        break;
      }
    } catch (e$) {
      ex = e$;
    }
  }
}
if (typeof _ != 'function') {
  throw new Error("Unable to find Underscore or Lodash!");
}
ref1$ = {}, hasOwn = ref1$.hasOwnProperty, objToString = ref1$.toString;
isPlainObject = (ref2$ = _.isPlainObject) != null
  ? ref2$
  : function(obj){
    var key;
    if (!obj || objToString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval) {
      return false;
    }
    if (obj.constructor && !hasOwn.call(obj, 'constructor') && !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
      return false;
    }
    for (key in obj) {}
    return key === undefined || hasOwn.call(obj, key);
  };
/**
 * @private
 * Tombstone object, used internally to mark deleted, non-passthrough keys.
 */
TOMBSTONE = {};
/**
 * Default options for delegate-accessor functions.
 */
DEFAULT_DELEGATE_OPTIONS = {
  getter: 'get',
  setter: 'set',
  deleter: 'delete'
};
/**
 * Default options for nested-accessor functions.
 */
DEFAULT_NESTED_OPTIONS = (import$({
  ensure: false,
  tombstone: TOMBSTONE
}, DEFAULT_DELEGATE_OPTIONS));
/**
 * Tests whether all values are contained in the given collection.
 * 
 * @param {Array|Object|String} collection Collection to be tested.
 * @param {Array} ...values Values for which to look.
 * @returns {Boolean}
 */
function isMember(obj, v){
  var i$, ref$, len$;
  for (i$ = 0, len$ = (ref$ = values).length; i$ < len$; ++i$) {
    v = ref$[i$];
    if (!_.contains(obj, v)) {
      return false;
    }
  }
  return true;
}
/**
 * Gets the value at `key` from the object if present, returning `def` otherwise.
 * 
 * @param {Object} object Object on which to perform lookup.
 * @param {String|Array} key Key to get.
 * @param {*} [def=undefined] Default value.
 * @param {Object} [opts] Options.
 * @returns {*} Value or default.
 */
function get(obj, key, def, opts){
  var getter;
  if (obj == null) {
    return;
  }
  getter = (opts != null ? opts.getter : void 8) || 'get';
  if (typeof obj[getter] === 'function') {
    return obj[getter](key, def, opts);
  } else {
    if (obj[key] !== undefined) {
      return obj[key];
    } else {
      return def;
    }
  }
}
/**
 * Puts the given value to `key` on the given target object.
 * 
 * @param {Object} target Target object for the set.
 * @param {String|Array|Object} key The key to set. If an object is supplied here, each key will be set with its value on the target object.
 * @param {*} [value] Value to set at `key`. Omit this if an object of KV-pairs was passed as `key`.
 * @param {Object} [opts] Options.
 * @returns {Object} The target object.
 */
function set(obj, key, value, opts){
  var ref$, values, ref1$, setter;
  if (obj == null) {
    return;
  }
  if (key != null && _.isObject(key)) {
    ref$ = [key, value], values = ref$[0], opts = ref$[1];
  } else {
    values = (ref1$ = {}, ref1$[key + ""] = value, ref1$);
  }
  setter = (opts != null ? opts.setter : void 8) || 'set';
  if (typeof obj[setter] === 'function') {
    for (key in values) {
      value = values[key];
      obj[setter](key, value, opts);
    }
  } else {
    for (key in values) {
      value = values[key];
      obj[key] = value;
    }
  }
  return obj;
}
/**
 * Deletes `key` from the target object.
 * 
 * @param {Object} target Target object.
 * @param {String} key Key to be deleted.
 * @param {Object} [opts] Options.
 * @returns {*} Value at `key` prior to being removed from the target.
 */
function del(obj, key, opts){
  var deleter, ref$;
  if (obj == null) {
    return;
  }
  deleter = (opts != null ? opts.deleter : void 8) || 'delete';
  if (typeof obj[deleter] === 'function') {
    return obj[deleter](key, opts);
  } else {
    return ref$ = obj[key], delete obj[key], ref$;
  }
}
/**
 * Searches a hierarchical object for a given subkey specified in dotted-property syntax,
 * respecting sub-object accessor-methods (e.g., 'get', 'set') if they exist.
 * 
 * @param {Object} base The object to serve as the root of the property-chain.
 * @param {Array|String} chain The property-chain to lookup.
 * @param {Object} [opts] Options:
 * @param {Boolean} [opts.ensure=false] If true, intermediate keys that are `null` or
 *  `undefined` will be filled in with a new empty object `{}`, ensuring the get will
 *   return valid metadata.
 * @param {String} [opts.getter="get"] Name of the sub-object getter method use if it exists.
 * @param {String} [opts.setter="set"] Name of the sub-object setter method use if it exists.
 * @param {String} [opts.deleter="delete"] Name of the sub-object deleter method use if it exists.
 * @param {Object} [opts.tombstone=TOMBSTONE] Sentinel value to be interpreted as no-passthrough,
 *  forcing the lookup to fail and return `undefined`. TODO: opts.returnTombstone
 * @returns {undefined|Object} If found, the object is of the form 
 *  `{ key: Qualified key name, obj: Parent object of key, val: Value at obj[key], opts: Options }`. 
 *  Otherwise `undefined`.
 */
function getNestedMeta(obj, chain, opts){
  var len, ref$;
  opts == null && (opts = {});
  if (typeof chain === 'string') {
    chain = chain.split('.');
  }
  len = chain.length - 1;
  opts = (ref$ = {}, import$(ref$, DEFAULT_NESTED_OPTIONS), import$(ref$, opts));
  return _.reduce(chain, function(obj, key, idx){
    var val;
    if (obj == null) {
      return;
    }
    val = get(obj, key, undefined, opts);
    if (val === opts.tombstone) {
      if (!ops.ensure) {
        return;
      }
      val = undefined;
    }
    if (idx === len) {
      return {
        key: key,
        val: val,
        obj: obj,
        opts: opts
      };
    }
    if (val == null && opts.ensure) {
      val = {};
      set(obj, key, val, opts);
    }
    return val;
  }, obj);
}
/**
 * Searches a hierarchical object for a given subkey specified in dotted-property syntax.
 * 
 * @param {Object} rootObj The object to serve as the root of the property-chain.
 * @param {Array|String} chain The property-chain to lookup.
 * @param {Any} [def=undefined] Value to return if lookup fails.
 * @param {Object} [opts] Options to pass to `{@link #getNestedMeta}`.
 * @returns {null|Object} If found, returns the value, and otherwise `default`.
 */
function getNested(rootObj, chain, def, opts){
  var meta;
  meta = getNestedMeta(rootObj, chain, opts);
  if ((meta != null ? meta.val : void 8) === undefined) {
    return def;
  }
  return meta.val;
}
/**
 * Searches a hierarchical object for a given subkey specified in
 * dotted-property syntax, setting it with the provided value if found.
 * 
 * @param {Object} rootObj The object to serve as the root of the property-chain.
 * @param {Array|String} chain The property-chain to lookup.
 * @param {Any} value The value to set.
 * @param {Object} [opts] Options to pass to `{@link #getNestedMeta}`.
 * @returns {undefined|Any} If found, returns the old value, and otherwise `undefined`.
 */
function setNested(rootObj, chain, value, opts){
  var meta, obj, key, val;
  if (!(meta = getNestedMeta(rootObj, chain, opts))) {
    return;
  }
  obj = meta.obj, key = meta.key, val = meta.val, opts = meta.opts;
  set(obj, key, value, opts);
  return val;
}
/**
 * Searches a hierarchical object for a potentially-nested key and removes it.
 * 
 * @param {Object} rootObj The root of the lookup chain.
 * @param {String|Array<String>} chain The chain of property-keys to navigate.
 *  Nested keys can be supplied as a dot-delimited string (e.g., `deleteNested(obj, 'user.name')`),
 *  or an array of strings, allowing for keys with dots (eg.,
 *  `deleteNested(obj, ['products', 'by_price', '0.99'])`).
 * @param {Object} [opts] Options to pass to `{@link #getNestedMeta}`.
 * @returns {undefined|Any} The old value if found; otherwise `undefined`.
 */
function deleteNested(rootObj, chain, opts){
  var meta, obj, key, val;
  if (!(meta = getNestedMeta(rootObj, chain, opts))) {
    return;
  }
  obj = meta.obj, key = meta.key, val = meta.val, opts = meta.opts;
  del(obj, key, opts);
  return val;
}
/**
 * Recursively merges together any number of donor objects into the target object.
 * Modified from `jQuery.extend()`.
 * 
 * @param {Object} target Target object of the merge.
 * @param {Object} ...donors Donor objects.
 * @returns {Object} 
 */
function mergeNested(target){
  var donors, ref$, i$, len$, donor;
  target == null && (target = {});
  donors = slice$.call(arguments, 1);
  if ((ref$ = typeof target) !== 'object' && ref$ !== 'function') {
    target = _.isArray(donors[0])
      ? []
      : {};
  }
  for (i$ = 0, len$ = donors.length; i$ < len$; ++i$) {
    donor = donors[i$];
    if (donor == null) {
      continue;
    }
    _.forEach(donor, fn$);
  }
  return target;
  function fn$(value, key){
    var current, valueIsArray;
    current = target[key];
    if (target === value) {
      return;
    }
    if (value && (isPlainObject(value) || (valueIsArray = _.isArray(value)))) {
      if (valueIsArray) {
        if (!_.isArray(current)) {
          current = [];
        }
      } else {
        if (!(current && typeof current === 'object')) {
          current = {};
        }
      }
      return set(target, key, mergeNested(current, value));
    } else if (value !== undefined) {
      return set(target, key, value);
    }
  }
}
if (!(dotted = (typeof module != 'undefined' && module !== null ? module.exports : void 8) || (typeof exports != 'undefined' && exports !== null))) {
  dotted = root.dotted = {};
}
dotted.isMember = isMember;
dotted.isPlainObject = isPlainObject;
dotted.get = get;
dotted.set = set;
dotted['delete'] = del;
dotted.getNested = getNested;
dotted.setNested = setNested;
dotted.deleteNested = deleteNested;
dotted.getNestedMeta = getNestedMeta;
dotted.mergeNested = mergeNested;
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}