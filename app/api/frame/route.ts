import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import NFT from '../../../constants/NFT.json';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { createWalletClient, http, createPublicClient } from 'viem';
require('dotenv').config();
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const PROVIDER_URL = process.env.PROVIDER_URL;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

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
    // Try to mint and airdrop the NFT
    try {
      const { request } = await publicClient.simulateContract({
        account: nftOwnerAccount,
        address: NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT.abi,
        functionName: 'mintFor',
        args: [accountAddress],
      });
      await nftOwnerClient.writeContract(request);
    } catch (err) {
      console.error(err);
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
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Minting Failed`,
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
