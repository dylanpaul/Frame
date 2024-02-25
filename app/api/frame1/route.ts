import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import NFT from '../../../constants/NFT.json';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
// import { MetaMaskInpageProvider } from "@metamask/providers";
import { createWalletClient, http, createPublicClient } from 'viem';
import {verifyCredentialJWT} from '@jpmorganchase/onyx-ssi-sdk'
require('dotenv').config();
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const PROVIDER_URL = process.env.PROVIDER_URL;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;


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

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Confirm Order!`,
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/GoldStar.jpeg`,
      },
      input: {
        text: 'Input Address Verifiable Presentation',
      },
      post_url: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
