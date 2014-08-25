# dotted.js

Nested and delegating object-graph utilities.


## Usage

For usage in [node.js][node], install it via [npm][npm]: `npm install dotted`.

You can optionally mix it into [underscore][underscore] or [lodash][lodash].

```js
var dotted = require('dotted');

// Optional!
var _ = require('lodash');
_.mixin(dotted);
```

Note that if you want to use [lodash][lodash], that's also fine. Because the
package requires a few `_` utilities, it will look in several places for an
Underscore subsitute: first `window._`/`global._`, then it will try `require`.
If all of this fails, it will throw an error.


## API

### Options

Many accessor functions take an options object with common fields. The sub-object
delegation options (`getter`, `setter`, and `deleter`) are used to specify where
to look for the specific accessor method on a custom sub-object when performing
that operation. (Functions that do not use that operation will ignore these
options, so you're welcome to specify them everywhere just to be safe.)


| name          | type      | default     | description                                                                                                                                                                                                                                                                                    |
| ------------- | --------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **getter**    | `String`  | `"get"`     | Name of the sub-object getter method to delegate to (if it exists).                                                                                                                                                                                                                            |
| **setter**    | `String`  | `"set"`     | Name of the sub-object setter method to delegate to (if it exists).                                                                                                                                                                                                                            |
| **deleter**   | `String`  | `"delete"`  | Name of the sub-object deleter method to delegate to (if it exists).                                                                                                                                                                                                                           |
| **arrayLike** | `Boolean` |             | If supplied, this value will override any normal tests for whether the object is `Array`-like (has a numeric length property).                                                                                                                                                                 |
| **useNested** | `Boolean` | `false`     | If true, use the nested accessors to get/set properties; otherwise the normal (delegating) accessor is used. Only applies to collection functions which involve looking up a property -- such as `pluck`, `invoke`, or things like `map` invoked with a string instead of a callback function. |
| **ensure**    | `Boolean` | `false`     | If true, intermediate keys that are `null` or `undefined` will be filled in with a new empty object `{}`, ensuring the get will return valid metadata.                                                                                                                                         |
| **tombstone** | `Object`  | `TOMBSTONE` | Sentinel value to be interpreted as no-passthrough, forcing the lookup to fail and return `undefined`.                                                                                                                                                                                         |



### Delegating Accessors

#### dotted.get(target, key, def, options) -> value

Gets the value at `key` from the object if present, returning `def` otherwise.


#### dotted.set(target, key, value, options) -> target

Puts a given value to `key` on the given target object. If an object is supplied as `key` instead of a String, 
each key-value pair on that object will be put to the target object. In this case, omit `value`. Returns the 
target object.


#### dotted.delete(target, key, options) -> oldValue

Deletes `key` from the target object, returning whatever value was present prior to being removed.


#### dotted.isMember(object, ...values) -> Boolean

Tests whether all values are contained in the given collection (accepting Object or Array).


#### dotted.keys(object, options) -> Array<String>

Returns a list of the object's keys, delegating to `object.keys()` if available.


#### dotted.size(collection, options) -> Number | undefined

Attempts to determine the size of the collection, first by checking for a `size()` method,
then for a `length` property, and otherwise returning `undefined`.



### Nested Delegating Accessors

These methods perform **nested** accessor operations, delegating like their non-nested counterparts to
the target object when an instance method is found matching the operation.


#### dotted.getNested(target, chain, def, options) -> value

Searches a hierarchical object for a given subkey specified in dotted-property syntax, returning the value
if found, and `def` otherwise.


#### dotted.setNested(target, chain, value, options) -> oldValue

Searches a hierarchical object for a given subkey specified in dotted-property syntax, setting it with the 
provided value if found.


#### dotted.deleteNested(target, chain, options) -> target

Searches a hierarchical object for a potentially-nested key and removes it, returning whatever value was present 
there prior to being removed.

**Aliases:** `unsetNested`.


#### dotted.getNestedMeta(object, chain, options) -> Object

*[Private]* Searches a hierarchical object for a given subkey (specified in dotted-property syntax),
respecting sub-object accessor-methods (e.g., 'get', 'set') if they exist. If found, returns an object 
of the form `{ key: Qualified key name, obj: Parent object of key, val: Value at obj[key], opts: Options }`,
and otherwise `undefined`.



### Delegating Collection Methods

Each of these methods performs the same operation its typical counterpart but
attempting to delegate to methods on the collection when possible.

1. First, it will attempt to delegate to an appropriately-named method on the
    collection -- so given an Array `a`, calling `dotted.forEach(a, fn)` will
    call `a.forEach(fn)`.
2. If no such method can be found, it will then use `dotted.size()` to check
    if the collection is Array-like (has a numeric length). If so, it will be
    iterated via index; otherwise, `dotted.keys()` will be used to to acquire
    the object's keys.
3. Finally, we iterate across the collection, using `dotted.get()` to retieve
    the value for each index or key, before calling the given callback function.


#### dotted.forEach(collection, callback, [thisArg], [options]) -> collection

#### dotted.map(collection, callback, [thisArg], [options])

#### dotted.filter(collection, callback, [thisArg], [options])

#### dotted.reduce(collection, callback, [acc], [thisArg], [options])

#### dotted.pluck(collection, property, [options])

#### dotted.invoke(collection, property | options, ...args)







## Feedback

Find a bug or want to contribute? Open a ticket (or fork the source!) on [github][project]. 
You're also welcome to send me email at [dsc@less.ly][dsc_email].

--

`dotted` was written by [David Schoonover][dsc]; it is open-source software and
freely available under the [MIT License][mit_license].



[project]: http://github.com/dsc/dotted "Underscore.nested on GitHub"
[dsc]: https://github.com/dsc/ "David Schoonover"
[dsc_email]: mailto:dsc+dotted@less.ly?subject=dotted.js "dsc@less.ly"
[mit_license]: http://dsc.mit-license.org/ "MIT License"

[node]: http://nodejs.org/ "node.js"
[npm]: http://npmjs.org/ "npm"
[underscore]: http://underscorejs.org "Underscore.js"
[lodash]: http://lodash.com "Lodash"







