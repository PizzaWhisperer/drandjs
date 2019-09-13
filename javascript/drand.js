// fetchAndVerify fetches needed information to verify the latest randomness and verifies it
var fetchAndVerify = function(identity, distkey) {
  if (distkey == "") {

    //fetch the distkey as well
    return new Promise(function(resolve, reject) {
      var previous = 0; var signature = 0; var randomness = 0; var round = 0; var err = 0;
      fetchKey(identity).then(key => {
        distkey = key.key;
        fetchPublic(identity).then(rand => {
          previous = rand.previous;
          signature = rand.signature;
          randomness = rand.randomness;
          round = rand.round.toString();
          if (verifyDrand(previous, signature, randomness, round, distkey)) {
            resolve({"round":round, "previous":previous, "signature":signature, "randomness": randomness});
          } else {
            reject({"round":round, "previous":previous, "signature":signature, "randomness": randomness});
          }
        }).catch(error => console.error('Could not fetch randomness:', error));
      }).catch(error => console.error('Could not fetch the distkey:', error));
    });

  } else {
    //use given distkey
    return new Promise(function(resolve, reject) {
      var previous = 0; var signature = 0; var randomness = 0; var round = 0; var err = 0;
      fetchPublic(identity).then(rand => {
        previous = rand.previous;
        signature = rand.signature;
        randomness = rand.randomness;
        round = rand.round.toString();
        if (verifyDrand(previous, signature, randomness, round, distkey)) {
          resolve({"round":round, "previous":previous, "signature":signature, "randomness": randomness});
        } else {
          reject({"round":round, "previous":previous, "signature":signature, "randomness": randomness});
        }
      }).catch(error => console.error('Could not fetch randomness:', error))
    });
  }
}

// fetchAndVerify fetches needed information to verify the randomness at a given round and verifies it
var fetchAndVerifyRound = function(identity, distkey, round) {
  if (distkey == "") {

    return new Promise(function(resolve, reject) {
      var previous = 0; var signature = 0; var randomness = 0; var err = 0;
      fetchKey(identity).then(key => {
        distkey = key.key;
        fetchRound(identity, round).then(rand => {
          previous = rand.previous;
          signature = rand.signature;
          randomness = rand.randomness;
          if (verifyDrand(previous, signature, randomness, round, distkey)) {
            resolve({"round":round, "previous":previous, "signature":signature, "randomness": randomness});
          } else {
            reject({"round":round, "previous":previous, "signature":signature, "randomness": randomness});
          }
        }).catch(error => {
          console.log(error);
          if (error.name === 'SyntaxError') {
            console.error('Could not fetch the round:', round);
          } else {
            console.error('Could not fetch randomness:', error);
          }
        });
      }).catch(error => console.error('Could not fetch the distkey:', error));
    });

  } else {

    return new Promise(function(resolve, reject) {
      var previous = 0; var signature = 0; var randomness = 0; var err = 0;
      fetchRound(identity, round).then(rand => {
        previous = rand.previous;
        signature = rand.signature;
        randomness = rand.randomness;
        if (verifyDrand(previous, signature, randomness, round, distkey)) {
          resolve({"round":round, "previous":previous, "signature":signature, "randomness": randomness});
        } else {
          reject({"round":round, "previous":previous, "signature":signature, "randomness": randomness});
        }
      }).catch(error => {
        console.log(error);
        if (error.name === 'SyntaxError') {
          console.error('Could not fetch the round:', round);
        } else {
          console.error('Could not fetch randomness:', error);
        }
      });
    });
  }
}
