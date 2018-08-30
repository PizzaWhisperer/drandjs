main = require("./lib.js");

function fetchPublic(identity) {
  var fullPath = identity.Address + "/public";
  if (identity.TLS == false) {
      fullPath = "http://" + fullPath;
  } else  {
    fullPath = "https://" + fullPath;
  }
  return fetch(fullPath).then(resp => Promise.resolve(resp.json()));
}

var fetchAndVerify = function(identity) {
fetchPublic(identity)
     .then(rand => {
       previous = rand.previous
       randomness = rand.randomness
       round = rand.round
       err = main.Verify(previous, randomness, round, identity.Public_key)
       return previous, randomness, round, err
     })
}

window.fetchAndVerify = fetchAndVerify
