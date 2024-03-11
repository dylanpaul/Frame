import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import NFT from '../../../constants/NFT.json';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { createWalletClient, http, createPublicClient } from 'viem';
import { EthrDIDMethod, KeyDIDMethod } from '@jpmorganchase/onyx-ssi-sdk';
require('dotenv').config();
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const PROVIDER_URL = process.env.PROVIDER_URL;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const ethrProvider = {
  name: 'sepolia',
  rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/yjDax07rgzbHDQvj-jK6HIfGIKJbviTY',
  registry: '0x03d5003bf0e79C5F5223588F347ebA39AfbC3818',
};
const didKey = new KeyDIDMethod();
const didEthr = new EthrDIDMethod(ethrProvider);
async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  if (message?.input) {
    text = message.input;
  }

  const nftOwnerAccount = privateKeyToAccount(WALLET_PRIVATE_KEY as `0x${string}`);
  const nftOwnerClient = createWalletClient({
    account: nftOwnerAccount,
    chain: sepolia,
    transport: http(PROVIDER_URL as string),
  });

  const publicClient = createPublicClient({
    chain: sepolia,
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

  //no discount
  if (!minted) {
    if (message?.button === 1) {
      //black
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Confirm Order!`,
            },
          ],
          image: {
            src: `${NEXT_PUBLIC_URL}/BlackNormal.jpeg`,
          },
          input: {
            text: 'Input Address JWT Presentation',
          },
          post_url: `${NEXT_PUBLIC_URL}/api/frame`,
        }),
      );
    } else if (message?.button === 2) {
      //orange
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Confirm Order!`,
            },
          ],
          image: {
            src: `${NEXT_PUBLIC_URL}/OrangeNormal.jpeg`,
          },
          input: {
            text: 'Input Address JWT Presentation',
          },
          post_url: `${NEXT_PUBLIC_URL}/api/frame`,
        }),
      );
    } else if (message?.button === 3) {
      //green
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Confirm Order!`,
            },
          ],
          image: {
            src: `${NEXT_PUBLIC_URL}/GreenNormal.jpeg`,
          },
          input: {
            text: 'Input Address JWT Presentation',
          },
          post_url: `${NEXT_PUBLIC_URL}/api/frame`,
        }),
      );
    } else {
      //blue
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Confirm Order!`,
            },
          ],
          image: {
            src: `${NEXT_PUBLIC_URL}/BlueNormal.jpeg`,
          },
          input: {
            text: 'Input Address JWT Presentation',
          },
          post_url: `${NEXT_PUBLIC_URL}/api/frame`,
        }),
      );
    }
  } else {
    if (message?.button === 1) {
      //black
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Confirm Order!`,
            },
          ],
          image: {
            src: `${NEXT_PUBLIC_URL}/BlackDiscount1.jpeg`,
          },
          input: {
            text: 'Input Address JWT Presentation',
          },
          post_url: `${NEXT_PUBLIC_URL}/api/frame`,
        }),
      );
    } else if (message?.button === 2) {
      //orange
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Confirm Order!`,
            },
          ],
          image: {
            src: `${NEXT_PUBLIC_URL}/OrangeDiscount.jpeg`,
          },
          input: {
            text: 'Input Address JWT Presentation',
          },
          post_url: `${NEXT_PUBLIC_URL}/api/frame`,
        }),
      );
    } else if (message?.button === 3) {
      //green
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Confirm Order!`,
            },
          ],
          image: {
            src: `${NEXT_PUBLIC_URL}/GreenDiscount.jpeg`,
          },
          input: {
            text: 'Input Address JWT Presentation',
          },
          post_url: `${NEXT_PUBLIC_URL}/api/frame`,
        }),
      );
    } else {
      //blue
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Confirm Order!`,
            },
          ],
          image: {
            src: `${NEXT_PUBLIC_URL}/BlueDiscount.jpeg`,
          },
          input: {
            text: 'Input Address JWT Presentation',
          },
          post_url: `${NEXT_PUBLIC_URL}/api/frame`,
        }),
      );
    }
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
