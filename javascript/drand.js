var fetchAndVerify = function(identity, key) {

  if (key == "") {

    return new Promise(function(resolve, reject) {
      var distkey = 0; var previous = 0; var randomness = 0; var round = 0; var err = 0;
      fetchKey(identity).then(key => {
        distkey = key.key.point
        fetchPublic(identity).then(rand => {
          previous = rand.previous
          randomness = rand.randomness.point
          round = rand.round.toString();
          if (verify_drand(previous, randomness, round, distkey)) {
            resolve([randomness, previous, round]);
          } else {
            reject([randomness, previous, round]);
          }
        }).catch(error => console.error('Could not fetch randomness:', error));
      }).catch(error => console.error('Could not fetch the distkey:', error));
    });

  } else {

    return new Promise(function(resolve, reject) {
      var distkey = 0; var previous = 0; var randomness = 0; var round = 0; var err = 0;
      fetchPublic(identity).then(rand => {
        distkey = key
        previous = rand.previous
        randomness = rand.randomness.point
        round = rand.round.toString();
        if (verify_drand(previous, randomness, round, distkey)) {
          resolve([randomness, round]);
        } else {
          reject([randomness, round]);
        }
      }).catch(error => console.error('Could not fetch randomness:', error))
    });
  }
}

window.fetchAndVerify = fetchAndVerify
