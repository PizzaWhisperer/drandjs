/*
* This file is used to generate the same output as a drand node would do
* The chosen message is formated and signed with a newly generated public key at
* each round, then this signature is hashed to generate the random output.
* The message, the signature, the randomness and the public key are then put into
* the folder api/.
 */

package main

import (
	"bytes"
	"crypto/sha512"
	"encoding/binary"
	"encoding/hex"

	"github.com/dedis/kyber/pairing/bn256"
	"github.com/dedis/kyber/sign/bls"
	"github.com/dedis/kyber/util/random"
)

// Message formats previous and round to create the signed message
func Message(prev []byte, round uint64) []byte {
	var buff bytes.Buffer
	binary.Write(&buff, binary.BigEndian, round)
	buff.Write(prev)
	return buff.Bytes()
}

func main() {
	suite := bn256.NewSuite()
	//pub_key
	private, public := bls.NewKeyPair(suite, random.New())
	println("pub_key:")
	p, _ := public.MarshalBinary()
	println(hex.EncodeToString(p))
	//previous
	round := uint64(1)
	tmp := []byte("func very_random_function() { return 4 }")
	msg := Message(tmp, round)
	println("previous:")
	println(hex.EncodeToString(msg))
	//signature
	sig, _ := bls.Sign(suite, private, msg)
	println("signature:")
	println(hex.EncodeToString(sig))
	if bls.Verify(suite, public, msg, sig) == nil {
		println("verified")
	} else {
		println("something went wrong")
	}
	//randomness
	h := sha512.New()
	h.Write(sig)
	println("randomness:")
	println(hex.EncodeToString(h.Sum(nil)))
}
