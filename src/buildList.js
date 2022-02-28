const { version } = require('../package.json');
const mainnet = require('./tokens/mainnet.json');
const ropsten = require('./tokens/ropsten.json');
const fuse = require('./tokens/fuse.json');
const binance = require('./tokens/binance.json');

module.exports = async function buildList() {
  const parsed = version.split('.');
  return {
    'name': 'Voltage Bridge List',
    'timestamp': (new Date().toISOString()),
    'version': {
      'major': +parsed[ 0 ],
      'minor': +parsed[ 1 ],
      'patch': +parsed[ 2 ]
    },
    'tags': {},
    'logoURI': 'ipfs://QmQQGd3Kbb8fhxKQLvzPPngzBGd5aydV3QAigLHy53Hr3g',
    'keywords': [
      'voltage',
      'fuse',
      'default'
    ],
    tokens: [
      ...mainnet,
      ...binance,
      ...ropsten,
      ...fuse
    ]
      // sort them by symbol for easy readability
      .sort((t1, t2) => {
        if (t1.chainId === t2.chainId) {
          return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1;
        }
        return t1.chainId < t2.chainId ? -1 : 1;
      })
  };
};
