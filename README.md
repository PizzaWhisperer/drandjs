# drandjs
Uses [gopherjs](https://github.com/gopherjs/gopherjs) and [browserify](http://browserify.org/).

`fetchAndVerify` takes as argument a structure identity composed of the address to fetch the randomness from, a boolean specifying whether to use https or http, and the distributed public key of the drand protocol. It returns the fetched randomness, and an error if the random output was not verified.
To use the function `fetchAndVerify`, just import the library within an html file with the line
```javascript
<script src="../javascript/bundle.js"></script>
```

See [view/index.html](view/index.html) for an example.
