import {
    Framework,
    Operation,
    WrapperSuperToken,
  } from "@superfluid-finance/sdk-core";
  import { BigNumber, ethers, Signer } from "ethers";
  
  declare type SupportedProvider = ethers.providers.Provider;
  
  // https://docs.superfluid.finance/superfluid/developers/networks
  
  export const getSuperFluidFramework = async (
    provider: SupportedProvider
  ): Promise<Framework> => {
    const chainId = (await provider.getNetwork()).chainId;
  
    return await Framework.create({
      chainId: chainId,
      provider: provider,
    });
  };
  
  export const getWrappedSuperToken = async (
    framework: Framework,
    tokenAddress: string
  ) => {
    return await framework.loadWrapperSuperToken(tokenAddress);
  };
  
  export class SuperfluidToken {
    constructor(
      private readonly framework: Framework,
      private readonly signer: Signer,
      private readonly token: WrapperSuperToken
    ) {}
  
    approveOp(receiver: string, amount: BigNumber): Operation {
      const approve = this.token.approve({
        receiver: receiver,
        amount: amount.toString(),
      });
      return approve;
    }
  
    transferOp(receiver: string, amount: BigNumber): Operation {
      return this.token.transfer({ receiver, amount: amount.toString() });
    }
  
    async transferFromOp(
      sender: string,
      receiver: string,
      amount: BigNumber
    ): Promise<Operation> {
      return this.token.transferFrom({
        sender,
        receiver,
        amount: amount.toString(),
      });
    }
  
    downgradeOp(amount: BigNumber): Operation {
      return this.token.downgrade({ amount: amount.toString() });
    }
  
    upgradeOp(amount: BigNumber): Operation {
      return this.token.upgrade({ amount: amount.toString() });
    }
  
    async execBatchCall(
      operations: Operation[]
    ): Promise<ethers.ContractReceipt> {
      const batches = this.framework.batchCall(operations);
      const txn = await batches.exec(this.signer);
      return await txn.wait();
    }
  
    async balanceOf(owner: string): Promise<string> {
      return await this.token.balanceOf({
        account: owner,
        providerOrSigner: this.signer,
      });
    }
  
    async realTimeBalance(account: string, timestamp: number) {
      return await this.token.realtimeBalanceOf({
        providerOrSigner: this.signer,
        account,
        timestamp,
      });
    }
  
    // cfa operations
    createFlow(
      sender: string,
      receiver: string,
      flowRate: string,
      userData?: string
    ): Operation {
      const op = this.framework.cfaV1.createFlow({
        sender,
        receiver,
        superToken: this.token.address,
        flowRate,
        userData,
      });
  
      return op;
    }
  
    updateFlow(
      sender: string,
      receiver: string,
      flowRate: string,
      userData?: string
    ): Operation {
      const op = this.framework.cfaV1.updateFlow({
        sender,
        receiver,
        superToken: this.token.address,
        flowRate,
        userData,
      });
  
      return op;
    }
  
    deleteFlow(
      sender: string,
      receiver: string,
      flowRate: string,
      userData?: string
    ): Operation {
      const op = this.framework.cfaV1.deleteFlow({
        sender,
        receiver,
        superToken: this.token.address,
        flowRate,
        userData,
      });
  
      return op;
    }
  
    async getFlow(sender: string, receiver: string) {
      return await this.framework.cfaV1.getFlow({
        superToken: this.token.address,
        sender,
        receiver,
        providerOrSigner: this.signer,
      });
    }
  
    async getAccountFlowInfo(account: string) {
      return await this.framework.cfaV1.getAccountFlowInfo({
        superToken: this.token.address,
        account,
        providerOrSigner: this.signer,
      });
    }
  
    async getNetFlow(account: string) {
      return await this.framework.cfaV1.getNetFlow({
        superToken: this.token.address,
        account,
        providerOrSigner: this.signer,
      });
    }
  }
  