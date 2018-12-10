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

var fetchAndVerify = function(identity) {
  return new Promise(function(resolve, reject) {
    var pub_key = 0; var previous = 0; var randomness = 0; var round = 0; var err = 0;

    fetchKey(identity).then(key => {
      pub_key = key.key.point
      fetchPublic(identity).then(rand => {
        previous = rand.previous
        randomness = rand.randomness.point
        round = rand.round.toString();
        if (main.Verify(previous, randomness, round, pub_key)) {
          resolve([randomness, round]);
        } else {
          reject([randomness, round]);
        }
      })
    })
  });
}

var fetchAndVerifyWithKey = function(identity) {
  return new Promise(function(resolve, reject) {
    var pub_key = 0; var previous = 0; var randomness = 0; var round = 0; var err = 0;
    fetchPublic(identity).then(rand => {
      pub_key = identity.Key
      previous = rand.previous
      randomness = rand.randomness.point
      round = rand.round.toString();
      if (main.Verify(previous, randomness, round, pub_key)) {
        resolve([randomness, round]);
      } else {
        reject([randomness, round]);
      }
    })
  });
}

window.fetchAndVerify = fetchAndVerify
window.fetchAndVerifyWithKey = fetchAndVerifyWithKey
