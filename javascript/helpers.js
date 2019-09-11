// fetchPublic fetches the randomness from the node described by identity
function fetchPublic(identity) {
  var fullPath = identity.Address + "/api/public";
  if (identity.TLS == false) {
    fullPath = "http://" + fullPath;
  } else  {
    fullPath = "https://" + fullPath;
  }
  return fetch(fullPath).then(resp => Promise.resolve(resp.json()));
}

// fetchRound fetches the randomness at given round
function fetchRound(identity, round) {
  var fullPath = identity.Address + "/api/public/" + round;
  if (identity.TLS == false) {
    fullPath = "http://" + fullPath;
  } else  {
    fullPath = "https://" + fullPath;
  }
  return fetch(fullPath).then(resp => Promise.resolve(resp.json()));
}

// fetchKey fetches the public key
function fetchKey(identity) {
  var fullPath = identity.Address + "/api/info/distkey";
  if (identity.TLS == false) {
    fullPath = "http://" + fullPath;
  } else  {
    fullPath = "https://" + fullPath;
  }
  return fetch(fullPath).then(resp => Promise.resolve(resp.json()));
}

// fetchGroup fetches the group file
function fetchGroup(identity) {
  var fullPath = identity.Address + "/api/info/group";
  if (identity.TLS == false) {
    fullPath = "http://" + fullPath;
  } else  {
    fullPath = "https://" + fullPath;
  }
  return fetch(fullPath).then(resp => Promise.resolve(resp.json()));
}

// hexToBytes converts hex string to bytes array
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

// intToBytes converts int to bytes array
function intToBytes(int) {
    var bytes = [];
    var i = 8;
    do {
    bytes[--i] = int & (255);
    int = int>>8;
    } while ( i )
    return bytes;
}

// message created signed content from previous and round
function message(prev, round) {
  var b_prev = hexToBytes(prev);
  var b_round = intToBytes(round);
  return b_round.concat(b_prev);
}

// verifyDrand formats previous and round into the signed message, verifies the
// signature against the distributed key and checks that the randomness hash
// matches
function verifyDrand(previous, signature, randomness, round, distkey) {
  try {
    var msg = message(previous, round);
    var p = new kyber.pairing.point.BN256G2Point();
    p.unmarshalBinary(hexToBytes(distkey));
    var sig = hexToBytes(signature);
    var ver_sig = kyber.sign.bls.verify(msg, p, sig);
    var ver_rand = true;
    return ver_rand && ver_sig;
  } catch (e) {
    console.error('Could not verify:', e);
    return false;
  }
}
