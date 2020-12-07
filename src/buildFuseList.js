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

async function buildList() {
  const foreignAddresses = mainnet.map(token => token.address);
  const fuseTokens = await fetchBridgedTokens(foreignAddresses);
  const bridgedFuseTokens = mainnet.map(mainnetToken => {
    const fuseToken = fuseTokens.find(token => token.foreignAddress == mainnetToken.address.toLowerCase());
    if (fuseToken && fuseToken.address !== '0x714005da6a90f59dd2cf74560ecf4a4bed5f088a') {
      delete fuseToken.foreignAddress
      return {...mainnetToken, ...fuseToken, address: toChecksumAddress(fuseToken.address), chainId: 122 };
    }
  }).filter(t => t != null);
  return bridgedFuseTokens;
}


module.exports = buildList