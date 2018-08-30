# drandjs
Uses [gopherjs](https://github.com/gopherjs/gopherjs) and [browserify](http://browserify.org/).

`fetchAndVerify` takes as argument a structure identity composed of the address to fetch the randomness from, a boolean specifying whether to use https or http, and the distributed public key of the drand protocol such as :
```javascript
{
  Address: "drand.nikkolasg.xyz:8888",
  TLS: true,
  Public_key: "012067064287f0d81a03e575109478287da0183fcd8f3eda18b85042d1c8903ec8160c56eb6d5884d8c519c30bfa3bf5181f42bcd2efdbf4ba42ab0f31d13c97e9552543be1acf9912476b7da129d7c7e427fbafe69ac5b635773f488b8f46f3fc40c673b93a08a20c0e30fd84de8a89adb6fb95eca61ef2fff66527b3be4912de"
}
```
It returns the fetched randomness, and an error if the random output was not verified.
To use the function `fetchAndVerify`, just import the library within an html file with the line
```javascript
<script src="../javascript/bundle.js"></script>
```

See [view/index.html](view/index.html) for an example.
