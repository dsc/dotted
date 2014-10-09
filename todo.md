# todo!


## UNIMPLEMENTED Features From the README

### Options

| name          | type      | default     | description                                                                                                                                                                                                                                                                                    |
| ------------- | --------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **arrayLike** | `Boolean` |             | If supplied, this value will override any normal tests for whether the object is `Array`-like (has a numeric length property).                                                                                                                                                                 |
| **useNested** | `Boolean` | `false`     | If true, use the nested accessors to get/set properties; otherwise the normal (delegating) accessor is used. Only applies to collection functions which involve looking up a property -- such as `pluck`, `invoke`, or things like `map` invoked with a string instead of a callback function. |
| **tombstone** | `Object`  | `TOMBSTONE` | Sentinel value to be interpreted as no-passthrough, forcing the lookup to fail and return `undefined`.                                                                                                                                                                                         |



#### dotted.isMember(object, ...values) -> Boolean

Tests whether all values are contained in the given collection (accepting Object or Array).


#### dotted.keys(object, options) -> Array<String>

Returns a list of the object's keys, delegating to `object.keys()` if available.


#### dotted.size(collection, options) -> Number | undefined

Attempts to determine the size of the collection, first by checking for a `size()` method,
then for a `length` property, and otherwise returning `undefined`.



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



## Kill `_` Dependency

Should switch to lodash micro-dependencies and/or stub out simple functions to cut the lodash dependency.

Methods used:
 - isArray
 - isObject
 - isPlainObject
 - contains
 - forEach
 - reduce


