# drandjs

drandjs is a Javascript library able to communicate with a public [`drand`](https://github.com/dedis/drand) network. drandjs can fetch *public* randomness from a node or a group of nodes and verify it in the browser. drandjs uses the pairing-based library [kyberJS](https://github.com/dedis/cothority/tree/master/external/js/kyber) from dedis to perform the verification locally.

**NOTE**: This software was created under the supervision of [dedis](https://github.com/dedis) lab. It is considered experimental and has NOT received a third-party audit yet. Therefore, DO NOT USE it in production or for anything security critical at this point.

## Installation

The simplest way to use drandjs is to import the script from *jsdelivr* as in the following:
```javascript
<script src="https://cdn.jsdelivr.net/gh/PizzaWhisperer/drandjs/dist/drand.js"></script>
```

**Compile from source**: To compile the sources into a single bundled Javascript file, you can run `make compile` to create the file `dist/drand.js` ready to be included in your application.

## Usage

The following is a Javascript snippet showing the shortest way to get fresh verified randomness from a running `drand` network:
```javascript
// the identity of the node we want to contact
var identity = {
  Address: "drand.zerobyte.io:8888",
  TLS: true,
};

fetchAndVerify(identity, defaultDistKey, latestRound)
.then(function (fulfilled) {
  // The randomness was successfully fetched and verified. fulfilled has
  // the following structure:
  // {
  //     round: <integer>,
  //     previous: <hexadecimal encoding of the previous randomness>,
  //     signature: <hexadecimal encoding of the BLS signature of round || previous>,
  //     randomness: <hexadecimal encoding of randomness generated at the given round>,
  // }
})
.catch(function (error) {
  // A problem occurred during the verification process. error has the
  // same structure as fulfilled.
})
```

There are three important pieces of information to provide to drandjs:

-  **Identity**: It holds all required information to contact a `drand` node. The *Address* is the IP address or DNS name of the `drand` node the user wishes to contact. *TLS* is true if drandjs should contact this node over HTTPS (`drand` nodes by default are using HTTPS) and false if the node does not have a TLS certificate. One can retrieve the identity of `drand` nodes from the group configuration file of the network. See [`drand`](https://github.com/dedis/drand) for more information.

-  **Distributed Key**: It holds the distributed public key created during the setup phase of a `drand` network. The key must be in hexadecimal format and should be given out-of-bands (it can be obtained from the group configuration file or fetched from a `drand` node operator. If the key is not available, `fetchAndVerify` allows to give the value `defaultDistKey` in place of the `dist_key` argument, in which case, drandjs fetches the distributed key from the server *as well as* the randomness. However, in this mode of operation, the server **can lie** about the distributed key and thus create any valid *randomness* it wants.

```javascript
  // example of a correctly formatted distributed key.
  var dist_key = "51e1014efb8be0c0c8c70cec1473a0d5b2f40d3d926635b9e74c41f89673f6b37c0c752f67419a32db91abf31360d8659471b8709040cf650e908db7f4bda9308e01400477e3f586ccb607d7bcd47a0272cca6ec52d38d2599aedc70788f739a8dc265b7aaf7b6fd4aeb67058cbe5c586024c97068321117958b871741758b89";
```
-  **Round**: It holds the index of the randomness to be fetched and verified, which must be an integer. If the user wants to verify the *latest* randomness,`fetchAndVerify` allows to give the value `latestRound` in place of the `round` argument, in which case, drandjs fetches the most recent output.

### API

Here is a list of public function drandjs exposes. Note that all byte-like arguments (such as the randomness), unless otherwise noted, are hexadecimal-encoded strings.

- `fetchLatest(identity)` fetches the latest *public* randomness at the specified `drand` node.  See the [service definition](https://github.com/dedis/drand/blob/master/protobuf/drand/api.proto#L70) for the structure of the resulting JSON.

- `fetchRound(identity, round)` fetches the *public* randomness generated at the round `round` at the specified `drand` node.  The structure of the resulting JSON is the same as `fetchPublic`.

- `verifyDrand(previous, signature, randomness, round, distkey)` returns `true` if two conditions are met. First the verification of the given `signature` against the `distkey` over the message formed from both the `previous` and `round` arguments is successful. Second, the sha512 hash of `signature` must be the same as the received `randomness` string. It returns `false` if an error occurred during the verification process.

- `fetchAndVerify(identity, distkey, round)` sequentially calls `fetchLatest` (or `fetchRound` if `round` is not set to the default value) and `verifyDrand` and then returns a Promise, holding the eventual randomness in case of success and the error in case of failure. It returns a JSON structure such as:
```json
  {
  "round": 1,
  "previous": "66756e6320766572795f72616e646f6d5f66756e6374696f6e2829207b2072657475726e2034207d",
  "signature": "512d7b5a03579ed47e667cbd76214bfb94c0ed81652359842191de1713da559f26ea424bf87de007d26cd7b8b4e689891fdfbad8fe70dfd91e666c719f8bf869",
  "randomness": "359c79e874e8aa2c5664541f3247741f44a45ca9789a8822a3fc290822ca5d8686d7322c1cc323ddbf5598e509bea525988b4f95de0965518a546be4859b5eb8"
}
```

- `fetchGroup(identity)` returns the current group the node denoted by the identity belongs to. The returned group contains all the nodes in the network, the threshold, the period and the distributed public key as well. We refer to the [protobuf definition](https://github.com/dedis/drand/blob/master/protobuf/drand/info.proto#L12) for more information.

- `fetchKey(identity)` returns only the distributed key from which the node denoted by the given identity holds a share. We refer to the [protobuf definition](https://github.com/dedis/drand/blob/master/protobuf/drand/info.proto#L18) for more information.

### Test Server

We provide a script to locally run a server that will fake a `drand` node and a simple html file which show what you could do with `fetchAndVerify`.

To launch the server and open the html file, go to the `example` folder and execute:
```bash
python3 script.py
```
