package main

//go:generate gopherjs build -o go.js

import (
	"bytes"
	"crypto/sha256"
	//"encoding/base64"
	"encoding/binary"
	"encoding/hex"
	"log"
	"math/big"
	"strconv"

	"github.com/gopherjs/gopherjs/js"
	gbn256 "golang.org/x/crypto/bn256"
)

//previous, randomness and public_key are hexadecimal strings, round is a string representing an int
func Verify(previous string, randomness string, round string, public_key string) bool {

	prev, err := hex.DecodeString(previous)
	if err != nil {
		log.Fatal(err)
	}
	var buff bytes.Buffer
	iround, _ := strconv.Atoi(round)
	binary.Write(&buff, binary.BigEndian, uint64(iround))
	buff.Write(prev)
	msg := buff.Bytes()

	h := sha256.New()
	h.Write(msg)
	k := new(big.Int).SetBytes(h.Sum(nil))
	a := new(gbn256.G1).ScalarBaseMult(k)

	data, err := hex.DecodeString(public_key)
	if err != nil {
		log.Fatal(err)
	}
	//We can get rid of the leading 1 added during Marshal
	data = data[1:]
	b, _ := new(gbn256.G2).Unmarshal(data)

	sig, err := hex.DecodeString(randomness)
	if err != nil {
		log.Fatal(err)
	}
	c, _ := new(gbn256.G1).Unmarshal(sig)

	d := new(gbn256.G2).ScalarBaseMult(new(big.Int).SetInt64(1))

	left := gbn256.Pair(a, b)
	right := gbn256.Pair(c, d)
	if bytes.Equal(left.Marshal(), right.Marshal()) {
		return true
	} else {
		return false
	}
}

func main() {
	//js.Module is undefined because we are in a browser so can't call node.js js.Module
	js.Module.Get("exports").Set("Verify", Verify)
}
