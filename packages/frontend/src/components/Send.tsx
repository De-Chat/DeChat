import { useDeployments } from "@shared/useDeployments"
import { useAccount, useSigner } from "wagmi"
import { Send__factory } from '@dechat/contracts/typechain-types'
import useXmtp from "src/hooks/useXmtp"
import { useMemo } from "react"
import { ethers } from "ethers"

const Send = () => {
    // const { data: signer } = useSigner();
    // console.log("test current addr: ", signer?.getAddress());
    const { contracts } = useDeployments();
    const { wallet: signer, walletAddress: address } = useXmtp();
    console.log("test current addr: ", address, signer)

    // const getOwner = async () => {
    //     if (!signer || !contracts) return
    //     const contract = Send__factory.connect(contracts.Send.address, signer)
    //     try {
    //         const owner = await contract.owner()
    //         console.log({ owner })
    //     } catch (e) {
    //         console.error(e)
    //     }
    // }
    const contract = useMemo(() => {
        if (!signer || !contracts) return null
        return Send__factory.connect(contracts.Send.address, signer)
    }, [signer, contracts])

    const sendEth = async (address: string, amount: string) => {
        if (!contract) {
            console.warn("Contract not constructed!")
            return
        }
        try {
            let tsx;
            tsx = await contract.sendEth(address, { value: ethers.utils.parseEther(amount) });
            const receipt = await tsx.wait()
            console.log({ receipt })
        } catch (e: any) {
            console.error(e)
        }
    }

    const sendERC20 = async (tokenAddr: string, recipient: string, amount: string, decimals: number) => {
        if (!contract) {
            console.warn("Contract not constructed!")
            return
        }
        try {
            const formattedAmount = ethers.utils.parseUnits(amount, decimals);
            let tsx = await contract.sendErc20(tokenAddr, recipient, formattedAmount);
            const receipt = await tsx.wait()
            console.log({ receipt })
        } catch (e: any) {
            console.error(e)
        }
    }

    const sendERC721 = async (tokenAddr: string, recipient: string, id: number) => {
        if (!contract) {
            console.warn("Contract not constructed!")
            return
        }
        try {
            let tsx = await contract.sendErc721(tokenAddr, recipient, id);
            const receipt = await tsx.wait()
            console.log({ receipt })
        } catch (e: any) {
            console.error(e)
        }
    }

    const sendERC1155 = async (tokenAddr: string, recipient: string, tokenId: number, amount: number) => {
        if (!contract) {
            console.warn("Contract not constructed!")
            return
        }
        try {
            let tsx = await contract.sendErc1155(tokenAddr, recipient, tokenId, amount, []);
            const receipt = await tsx.wait()
            console.log({ receipt })
        } catch (e: any) {
            console.error(e)
        }
    }
    

    return (
        <div>
            <button onClick={() => sendEth(address, "0.00001")}>sendEth</button>
            {/* <button onClick={send("sendERC20", address)}>sendEth</button>
            <button onClick={send("sendERC721", address)}>sendEth</button>
            <button onClick={send("sendERC1155", address)}>sendEth</button> */}
        </div>
    )
}

export default Send;