# drandjs

Using the package [bn256](https://godoc.org/golang.org/x/crypto/bn256) form golang.org, we provide a JavaScript library with a function `fetchAndVerify` that can verify the randomness of the outputted signature S of a [drand](https://github.com/dedis/drand) round, against a message M and the distributed key DK of the protocol run. To do such, it checks that e(M, DK) = e(S, 1), with e being the Optimal Ate pairing operation.
`fetchAndVerify` procedure has 3 steps : it fetches the distributed key at the given address, then the random output, and then verifies the randomness with the process described above.


#### Params
`fetchAndVerify` takes as parameter a structure identity composed of the address to fetch the random signature from and a boolean specifying whether to use https or http, such as :
```javascript
{
  Address: "drand.nikkolasg.xyz:8888",
  TLS: true,
}
```
#### Returns
`fetchAndVerify` is a Promise which returns a array [randomness, round].
#### Usage
To use the function `fetchAndVerify`, just import the library within an html file with the line
```javascript
<script src="../javascript/bundle.js"></script>
```
and call it like :
```javascript
identity = XXX;
fetchAndVerify(identity)
  .then(function (fulfilled) {
  //The random output was successfully verified, you can
  //do something with fulfilled = [randomness, round] such as printing it.
  })
  .catch(function (error) {
    //A problem occurred during the verification process. You can
    //do something with error = [randomness, round] such as printing it.
  })
```
See [view/index.html](view/index.html) for an example.

Uses [gopherjs](https://github.com/gopherjs/gopherjs) and [browserify](http://browserify.org/).
