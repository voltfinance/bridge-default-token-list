const mainnet = require('./tokens/mainnet.json');
const { request, gql } = require('graphql-request');
const { toChecksumAddress } = require('web3-utils');

async function fetchBridgedTokens(foreignAddresses) {
  const query = gql`{
    bridgedTokens (where:{foreignAddress_in: ${JSON.stringify(foreignAddresses)}}) {
      address
      name
      decimals
      symbol
      foreignAddress
    }
  }`
  const response = await request('https://graph.fuse.io/subgraphs/name/fuseio/fuse-ethereum-bridge', query)
  return response.bridgedTokens
}

const multiBridgeTokens = ['0xa722c13135930332eb3d749b2f0906559d2c5b99', '0x6a5f6a8121592becd6747a38d67451b310f7f156']

async function buildList() {
  const foreignAddresses = mainnet.map(token => token.address);
  const fuseTokens = await fetchBridgedTokens(foreignAddresses);

  const bridgedFuseTokens = mainnet.map(mainnetToken => {
    const fuseToken = fuseTokens.find(token => token.foreignAddress == mainnetToken.address.toLowerCase());
    const multiBridge = multiBridgeTokens.includes(fuseToken?.address) ? { isMultiBridge : true } : {}
    
    if (fuseToken && fuseToken.address !== '0x714005da6a90f59dd2cf74560ecf4a4bed5f088a' && fuseToken.address !== '0x6cc56d06b358af0e8b47f229765da6dd81ee1939') {
      delete fuseToken.foreignAddress
      return {...mainnetToken, ...fuseToken, ...multiBridge, address: toChecksumAddress(fuseToken.address), chainId: 122 };
    }
  })
  .filter(t => t != null);

  return bridgedFuseTokens;
}


module.exports = buildList