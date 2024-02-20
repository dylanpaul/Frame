import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import NFT from '../../../constants/NFT.json';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { MetaMaskInpageProvider } from "@metamask/providers";
import { createWalletClient, http, createPublicClient } from 'viem';
require('dotenv').config();
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const PROVIDER_URL = process.env.PROVIDER_URL;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const ITEM_PRICE_IN_WEI = 10 * 1e18; // Assuming the price is $10

declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}

async function checkMetaMaskConnection(targetAccount: string): Promise<boolean> {
  if (window.ethereum && window.ethereum.isMetaMask) {
    try {
      // Requesting accounts to check if the user is connected
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (Array.isArray(accounts)  && accounts.length > 0) {
        // Check if the connected account matches the target account
        return accounts[0].toLowerCase() === targetAccount.toLowerCase();
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      return false;
    }
  } else {
    console.log('MetaMask not installed');
    return false;
  }
}

async function makePaymentRequest(buyerAddress: string, sellerAddress: string, itemPriceInWei: number) {
  try {
    // Start wallet payment process
    const response = await window.ethereum!.request({
      method: 'eth_sendTransaction',
      params: [{ from: buyerAddress, to: sellerAddress, value: itemPriceInWei }],
    });
    console.log(response);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}


async function getResponse(req: NextRequest): Promise<NextResponse> {

  let accountAddress: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  // Check if MetaMask is connected
  const isConnected = await checkMetaMaskConnection(accountAddress);

  if (!isConnected) {
    // Prompt the user to connect MetaMask
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `Connect to specified custody address: Buy again!`,
          },
        ],
        image: {
          src: `${NEXT_PUBLIC_URL}/GoldStar.jpeg`,
        },
        post_url: `${NEXT_PUBLIC_URL}/api/frame`,
      }),
    );
  }

  // console.log(accountAddress) address is custody address connected to Farcaster

  const nftOwnerAccount = privateKeyToAccount(WALLET_PRIVATE_KEY as `0x${string}`);
  const nftOwnerClient = createWalletClient({
    account: nftOwnerAccount,
    chain: baseSepolia,
    transport: http(PROVIDER_URL as string),
  });

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(PROVIDER_URL as string),
  });

  let minted = false;

  try {
    minted = !!(await publicClient.readContract({
      address: NFT_CONTRACT_ADDRESS as `0x${string}`,
      abi: NFT.abi,
      functionName: 'minted',
      args: [accountAddress],
    }));
  } catch (err) {
    console.error(err);
    minted = false;
  }

  if (minted) {
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: 'You already minted, thanks!',
          },
        ],
        image: {
          src: `${NEXT_PUBLIC_URL}/GoldStar.jpeg`,
        },
      }),
    );
  } else {
    // Prompt for payment before minting
    const paymentSuccessful = await makePaymentRequest(accountAddress, '0x861Aea40c9AcC62435cEa31b2078FF3e022D6627', ITEM_PRICE_IN_WEI);

    if (paymentSuccessful) {
    // Try to mint and airdrop the NFT after successful payment
      try {
        const { request } = await publicClient.simulateContract({
          account: nftOwnerAccount,
          address: NFT_CONTRACT_ADDRESS as `0x${string}`,
          abi: NFT.abi,
          functionName: 'mintFor',
          args: [accountAddress],
        });
        await nftOwnerClient.writeContract(request);
        minted = true;
      } catch (err) {
        console.error(err);
        minted = false;
      }
      if (minted) {
        return new NextResponse(
          getFrameHtmlResponse({
            buttons: [
              {
                label: 'Thanks for minting!',
              },
            ],
            image: {
              src: `${NEXT_PUBLIC_URL}/GoldStar.jpeg`,
            },
          }),
        );
      }
    }
  }
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Payment Failed: Try again!`,
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/GoldStar.jpeg`,
      },
      post_url: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
