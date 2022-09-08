# FundKyiv

FundKyiv is a decentralised fundraiser application built specifically for organisations in Ukraine, where users can create a fundraising campaign, Donate to a fundraiser with CELO token and print the receipt of their donations. FundKyiv also has other additional features that allow users to send CELO to anyone across the world, view the amount of CELO they have in their wallet, and view their last five transaction counts.

# 🛠 Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (NextJs & Unit Testing)
- Ethers JS (Blockchain Interaction)
- Truffle (Smart Contract Development Framework)

# ⛓ Blockchain Protocol used

- ERC-720 standard

# ⚙ Requirements For Initial Setup
- Install NodeJS, should work with any node version below 16.5.0
- Install Truffle in your terminal. You can check to see if you have truffle by running truffle --version. To install truffle `npm install -g truffle`. Ideal to have truffle version 5.3.0 to avoid dependency issues.

# 🚀 Quick Start

📄 Clone or fork FundKyiv:

```
https://github.com/paschal533/FundKyiv.git
```
💿 Install all dependencies:
 
```
$ cd FundKyiv
$ cd frontend
$ npm install 
```

# 🎗 Add enviroment varibles

Rename the file `env.local.example` to `env.local`

Add all the required enviroment varibles in the file

```
NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID =
NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET =

```

# 🚴‍♂️ Run your App:

```
npm run dev
```

- Note :- This app was deploy to Conflux eSpace testnet, so you need to connect your Metamask wallet to Conflux eSpace testnet before you can Interact with the app.

# 📄 interacting with the Smart-contract

```
$ cd FundKyiv
$ cd smart-contract
$ npm install
```

# 🛠 Test the Smart-contract:

```
truffle test
```

# 🎗 Compile the Smart-contract:

```
truffle compile
```

# 🔗 Deploy the Smart-contract:

To do this, you need to provide your CELO Alfajores Matamask private key.
Add your CELO Alfajores Matamask private key to the "private key" varible provided for you in the `truffle-config.js` file.

Then run

```
truffle deploy --network alfajores
```

Alternatively, you can deploy the Smart-contract to your local machine by running:

```
truffle deploy --network develop
```
# 📄 Smart-contract address

0x255D2839bc54710de6aACB01c711420132d17616

# 📜 CELO Testnet Explorer smart-contract address

https://alfajores-blockscout.celo-testnet.org/address/0x255D2839bc54710de6aACB01c711420132d17616/transactions
