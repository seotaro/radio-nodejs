const { toPartialKey } = require('./utils');

test("toPartialKey のユニットテスト", () => {
  expect(toPartialKey('bcd151073c03b352e1ef2fd66c32209da9ca0afa', 0, 16)).toBe('YmNkMTUxMDczYzAzYjM1Mg==');
  expect(toPartialKey('bcd151073c03b352e1ef2fd66c32209da9ca0afa', 5, 16)).toBe('MTA3M2MwM2IzNTJlMWVmMg==');
  expect(toPartialKey('bcd151073c03b352e1ef2fd66c32209da9ca0afa', 0, 10)).toBe('YmNkMTUxMDczYw==');
  expect(toPartialKey('bcd151073c03b352e1ef2fd66c32209da9ca0afa', 4, 10)).toBe('NTEwNzNjMDNiMw==');
  expect(toPartialKey('bcd151073c03b352e1ef2fd66c32209da9ca0afa', 12, 16)).toBe('YjM1MmUxZWYyZmQ2NmMzMg==');
});
