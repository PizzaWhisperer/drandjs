# drandjs

Using the package [kyberJS](https://github.com/dedis/cothority/tree/master/external/js/kyber) from dedis, we provide a JavaScript library with a function `fetchAndVerify` that can verify the randomness of the outputted signature S of a [drand](https://github.com/dedis/drand) round, against a message M and the distributed key DK of the protocol run. To do such, it checks that e(M, DK) = e(S, 1), with e being the Optimal Ate pairing operation.

#### Identity
`fetchAndVerify` takes as parameter a structure identity composed of the address to fetch the random signature from and a boolean specifying whether to use https or http, and the distributed key.
`fetchAndVerify` can also be used in fully **automatic** mode, and fetch the distributed key for the user, to do such, use "" for the Key such as :
```javascript
{
  Address: "drand.nikkolasg.xyz:8888",
  TLS: true,
  Key: "",
}
```

If you want to specify which distributed key to use, which should be an hexadecimal string, you can provide an identity struct which looks like :
```javascript
{
  Address: "drand.nikkolasg.xyz:8888",
  TLS: true,
  Key: "017f2254bc09a999661f92457122613adb773a6b7c74333a59bde7dd552a7eac2a79263bb6fb1f3840218f3181218b952e2af35be09edaee66566b458c92609f7571e8bb519c9109055b84f392c9e84f5bb828f988ce0423ce708be1dcf808d9cc63a610352b504115ee38bc23dd259e88a5d1221d53e45c9520be9b601fb4f578",
}
```

#### Returns
The function returns a Promise [randomness, previous, round].
#### Usage

To use drandjs, bundle every file together by running `make compile`. It will create a file `drand.js` in the folder `dist` that you can import with the line :
```javascript
<script src="../path/to/drand.js"></script>
```
or
```javascript
<script src="https://cdn.jsdelivr.net/gh/PizzaWhisperer/drandjs/dist/drand.js"></script>
```
if you don't want to download anything, and call it like :
```javascript
identity = XXX;
fetchAndVerify(identity)
  .then(function (fulfilled) {
  //The random output was successfully verified, you can
  //do something with fulfilled = [randomness, previous, round] such as printing it.
  })
  .catch(function (error) {
    //A problem occurred during the verification process. You can
    //do something with error = [randomness, previous, round] such as printing it.
  })
```

#### Example

We provide a script to locally run a server that will fake a drand server and a simple html file which show what you could do with `fetchAndVerify`.

To launch the server and open the html file, go to the `example` folder and execute:
```bash
python3 script.py
```
