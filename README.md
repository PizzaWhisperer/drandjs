# drandjs

drandjs is a Javascript library able to communicate with a public [drand](https://github.com/dedis/drand) network. drandjs can fetch *public* randomness from a node or a group of nodes and verify it in the browser. drandjs uses the pairing-based library [kyberJS](https://github.com/dedis/cothority/tree/master/external/js/kyber) from dedis to perform the verification locally.

**NOTE**: This software was created under the supervision of [dedis](https://github.com/dedis) lab. It is considered experimental and has NOT received a third-party audit yet. Therefore, DO NOT USE it in production or for anything security critical at this point.

## Installation

The simplest way to use drandjs is to import the script from *jsdelivr* as in the following:
```javascript
<script src="https://cdn.jsdelivr.net/gh/PizzaWhisperer/drandjs/dist/drand.js"></script>
```

**Compile from sources**: To compile the sources into a single bundled Javascript file, you can run `make compile` to create the file `dist/drand.js` ready to be included in your application.

## Usage

The following is a Javascript snippet showing the shortest way to get verified randomness from a running drand network:
```javascript
// the identity of the node we want to contact
var identity = {
  Address: "drand-test.nikkolasg.xyz:8888",
  TLS: true,
};
// the distributed key of the public drand network (optional).
var dist_key = "30572b6ff54ab9b0a17ed055ffb915a9a31640ee1a10ed20ace8a2394d1121bb3fe4424a24323566b9ed3b6d4aaf43ef9351e1c989fd5e194e27c3d2ef4014586aee32472dddafb6f28f5b36fefdb7863f31f897684e203cd05ad5486baf602f84f02570f7385bc360a577111f5b03387c00d548cc2276a19b3c2e317117baba";

fetchAndVerify(identity, dist_key)
  .then(function (fulfilled) {
  // The randomness was successfully fetched and verified. fulfilled has 
  // the following structure:
  // {
  //     round: <integer>,
  //     previous: <hexadecimal encoding of the previous randomness>,
  //     randomness: <hexadecimal encoding of randomness generated at 
  //     the given round>,
  // }
  })
  .catch(function (error) {
    // A problem occurred during the verification process. error has the 
    // same structure as fulfilled.
  })
 ```

There are two important pieces of information to provide to drandjs:

-  **Identity**: It holds all required information to contact a drand node. The *Address* is the IP address or DNS name of the drand node the user wishes to contact. *TLS* is true if drandjs should contact this node over HTTPS (drand nodes by default are using HTTPS) and false if the node does not have a TLS certificate. One can retrieve the identity of drand nodes from the group configuration file of the network. See [drand](https://github.com/dedis/drand) for more information.

-  **Distributed Key**: It holds the distributed public key created during the setup phase of a drand network. The key must be in hexadecimal format and should be given out-of-bands (it can be obtained from the group configuration file or fetched from a drand node operator. If the key is not available, `fetchAndVerifỳ` allows to give an **empty string** in place of the `dist_key` argument, in which case, drandjs fetches the distributed key from the server *as well as* the randomness. However, in this mode of operation, the server **can lie** about the distributed key and thus create any valid *randomness* it wants.


### API 

Here is a list of public function drandjs exposes. Note that all byte-like arguments (such as the randomness), unless otherwise noted, are hexadecimal-encoded strings. 

- `fetchPublic(identity)` fetches the latest *public* randomness at the specified drand node.  See the [service definition](https://github.com/dedis/drand/blob/master/protobuf/drand/public.proto#L16) for the structure of the resulting JSON.

- `verifyDrand(previous, randomness, round, distkey)` returns `true` if the verification of the given `randomness` against the `distkey` over the message formed from both the `previous` and `round` arguments is successful. It returns `false` if an error occured during the verification process. 

- `fetchAndVerify(identity, distkey)` sequentially calls `fetchPublic` and `verifyDrand` and returns a Promise, holding the eventual randomness in case of success and the error in case of failure. It returns a JSON structure such as:
```json
{
  "randomness": "3393f21a641e7324b0b75ad0a40ba388e0add0bb5c9d61532ff501f35815bca85af6471f1f181a4d3c484d9cdf7a8fded25645ddde15fc33a15a01f61361c723",
  "previous": "05b851a3b36f11c6f38b2cfa808e3ed55256359694dc482639103c7668e702e70a165d73438cb30b5b73531cd6e17bed1ff623c3638cfdae85d815f339e85120",
  "round": 18332
}
```
- `fetchGroup(identity)` returns the current group the node denoted by the identity belongs to. The returned group contains all the nodes in the network, the threshold, the period and the distributed public key as well. We refer to the [protobuf definition](https://github.com/dedis/drand/blob/master/protobuf/drand/info.proto#L12) for more information.

- `fetchKey(identity)` returns only the distributed key from which the node denoted by the given identity holds a share. We refer to the [protobuf definition](https://github.com/dedis/drand/blob/master/protobuf/drand/info.proto#L18) for more information.

### Test Server

We provide a script to locally run a server that will fake a drand node and a simple html file which show what you could do with `fetchAndVerify`.

To launch the server and open the html file, go to the `example` folder and execute:
```bash
python3 script.py
```
