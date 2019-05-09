# drandjs

Using the package [kyberJS](https://github.com/dedis/cothority/tree/master/external/js/kyber) from dedis, we provide a JavaScript library with two functions `fetchAndVerify` and `fetchAndVerifyWithKey` that can verify the randomness of the outputted signature S of a [drand](https://github.com/dedis/drand) round, against a message M and the distributed key DK of the protocol run. To do such, it checks that e(M, DK) = e(S, 1), with e being the Optimal Ate pairing operation.
`fetchAndVerify` procedure has 3 steps : it fetches the distributed key at the given address, then the random output, and then verifies the randomness with the process described above.
On the other hand, `fetchAndVerifyWithKey` does not fetch the distributed key but uses the one given by the user.


#### Params
`fetchAndVerify` takes as parameter a structure identity composed of the address to fetch the random signature from and a boolean specifying whether to use https or http, such as :
```javascript
{
  Address: "drand.nikkolasg.xyz:8888",
  TLS: true,
}
```
To specify which distributed key to use, `fetchAndVerifyWithKey` needs in addition a field `Key` which should be an hexadecimal string. For example :
```javascript
{
  Address: "drand.nikkolasg.xyz:8888",
  TLS: true,
  Key: "017f2254bc09a999661f92457122613adb773a6b7c74333a59bde7dd552a7eac2a79263bb6fb1f3840218f3181218b952e2af35be09edaee66566b458c92609f7571e8bb519c9109055b84f392c9e84f5bb828f988ce0423ce708be1dcf808d9cc63a610352b504115ee38bc23dd259e88a5d1221d53e45c9520be9b601fb4f578",
}
```

#### Returns
Both functions are Promises which return a array [randomness, round] on completion.
#### Usage
To use the functions `fetchAndVerify` and `fetchAndVerifyWithKey`, download the folder `javascript` and import the 3 `js` files within your html with the lines :
```javascript
<script src="../javascript/kyberjs.min.js"></script>
<script src="../javascript/helpers.js"></script>
<script src="../javascript/drand.js"></script>
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
Same scheme can be applied to `fetchAndVerifyWithKey`.

#### Example
We provide a script to locally run a server that will fake a drand instance and a simple html file which show what you can do with `fetchAndVerify` and `fetchAndVerifyWithKey`. To specify which function to test, comment/uncomment the corresponding lines in the `chooseOne` function of the [`view/index.html` file](https://github.com/PizzaWhisperer/drandjs/blob/master/view/index.html#L91-L92). The default function used is `fetchAndVerify` (the one that fetches the distributed key).

To launch the server and open the html file, go to the `example` folder and execute:
```bash
python3 script.py
```
