export const ERC20 = {
  80001: [
    {
      name: 'weth',
      address: '0x0f6CBCdEb4d46dF83b677F88E78f96548b9CB525',
      decimals: 18,
    },
    {
      name: 'usdc',
      address: '0x81724514154C957319B857c8CEF90D7629533684',
      decimals: 18,
    },
    {
      name: 'wbtc',
      address: '0xEdfA38bf6A3ffeaD4937Cf288b369729D0aCF8B0',
      decimals: 8,
    },
  ],
};

export const ERC721 = {
  80001: [
    {
      name: 'YkNft',
      address: '0x6F3c3DAfa8B0Df132975DE677fc5AF278E48e223',
    },
  ],
};

export const ERC1155 = {
  80001: [
    {
      name: 'YkErc1155',
      address: '0xae23c82cd9946d9578B7732Ec9AC99BEB5157756',
    },
  ],
};

export const getERC20s = (chainId) => ERC20[chainId]
export const getERC721s = (chainId) => ERC721[chainId]
export const getERC1155s = (chainId) => ERC1155[chainId]

export const getERC20ByName = (chainId, name) => ERC20[chainId].find(token => token.name == name)
