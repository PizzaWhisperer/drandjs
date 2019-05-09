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

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

function message(msg, round) {
/*var buff bytes.Buffer
binary.Write(&buff, binary.BigEndian, round)
buff.Write(prevRand)
return buff.Bytes()*/
}

//previous, randomness and public_key are hexadecimal strings, round is a string representing an int
function verify_drand(previous, randomness, round, pub_key) {
  var nist = kyber.curve.nist;
  var p256 = new nist.Curve(nist.Params.p256);
  var message = hexToBytes(previous);
  var p = new kyber.pairing.point.BN256G2Point();
  p.unmarshalBinary(hexToBytes(pub_key));
  var sig = hexToBytes(randomness);
  return kyber.sign.bls.verify(message, p, sig);
}
