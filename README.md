## The Stack

- Package-Manager: `pnpm`
- Monorepo Tooling: `turborepo`
- Smart Contract Development: `hardhat`
  - Deploy & Address-Export: `hardhat-deploy`
  - Typescript-Types: `typechain`
- Frontend: `next`
  - Contract Interactions: `wagmi`, `rainbowkit`
  - Styling: `chakra-ui`
  - Styled Components: `twin.macro`, `emotion`
- Misc:
  - Linting & Formatting: `eslint`, `prettier`
  - Actions on Git Hooks: `husky`, `lint-staged`

## Getting Started

```bash
# Install pnpm
npm i -g pnpm

# Install dependencies
pnpm install

# Copy & fill environments
# This step is important when connecting frontend to deployment
cp packages/frontend/.env.local.example packages/frontend/.env.local
cp packages/contracts/.env.example packages/contracts/.env
```

## Development

```bash
# Generate contract-types, start local hardhat node, and start frontend with turborepo
pnpm contracts:dev


# Only start frontend
pnpm frontend:dev
```


# Technical Specifications
## Deployment
- Our contracts and on Polygon

## Login 
- All logins are done using sign in with Sign in with Ethereum by Spruce
- User will need to sign a message that proves that the user is the owner of the address

## Name + Avatar
- By default, user's name is set to the user's ENS name or Unstoppable Domain name
- User's avatar is also retrieve's from either ENS or Unstoppable Domain
- We are able to create a nickname to our contacts and we store this info in a Tableland DB instance that is specific to the user

## Chat & Image / File sending
- The underlying messaging protocol is XMTP
- For sending of images or files, the document will be first uploaded to IPFS
- The messaging of a certain format will be passed through XMTP so the receiver end will know to render the message as either an image or a file

## Send Tokens and Stream Funds + Notification
- User is able to send tokens (for now, ERC20 or ERC721) to peers via De-chat
- We utilize CovalentHq, to help us determine the token available to send in the users wallet
- We are able to stream funds to recipient at a rate (i.e if we want to pay for an installment) and this is powered by Superfluid
- After sending, the transaction will get picked up by our custom subgraph indexer by TheGraph and it will get included in the message
- Also, the recipient will get a notification by EPNS alerting the recipient of an incoming transfer


## Video Streaming
- We are able to perform video calls with the person that we are chatting with
- And this is powered by LivePeer and XMTP
- Using XMTP as an underlying messaging relayer, we are able to pass the playback id between each other
- User A will initiate a stream and pass playback ID A to User B
- User B will receive the playback ID A , create a stream of his own, join the playback ID A, and pass his own playback ID B back to User A.
- User A, once received playback ID B, is able to join the stream created by User B.
- Each user will be initiating a stream while also watching a stream

## Paid membership perks
- Dechat also has paid membership features and this is powered by Unlock protocol
- For now, paid members are able to access to a customized theme only for paid members.
- More to be added in the future.
