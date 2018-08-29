package main

/* This file is a script that fetches every 60 seconds the randomness from the sepcified address
and then verify it against the distributed key.
To use : <script src="../go/script.js"></script> in html file
*/

//go:generate gopherjs build --minify

import (
	"bytes"
	"crypto/sha256"
	"encoding/base64"
	"encoding/binary"
	"encoding/hex"
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"math/big"
	"net/http"
	"strconv"
	"time"

	"github.com/gopherjs/gopherjs/js"
	gbn256 "golang.org/x/crypto/bn256"
)

const public_key_hex = "012067064287f0d81a03e575109478287da0183fcd8f3eda18b85042d1c8903ec8160c56eb6d5884d8c519c30bfa3bf5181f42bcd2efdbf4ba42ab0f31d13c97e9552543be1acf9912476b7da129d7c7e427fbafe69ac5b635773f488b8f46f3fc40c673b93a08a20c0e30fd84de8a89adb6fb95eca61ef2fff66527b3be4912de"

func Fetch(address string) (string, string, string, error) {
	//param address + rename to fetch public
	resp, err := http.Get(address)
	if err != nil {
		return err.Error(), "", "md", err
	}
	body, err := ioutil.ReadAll(resp.Body)
	resp.Body.Close()
	if err != nil {
		return "", "", "", err
	}

	type StructRand struct {
		Previous   string `json:"previous"`
		Randomness string `json:"randomness"`
		Round      string `json:"round"`
	}

	var randomOutput StructRand
	json.Unmarshal(body, &randomOutput)

	js.Global.Get("document").Call("write", "<p>Round : "+randomOutput.Round+"\n</p>")
	js.Global.Get("document").Call("write", "<p>Message : "+randomOutput.Previous+"\n</p>")
	js.Global.Get("document").Call("write", "<p>Signature : "+randomOutput.Randomness+"\n</p>")

	return randomOutput.Previous, randomOutput.Randomness, randomOutput.Round, nil
}

func Verify(previous string, randomness string, round string, public_key_hex string) error {

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
		js.Global.Get("document").Call("write", "Verified !\n")
		return nil
	} else {
		return errors.New("We couldn't verify")
	}
}

func main() {

	var beg time.Time
	var elapsed time.Duration
	var previous, randomness, round string
	var err error
	for {
		beg = time.Now()
		previous, randomness, round, err = Fetch("https://drand.nikkolasg.xyz:8888/public")
		if err != nil {
		}
		err = Verify(previous, randomness, round, public_key_hex)
		elapsed = beg.Sub(time.Now())
		time.Sleep(60*time.Second - elapsed)
	}
}
