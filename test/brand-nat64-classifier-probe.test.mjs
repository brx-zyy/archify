import assert from 'node:assert/strict';
import test from 'node:test';
import { isPrivateBrandAddress } from '../archify/renderers/shared/brand-marks.mjs';

// RFC 6052 permits network-specific translation prefixes. These /96 examples
// deliberately use a non-well-known prefix so the probe tests whether the
// classifier recognizes the embedded IPv4 destination, not a hard-coded
// 64:ff9b::/96 prefix.
test('probe: custom-prefix NAT64 embedding of RFC1918 IPv4 is currently accepted', () => {
  const cases = [
    ['2001:4860:abcd:1234:0:0:a00:1', '10.0.0.1'],
    ['2001:4860:abcd:1234:0:0:a9fe:a9fe', '169.254.169.254'],
    ['2001:4860:abcd:1234:0:0:c0a8:101', '192.168.1.1'],
  ];

  for (const [ipv6, embeddedIpv4] of cases) {
    assert.equal(isPrivateBrandAddress(embeddedIpv4), true, 'control: embedded IPv4 is private');
    assert.equal(isPrivateBrandAddress(ipv6), false,
      `candidate bypass reproduced: ${ipv6} embeds private IPv4 ${embeddedIpv4}`);
  }
});
