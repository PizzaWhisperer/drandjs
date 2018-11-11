package main

//go:generate gopherjs build -o go.js

import (
	"bytes"
	"crypto/sha256"
	"encoding/base64"
	"encoding/binary"
	"encoding/hex"
	"log"
	"math/big"
	"strconv"

	"github.com/gopherjs/gopherjs/js"
	gbn256 "golang.org/x/crypto/bn256"
)

func Verify(previous string, randomness string, round string, public_key_hex string) bool {

	prev, err := base64.StdEncoding.DecodeString(previous)
	if err != nil {
		log.Fatal(err)
	}
	var buff bytes.Buffer
	iround, _ := strconv.Atoi(round)
	binary.Write(&buff, binary.BigEndian, uint64(iround))
	buff.Write(prev)
	msg := buff.Bytes()

	sig, err := base64.StdEncoding.DecodeString(randomness)
	if err != nil {
		log.Fatal(err)
	}
	data, _ := hex.DecodeString(public_key_hex)
	//We can get rid of the leading 1 added during Marshal
	public_key := data[1:]

	h := sha256.New()
	h.Write(msg)
	k := new(big.Int).SetBytes(h.Sum(nil))
	a := new(gbn256.G1).ScalarBaseMult(k)
	b, _ := new(gbn256.G2).Unmarshal(public_key)
	left := gbn256.Pair(a, b)

	c, _ := new(gbn256.G1).Unmarshal(sig)
	d := new(gbn256.G2).ScalarBaseMult(new(big.Int).SetInt64(1))
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
