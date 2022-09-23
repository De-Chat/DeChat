import axios from 'axios';

// {
//     "contract_decimals": 18,
//     "contract_name": "Dank Token",
//     "contract_ticker_symbol": "DANK",
//     "contract_address": "0x0cb8d0b37c7487b11d57f1f33defa2b1d3cfccfe",
//     "supports_erc": [
//         "erc20"
//     ],
//     "logo_url": "https://logos.covalenthq.com/tokens/1/0x0cb8d0b37c7487b11d57f1f33defa2b1d3cfccfe.png",
//     "last_transferred_at": "2020-12-13T18:55:35Z",
//     "native_token": false,
//     "type": "cryptocurrency",
//     "balance": "2000000000000000000000",
//     "balance_24h": "2000000000000000000000",
//     "quote_rate": 0.00069685833,
//     "quote_rate_24h": null,
//     "quote": 1.3937167,
//     "quote_24h": null,
//     "nft_data": null
// }

export type ITokenBalance = {
  address: string;
  symbol: string;
  decimals: number;
  logo: string;
  amount: number;
  amountUSD: number;
  price: number;
};

export type IBalances = {
  totalUSD: number;
  tokens: ITokenBalance[];
};

export const getTokenBalancesForAddress = async (
  chain_id: number,
  address: string
) => {
  return await axios
    .get(
      `https://api.covalenthq.com/v1/${chain_id}/address/${address}/balances_v2/?&key=${process.env.NEXT_PUBLIC_COVALENT_API}`
    )
    .then((res) => {
      const data = res.data.data;
      let nonZeroTokens = data.items.filter((token) => token.quote > 0);
      let tokens: ITokenBalance[] = nonZeroTokens.map((token) => ({
        address: token.contract_address,
        symbol: token.contract_ticker_symbol,
        decimals: token.contract_decimals,
        logo: token.logo_url,
        amount: token.balance,
        amountUSD: token.quote,
        price: token.quote_rate,
      }));
      const totalUSD = tokens.reduce(
        (partialSum: number, token: ITokenBalance) =>
          (partialSum += token.amountUSD),
        0
      );

      const returnData = {
        totalUSD,
        tokens,
      };
      console.log(returnData);
      return returnData;
    })
    .catch((e) => console.warn('Covalent service encouters error: ', e));
};
