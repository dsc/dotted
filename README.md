# dotted.js

Nested and delegating object-graph utilities.

```js
var dotted = require('dotted');

// ohai, some tweets
var tweets = {
    "requested_at": "Thu Oct 09 09:50:20 +0000 2014",
    "items": [
        {
            "id": 516626496845131800,
            "created_at": "Mon Sep 29 16:32:09 +0000 2014",
            "text": "the other thing that happens when you do something for 10,000 hours is you develop a really refined hatred for it",
            "user": {
                "id": 16142493,
                "screen_name": "me_irl",
                "name": "the government man"
            },
            "retweet_count": 55,
            "favorite_count": 79
        }, {
            "id": 516596160208076800,
            "created_at": "Mon Sep 29 14:31:37 +0000 2014",
            "text": "It's Piketty week, and someone in my Economic Justice class is wearing a 'r&gt;g' shirt. &lt;3",
            "user": {
                "id": 19530289,
                "screen_name": "PennyRed",
                "name": "Laurie Penny"
            },
            "retweet_count": 6,
            "favorite_count": 18
        }, {
            "id": 516438947367358460,
            "created_at": "Mon Sep 29 04:06:54 +0000 2014",
            "text": "finding out an “indie” site has VC funding is the Internet version of learning your Marxist urban poet friend has a trust fund",
            "user": {
                "id": 55525953,
                "screen_name": "Pinboard",
                "name": "Pinboard"
            },
            "retweet_count": 190,
            "favorite_count": 206
        }
    ],
    "notes": {
        "cRaZy.note": "completely unreasonable"
    }
};


// funny stuff.
// but we have some srs bsns to attend to.

dotted.getNested(tweets, 'items.1.user.screen_name') // => 'PennyRed'
// Array indices are fine, as all keys are strings in JS

dotted.setNested(tweets, 'flags.reviewed', true)
// No error is thrown, but...

dotted.getNested(tweets, 'flags.reviewed') // => undefined
// The fact that `flags` doesn't exist prevents `reviewed` from being set.
// The `ensure` option will fix it.

dotted.setNested(tweets, 'flags.reviewed', 'twice!', { ensure:true })
dotted.getNested(tweets, 'flags.reviewed') // => 'twice!'
// Ahh, much better.

// Note dotted also accepts Arrays in place of dotted keys -- this helps us
// deal with cRaZy keys with dots in them:
dotted.getNested(tweets, ['notes', 'cRaZy.note']) // => 'completely unreasonable'

```

Word.


## Usage

For usage in [node.js][node], install it via [npm][npm]:

```sh
npm install dotted
```

For the client side, I'm a fan of [browserify][browserify] to get my `require` on.
When there isn't a `require` about, `dotted` will simply install itself at `window.dotted`. 
It's up to you how you get it on the page -- you can download a [dotted.js](./dist/dotted.js) dist (old school);
or install via a random [client-side][bower] [package-manager][component1] (crazy):

```sh
bower install dotted
component install dsc/dotted
```

`dotted` presently depends on a `_` library, so get [lodash][lodash] (or [underscore][underscore])
on the page as well. You can mix `dotted` into `_`, if you wish, for convenience and chaining:

```js
var _ = require('lodash');
_.mixin(dotted);
```

This dependency is ugly, but for now `dotted` will attempt to require a `_` library if it can, 
and fall back to `window._` / `globals._`. It yells if both fail. Anyway, even once that's
cleaned up, `dotted` will still play nicely with others -- as a mixin and standalone.


## API

### Options

