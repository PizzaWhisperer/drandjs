main = require("./lib.js");

function fetchPublic(identity) {
  var fullPath = identity.Address + "/public";
  if (identity.TLS == false) {
      fullPath = "http://" + fullPath;
  } else  {
    fullPath = "https://" + fullPath;
  }
  console.log("fetching " + fullPath);
  return fetch(fullPath).then(resp => Promise.resolve(resp.json()));
}

var fetchAndVerify = function(identity) {
fetchPublic(identity)
     .then(rand => {
       previous = rand.previous
       randomness = rand.randomness
       round = rand.round
       var p = document.createElement("p");
       var div = document.querySelector('div');
       public_key_hex = "012067064287f0d81a03e575109478287da0183fcd8f3eda18b85042d1c8903ec8160c56eb6d5884d8c519c30bfa3bf5181f42bcd2efdbf4ba42ab0f31d13c97e9552543be1acf9912476b7da129d7c7e427fbafe69ac5b635773f488b8f46f3fc40c673b93a08a20c0e30fd84de8a89adb6fb95eca61ef2fff66527b3be4912de"
       err = main.Verify(previous, randomness, round, public_key_hex)
        if (!err) {
          var textnode = document.createTextNode('(' + rand.round + ') ' + rand.randomness + ' : verified.');
          console.log("Succes")
        } else {
          var textnode = document.createTextNode('(' + rand.round + ') ' + rand.randomness + ' : not verified.');
          console.log("Failed to verify")
        }
        p.appendChild(textnode);
        div.appendChild(p);
     })
}

window.fetchAndVerify = fetchAndVerify
