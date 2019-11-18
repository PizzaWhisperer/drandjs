/**
* fetchAndVerify fetches needed information to check the randomness at a given round and verifies it
* @param identity
* @param distkey
* @param round
* @return Promise with struct {round previous signature randomness} both on completion and error
**/
var fetchAndVerify = function(identity, distkey, round) {
  var previous = 0; var signature = 0; var randomness = 0; var err = 0;
  if (distkey === defaultDistKey) {
    //fetch the distkey as well
    return new Promise(function(resolve, reject) {
      fetchKey(identity).then(key => {
        distkey = key.key;
        if (round == latestRound) {
          //use latest randomness
          fetchLatest(identity).then(rand => {
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
        } else {
          //fetch given round
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
        }
      }).catch(error => console.error('Could not fetch the distkey:', error));
    });

  } else {
    //we use given distkey
    return new Promise(function(resolve, reject) {
      if (round == latestRound) {
        //use latest randomness
        fetchLatest(identity).then(rand => {
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
      } else {
        //fetch given round
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
      }
    });
  }
}
