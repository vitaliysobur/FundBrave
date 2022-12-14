import Web3Modal from "web3modal";
import { useContext } from "react";
import { ethers, providers } from "ethers";
import cc from "cryptocompare";
import { FundraiserFactoryAddress } from "@/config";
import { AuthContext } from "@/context/AuthContext";
import {
  FundraiserFactory__factory,
  Fundraiser__factory,
} from "@/types/ethers-contracts";
import { handleNewBeneficiary } from "@/services/notifications";
import {
  FundraiserItem,
  MyDonations,
  FundraiserDetailsItem,
  Address,
} from "@/types";

export const fetchContract = (
  signerOrProvider: ethers.Signer | ethers.providers.Provider
) =>
  FundraiserFactory__factory.connect(
    FundraiserFactoryAddress,
    signerOrProvider
  );

export const fetchFundraiserContract = (
  fundraiserAddress: string,
  signerOrProvider: ethers.Signer | ethers.providers.Provider
) => Fundraiser__factory.connect(fundraiserAddress, signerOrProvider);

export const fetchFundraisers = async (
  limit = 10,
  offset = 0
): Promise<FundraiserItem[]> => {
  const provider = new providers.JsonRpcProvider(
    "https://alfajores-forno.celo-testnet.org"
  );

  const contract = fetchContract(provider);

  const data = await contract.fundraisers(limit, offset);

  const exchangeRate = await getExchangeRate();

  const items = await Promise.all(
    data.map(async (item) => {
      const instance = Fundraiser__factory.connect(item, provider);
      // TODO: Collect all data asynchronously
      const name = await instance.name();
      const description = await instance.description();
      const totalDonations = await instance.totalDonations();
      const imageURL = await instance.imageURL();
      const website = await instance.url();
      const amountInCELO = ethers.utils.formatEther(totalDonations.toString());

      // @ts-ignore TODO: fix typescript error
      const dollarDonationAmount = amountInCELO * exchangeRate;

      return {
        name,
        description,
        dollarDonationAmount,
        website,
        imageURL,
        address: item,
      };
    })
  );

  return items;
};

export const fetchFundraisersDetails = async (
  limit: number,
  offset: number,
  currentAccount: Address
): Promise<FundraiserDetailsItem[]> => {
  const provider = new providers.JsonRpcProvider(
    "https://alfajores-forno.celo-testnet.org"
  );

  const contract = fetchContract(provider);

  const data = await contract.fundraisers(limit, offset);

  const exchangeRate = await getExchangeRate();

  const items = await Promise.all(
    data.map(async (item) => {
      const instance = Fundraiser__factory.connect(item, provider);
      // TODO: Collect all data asynchronously
      const name = await instance.name();
      const totalDonations = await instance.totalDonations();
      const amountInCELO = ethers.utils.formatEther(totalDonations.toString());
      const userDonation = await instance.myDonations({
        from: currentAccount,
      });

      const normalizedDonations = await renderDonationsList(userDonation);
      // @ts-ignore TODO: fix typescript error
      const dollarDonationAmount = amountInCELO * exchangeRate;

      return {
        name,
        dollarDonationAmount,
        address: item,
        userDonations: normalizedDonations,
      };
    })
  );

  return items;
};

export const getProvider = async () => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);

  const signer = provider.getSigner();

  return signer;
};

export const getExchangeRate = async () => {
  const exchangeRate = await cc.price("CELO", ["USD"]);
  return exchangeRate["USD"];
};

export const renderDonationsList = async (donations: MyDonations) => {
  try {
    const exchangeRate = await getExchangeRate();

    if (donations === null) {
      return null;
    }

    const totalDonations = donations.length;

    const donationList = [];

    for (let i = 0; i < totalDonations; i++) {
      const donation = donations[i].toString();

      if (!donation) {
        continue;
      }

      const ethAmount = ethers.utils.formatEther(donation);
      const userDonation = exchangeRate * ethAmount;

      let donationDate;
      if (donations.dates[i] === undefined) {
        donationDate = "no date found";
      } else {
        donationDate = donations.dates[i].toString();
      }

      donationList.push({
        donationAmount: userDonation.toFixed(2),
        date: donationDate,
      });
    }

    return donationList;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const setBeneficiary = async (
  beneficiary: string,
  address: string,
  currentAccount: string
) => {
  if (!currentAccount) {
    return;
  }

  const signer = await getProvider();

  const instance = fetchFundraiserContract(address, signer);
  await instance.setBeneficiary(beneficiary, { from: currentAccount });

  handleNewBeneficiary();
};
