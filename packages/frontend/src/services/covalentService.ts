import axios from "axios";
import { ethers } from "ethers";

// sample token return
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

export const getTokenBalancesForAddress = async (chain_id: number, address: string) => {
    return await axios.get(
        `https://api.covalenthq.com/v1/${chain_id}/address/${address}/balances_v2/?&key=${process.env.NEXT_PUBLIC_COVALENT_API}`
    ).then(
        res => {
            const data = res.data.data
            // let nonZeroTokens = data.items.filter(token => token.quote > 0)
            // for now remove gas token from the list
            let erc20Tokens = data.items.filter(t => !t.native_token)
            let tokens: ITokenBalance[] = erc20Tokens.map(token => ({
                address: token.contract_address,
                symbol: token.contract_ticker_symbol,
                decimals: token.contract_decimals,
                logo: token.logo_url,
                amount: ethers.utils.formatUnits(token.balance, token.contract_decimals),
                amountUSD: token.quote,
                price: token.quote_rate,
            }))
            const totalUSD = tokens.reduce((partialSum: number, token: ITokenBalance) => partialSum += token.amountUSD, 0)

            const returnData = {
                totalUSD,
                tokens
            }
            console.log(returnData)
            return returnData
        }).catch(e => console.warn("Covalent service encouters error: ", e))
}

// sample NFT return
// {
//     "contract_decimals": 0,
//     "contract_name": "Perry Cooper",
//     "contract_ticker_symbol": "PERRYCOOPER",
//     "contract_address": "0x591fb4438a0fb02c689105b1d29aa172be6db049",
//     "supports_erc": [
//         "erc20",
//         "erc721"
//     ],
//     "logo_url": "https://logos.covalenthq.com/tokens/1/0x591fb4438a0fb02c689105b1d29aa172be6db049.png",
//     "last_transferred_at": "2020-06-26T00:00:42Z",
//     "native_token": false,
//     "type": "nft",
//     "balance": "1",
//     "balance_24h": null,
//     "quote_rate": 0,
//     "quote_rate_24h": null,
//     "quote": 0,
//     "quote_24h": null,
//     "nft_data": [
//         {
//             "token_id": "2100060058",
//             "token_balance": null,
//             "token_url": "https://api.niftygateway.com/perrycooper/2100060058",
//             "supports_erc": [
//                 "erc20",
//                 "erc721"
//             ],
//             "token_price_wei": null,
//             "token_quote_rate_eth": null,
//             "original_owner": "0xe052113bd7d7700d623414a0a4585bcae754e9d5",
//             "external_data": {
//                 "name": "Trouble Brewing #58/100",
//                 "description": "Trouble Brewing by Perry Cooper",
//                 "image": "https://res.cloudinary.com/nifty-gateway/video/upload/v1593022381/PerryCooper/niftygateway_teapot4_culkeh.png",
//                 "image_256": "https://image-proxy.svc.prod.covalenthq.com/cdn-cgi/image/width=256,fit/https://res.cloudinary.com/nifty-gateway/video/upload/v1593022381/PerryCooper/niftygateway_teapot4_culkeh.png",
//                 "image_512": "https://image-proxy.svc.prod.covalenthq.com/cdn-cgi/image/width=512,fit/https://res.cloudinary.com/nifty-gateway/video/upload/v1593022381/PerryCooper/niftygateway_teapot4_culkeh.png",
//                 "image_1024": "https://image-proxy.svc.prod.covalenthq.com/cdn-cgi/image/width=1024,fit/https://res.cloudinary.com/nifty-gateway/video/upload/v1593022381/PerryCooper/niftygateway_teapot4_culkeh.png",
//                 "animation_url": null,
//                 "external_url": "https://niftygateway.com/#/",
//                 "attributes": null,
//                 "owner": "0xfc43f5f9dd45258b3aff31bdbe6561d97e8b71de"
//             },
//             "owner": "0xfc43f5f9dd45258b3aff31bdbe6561d97e8b71de",
//             "owner_address": null,
//             "burned": null
//         }
//     ]
// }
export const getNFTForAddress = async (chain_id: number, address: string) => {
    return await axios.get(
        `https://api.covalenthq.com/v1/${chain_id}/address/${address}/balances_v2/?&nft=true&key=${process.env.NEXT_PUBLIC_COVALENT_API}`
    ).then(
        res => {
            const data = res.data.data
            let nfts = data.items.filter(token => token.type == 'nft')
            const returnData = nfts.map(nft => ({
                address: nft.contract_address,
                name: nft.contract_name,
                data: nft.nft_data.map(id => ({
                    id: id.token_id,
                    image: id.external_data?.image,
                    name: id.external_data?.name
                }))
            }))

            console.log(returnData)
            return returnData
        }).catch(e => console.warn("Covalent NFT service encouters error: ", e))
}
