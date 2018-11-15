package main

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestVerify(t *testing.T) {
	pubKey := "017f2254bc09a999661f92457122613adb773a6b7c74333a59bde7dd552a7eac2a79263bb6fb1f3840218f3181218b952e2af35be09edaee66566b458c92609f7571e8bb519c9109055b84f392c9e84f5bb828f988ce0423ce708be1dcf808d9cc63a610352b504115ee38bc23dd259e88a5d1221d53e45c9520be9b601fb4f578"

	var round string = "2"
	var previous string = "2dbb77ae2c130c524b602338c02e33c246e51a6bc696a168398bfd7bd96c4d231c99933adcd42fe1b32cfec0e8928d708c4dac4e0f19fc58d2b24824555198fd"
	var randomness string = "6a3557e04eca0e24a3fc28f11909a9a74de0fc64d28c85879573214a553633783150661555e63f05d7effdef576ecc779124b0413eb3a096290081687471bd2b"

	ok := Verify(previous, randomness, round, pubKey)
	require.True(t, ok)
}
