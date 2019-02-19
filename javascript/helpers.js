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

/*
function message(previous, round) {

// Message returns a slice of bytes as the message to sign or to verify
// alongside a beacon signature.
func Message(prevRand []byte, round uint64) []byte {
	var buff bytes.Buffer
	binary.Write(&buff, binary.BigEndian, round)
	buff.Write(prevRand)
	return buff.Bytes()
}

return m;
}
*/

/*function format(previous, randomness, round, pub_key, ) {
  var msg = message(previous, round);
  var m = BigInteger.fromInt(msg);
  var M = Et.kG(m);
  var s = BigInteger.fromInt;
  var S = Et.kG(s);
  var k = BigInteger.fromInt;
  var K = Et.kG(k);
  return M, S, K;
}*/

//previous, randomness and public_key are hexadecimal strings, round is a string representing an int
function verify(previous, randomness, round, pub_key) {
  /*
  var fieldBits = 128; //XXX
  var fieldBits = 256; //XXX
  var bn = new JSParams(fieldBits);
  var E = new JSCurve(bn);
  var Et = new JSCurve2(E);
  var O = E.G //XXX
  var O = Et.Gt //XXX
  var pair = new JSPairing(Et);
  var M, S, K = format(previous, randomness, round, pub_key);
  return pair.opt(M, K).equals(pair.opt(S, O));
  */
  var fieldBits = 128;
  var bn = new JSParams(fieldBits);
  var E = new JSCurve(bn);
  var Et = new JSCurve2(E);
  var pair = new JSPairing(Et);
  var rng = new SecureRandom();
  var m = new BigInteger(fieldBits, rng);
  var a = Et.Gt.multiply(m);
  //a is JSPoint2
  var b = pair.opt(a, E.G);
  //b is JSField12
return true;

}
