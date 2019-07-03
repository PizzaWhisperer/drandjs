var fetchAndVerify = function(identity, distkey) {

  if (distkey == "") {

    return new Promise(function(resolve, reject) {
      var previous = 0; var randomness = 0; var round = 0; var err = 0;
      fetchKey(identity).then(key => {
        distkey = key.key.point;
        fetchPublic(identity).then(rand => {
          previous = rand.previous;
          randomness = rand.randomness.point;
          round = rand.round.toString();
          if (verifyDrand(previous, randomness, round, distkey)) {
            resolve({"randomness":randomness, "previous":previous, "round":round});
          } else {
            reject({"randomness":randomness, "previous":previous, "round":round});
          }
        }).catch(error => console.error('Could not fetch randomness:', error));
      }).catch(error => console.error('Could not fetch the distkey:', error));
    });

  } else {

    return new Promise(function(resolve, reject) {
      var previous = 0; var randomness = 0; var round = 0; var err = 0;
      fetchPublic(identity).then(rand => {
        previous = rand.previous;
        randomness = rand.randomness.point;
        round = rand.round.toString();
        if (verifyDrand(previous, randomness, round, distkey)) {
          resolve({"randomness":randomness, "previous":previous, "round":round});
        } else {
          reject({"randomness":randomness, "previous":previous, "round":round});
        }
      }).catch(error => console.error('Could not fetch randomness:', error))
    });
  }
}

var fetchAndVerifyRound = function(identity, distkey, round) {

  if (distkey == "") {

    return new Promise(function(resolve, reject) {
      var previous = 0; var randomness = 0; var err = 0;
      fetchKey(identity).then(key => {
        distkey = key.key.point;
        fetchRound(identity, round).then(rand => {
          previous = rand.previous;
          randomness = rand.randomness.point;
          if (verifyDrand(previous, randomness, round, distkey)) {
            resolve({"randomness":randomness, "previous":previous, "round":round});
          } else {
            reject({"randomness":randomness, "previous":previous, "round":round});
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
      var previous = 0; var randomness = 0; var err = 0;
      fetchRound(identity, round).then(rand => {
        previous = rand.previous;
        randomness = rand.randomness.point;
        if (verifyDrand(previous, randomness, round, distkey)) {
          resolve({"randomness":randomness, "previous":previous, "round":round});
        } else {
          reject({"randomness":randomness, "previous":previous, "round":round});
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