Many accessor functions take an options object with common fields. The sub-object
delegation options (`getter`, `setter`, and `deleter`) are used to specify where
to look for the specific accessor method on a custom sub-object when performing
that operation. (Functions that do not use that operation will ignore these
options, so you're welcome to specify them everywhere just to be safe.)


| name        | type      | default    | description                                                                                                                                            |
| ----------- | --------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **getter**  | `String`  | `"get"`    | Name of the sub-object getter method to delegate to (if it exists).                                                                                    |
| **setter**  | `String`  | `"set"`    | Name of the sub-object setter method to delegate to (if it exists).                                                                                    |
| **deleter** | `String`  | `"delete"` | Name of the sub-object deleter method to delegate to (if it exists).                                                                                   |
| **ensure**  | `Boolean` | `false`    | If true, intermediate keys that are `null` or `undefined` will be filled in with a new empty object `{}`, ensuring the get will return valid metadata. |



### Delegating Accessors

#### dotted.get(target, key, def, options) -> value

Gets the value at `key` from the object if present, returning `def` otherwise.


#### dotted.set(target, key, value, options) -> target

Puts a given value to `key` on the given target object. If an object is supplied as `key` instead of a String, 
each key-value pair on that object will be put to the target object. In this case, omit `value`. Returns the 
target object.


#### dotted.delete(target, key, options) -> oldValue

Deletes `key` from the target object, returning whatever value was present prior to being removed.



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

Searches a hierarchical object for a potentially-nested key and removes it, returning whatever value was 
previously there prior to removal.

**Aliases:** `unsetNested`.


#### dotted.getNestedMeta(object, chain, options) -> Object

*[Private]* Searches a hierarchical object for a given subkey (specified in dotted-property syntax),
respecting sub-object accessor-methods (e.g., 'get', 'set') if they exist. If found, returns an object 
of the form `{ key: Qualified key name, obj: Parent object of key, val: Value at obj[key], opts: Options }`,
and otherwise `undefined`.








## Feedback

Find a bug or want to contribute? Open a ticket (or fork the source!) on [github][project]. 
You're also welcome to send me email at [dsc@less.ly][dsc_email].

--

`dotted` was written by [David Schoonover][dsc]; it is open-source software and
freely available under the [MIT License][mit_license].


## Development

- This project is written in [Coco][coco], a dialect of [CoffeeScript][coffee]  -- both of which 
  compile down to plain JavaScript. Coco and Coffee are quite similar, [except][coco-incompatibilities] 
  for [a few things][coco-vs-coffee]. (Things which, imo, make Coco [vastly more pleasant][coco-improvements] 
  to work in). If you can read JavaScript (or Ruby, really), you'll find Coco/Coffee familiar.
  
  (I refer to the [CoffeeScript docs][coffee-docs] for the syntax, and I find 
  the [comparison page][coco-vs-coffee] to be the best reference for Coco.)
  
- Coco requires compilation before it'll run in the browser (though node can run it 
  directly -- `#!/usr/bin/env coco` will work as a shebang as well). 
  I wrote [request middleware][connect-compiler] that recompiles stale files on demand, and it is pretty cool.
  


[nodejs]: http://nodejs.org/
[npm]: http://npmjs.org/
[coco]: https://github.com/satyr/coco
[coco-vs-coffee]: https://github.com/satyr/coco/wiki/side-by-side-comparison
[coco-improvements]: https://github.com/satyr/coco/wiki/improvements
[coco-incompatibilities]: https://github.com/satyr/coco/wiki/incompatibilities
[coffee]: http://coffeescript.org/
[coffee-docs]: http://coffeescript.org/#language
[connect-compiler]: https://github.com/dsc/connect-compiler
[jade]: https://github.com/visionmedia/jade
[expressjs]: http://expressjs.com/guide.html
[express-resource]: https://github.com/visionmedia/express-resource
[stylus]: http://learnboost.github.com/stylus/

[component1]: http://component.github.io/ "jam install component/component"
[bower]: http://bower.io/ "component install bower/bower"
[jamjs]: http://jamjs.org/ "bower install caolan/jam"
[meteor]: http://docs.meteor.com/#packages "npm install meteor"



[project]: https://github.com/dsc/dotted "Underscore.nested on GitHub"
[dsc]: https://github.com/dsc/ "David Schoonover"
[dsc_email]: mailto:dsc+dotted@less.ly?subject=dotted.js "dsc@less.ly"
[mit_license]: http://dsc.mit-license.org/ "MIT License"

[node]: http://nodejs.org/ "node.js"
[npm]: http://npmjs.org/ "npm"
[lodash]: http://lodash.com "Lodash"
[underscore]: http://underscorejs.org "Underscore.js"










