package main

//go:generate gopherjs build --tags generic -o go.js

import (
	"bytes"

	//"encoding/base64"

	"encoding/binary"
	"encoding/hex"
	"strconv"

	"github.com/dedis/kyber/pairing/bn256"
	"github.com/dedis/kyber/sign/bls"
	"github.com/gopherjs/gopherjs/js"
)

// Message returns a slice of bytes as the message to sign or to verify
// alongside a beacon signature.
func Message(prevRand []byte, round uint64) []byte {
	var buff bytes.Buffer
	binary.Write(&buff, binary.BigEndian, round)
	buff.Write(prevRand)
	return buff.Bytes()
}

var suite = bn256.NewSuite()

// Verify previous, randomness and public_key are hexadecimal strings, round is a string representing an int
func Verify(previous string, randomness string, round string, pubKey string) bool {

	prev, err := hex.DecodeString(previous)
	if err != nil {
		println("", err)
		return false
	}
	iround, _ := strconv.Atoi(round)
	msg := Message(prev, uint64(iround))

	data, err := hex.DecodeString(pubKey)
	if err != nil {
		println("", err)
		return false
	}
	pub := suite.G2().Point()
	if err := pub.UnmarshalBinary(data); err != nil {
		println(err)
		return false
	}

	sig, err := hex.DecodeString(randomness)
	if err != nil {
		println("", err)
		return false
	}

	if err := bls.Verify(suite, pub, msg, sig); err != nil {
		println("", err)
		return false
	}
	return true
}

func main() {
	//js.Module is undefined because we are in a browser so can't call node.js js.Module
	js.Module.Get("exports").Set("Verify", Verify)
}
