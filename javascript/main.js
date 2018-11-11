main = require("./go.js");

function fetchPublic(identity) {
  var fullPath = identity.Address + "/public";
  if (identity.TLS == false) {
      fullPath = "http://" + fullPath;
  } else  {
    fullPath = "https://" + fullPath;
  }
  return fetch(fullPath).then(resp => Promise.resolve(resp.json()));
}

function fetchKey(identity) {
  var fullPath = identity.Address + "/info/dist_key";
  if (identity.TLS == false) {
      fullPath = "http://" + fullPath;
  } else  {
    fullPath = "https://" + fullPath;
  }
  return fetch(fullPath).then(resp => Promise.resolve(resp.json()));
}

var fetchAndVerify = function(address) {
  return new Promise(function(resolve, reject) {
    var pub_key = 0; var previous = 0; var randomness = 0; var round = 0; var err = 0;

    fetchKey(address).then(key => {
      pub_key = key.key

      fetchPublic(address).then(rand => {
        previous = rand.previous
        randomness = rand.randomness
        round = rand.round
        ok = main.Verify(previous, randomness, round, pub_key)
        if (!ok) {
          resolve([previous, randomness, round]);
        } else {
          reject([previous, randomness, round]);
        }
      })
    })
  });
}

/*
var fetchAndVerify = new Promise(
function(address) {
var pub_key = 0; var previous = 0; var randomness = 0; var round = 0; var err = 0;
fetchKey(address).then(key => {
    pub_key = key.key
    fetchPublic(address).then(rand => {
      previous = rand.previous
      randomness = rand.randomness
      round = rand.round
      //err = main.Verify(previous, randomness, round, pub_key)
      //console.log("is it a Promise?");
      //console.log(Promise.resolve(main.Verify(previous, randomness, round, pub_key)) == main.Verify(previous, randomness, round, pub_key));
      //while (err == undefined) {
        //console.log("undef");
      //}
      //console.log("err after")
      //console.log(err)
      //console.log("previous after")
      console.log(previous)
      //console.log("pub key")
      //console.log(pub_key)
      return previous, randomness, round, false
    })
  })
}
*/
window.fetchAndVerify = fetchAndVerify
