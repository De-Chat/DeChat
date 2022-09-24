import * as EpnsAPI from '@epnsproject/sdk-restapi';
import { env } from '@helpers/environment';
import { ethers } from 'ethers';
import { chainId } from 'wagmi';

// create a type for notifications
export interface Notification {
  recipientAddrs?: string[];
  title: string;
  body: string;
  cta: string;
  imgLink: string;
}

// constants for functions
const epnsPKey1 = `0x${env.EPNS_API_PKEY_1}`;
const polygonChainId = chainId.polygonMumbai;
const channelSigner = new ethers.Wallet(epnsPKey1);
const epnsChannel1 = env.EPNS_CHANNEL_1; // account #1

export const sendEpnsNotification = async (notif: Notification) => {
  const date = new Date().toISOString().split(':');
  date.pop();
  const utcDateTime = date.join(':');
  // apiResponse?.status === 204, if sent successfully!
  const apiResponse = await EpnsAPI.payloads.sendNotification({
    signer: channelSigner,
    type: 4, //1 - for broadcast, 3 - for direct message, 4 - for multi-targetted.
    identityType: 2, // direct payload
    notification: {
      title: notif.title,
      body: `Timestamp:${utcDateTime}\n` + notif.body,
    },
    payload: {
      title: notif.title,
      body: `Timestamp:${utcDateTime}\n` + notif.body,
      cta: notif.cta,
      img: notif.imgLink,
    },
    recipients: notif.recipientAddrs, // recipient address
    channel: 'eip155:' + polygonChainId + ':' + epnsChannel1, // your channel address
    env: 'staging',
  });
  return apiResponse;
};

// get channel data
export const getEpnsChannelData = async () => {
  const apiResponse = await EpnsAPI.channels.getChannel({
    channel: 'eip155:' + polygonChainId + ':' + epnsChannel1, // channel address in CAIP
    env: 'staging',
  });
  return apiResponse;
};

// get user subscriptions
export const getEpnsUserSubscriptions = async (userAddress: string) => {
  const apiResponse = await EpnsAPI.user.getSubscriptions({
    user: 'eip155:' + polygonChainId + ':' + userAddress, // user address in CAIP
    env: 'staging',
  });
  return apiResponse;
};

// create function to get values of objects
export const getValues = (obj: any) => {
  return Object.keys(obj).map((key) => obj[key]);
};

// loop array
export const extractChannelAddress = (arr: any) => {
  let resultSet = new Set();
  for (let i = 0; i < arr.length; i++) {
    resultSet.add(arr[i].channel);
  }
  return Array.from(resultSet);
};

// check if user is subscribed to dechat channel
export const isUserSubscribed = async (userAddress: string) => {
  const apiResponse = await EpnsAPI.user.getSubscriptions({
    user: 'eip155:' + polygonChainId + ':' + userAddress, // user address in CAIP
    env: 'staging',
  });
  // get channels and store in set
  const channelArr = extractChannelAddress(apiResponse);
  console.log(`channelArr:${channelArr}`);
  if (channelArr.includes(epnsChannel1)) {
    console.log('epns: User is subscribed to channel');
    return true;
  }
  console.log('epns: User is not subscribed to channel');
  return false;
};

// opt-in to channel
export const optInToChannel = async (_signer: any, userAddress: string) => {
  const apiResponse = await EpnsAPI.channels.subscribe({
    signer: _signer,
    userAddress: 'eip155:' + polygonChainId + ':' + userAddress, // user address in CAIP
    channelAddress: 'eip155:' + polygonChainId + ':' + epnsChannel1, // channel address in CAIP
    onSuccess: () => {
      console.log('epns: opt in success');
    },
    onError: () => {
      console.error('epns: opt in error');
    },
    env: 'staging',
  });
  console.log(`epns: opt in response: ${JSON.stringify(apiResponse)}`);
  return apiResponse;
};
// opt-out
export const optOutToChannel = async (_signer: any, userAddress: string) => {
  const apiResponse = await EpnsAPI.channels.unsubscribe({
    signer: _signer,
    userAddress: 'eip155:' + polygonChainId + ':' + userAddress, // user address in CAIP
    channelAddress: 'eip155:' + polygonChainId + ':' + epnsChannel1, // channel address in CAIP
    onSuccess: () => {
      console.log('epns: opt out success');
    },
    onError: () => {
      console.error('epns: opt out error');
    },
    env: 'staging',
  });
  console.log(`epns: opt out response: ${JSON.stringify(apiResponse)}`);
  return apiResponse;
};
