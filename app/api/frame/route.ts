import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import NFT from '../../../constants/NFT.json';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
// import { MetaMaskInpageProvider } from "@metamask/providers";
import { createWalletClient, http, createPublicClient } from 'viem';
import {
  EthrDIDMethod,
  JWTService,
  KeyDIDMethod,
  getCredentialsFromVP,
  getSupportedResolvers,
  verifyDIDs,
  verifyPresentationJWT,
} from '@jpmorganchase/onyx-ssi-sdk';
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
  const didResolver = getSupportedResolvers([didKey, didEthr]);

  const isVpJwtValid = await verifyPresentationJWT(text, didResolver);

  if (isVpJwtValid) {
    const vcJwt = getCredentialsFromVP(text)[0];
    try {
      console.log('\nVerifying VC\n');
      const vcVerified = await verifyDIDs(vcJwt, didResolver);
      console.log(`\nVerification status: ${vcVerified}\n`);
    } catch (error) {
      console.log(error);
    }
  } else {
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `Invalid JWT: Confirm Order!`,
          },
        ],
        image: {
          src: `${NEXT_PUBLIC_URL}/GoldStar.jpeg`,
        },
        input: {
          text: 'Input Address JWT Presentation',
        },
        post_url: `${NEXT_PUBLIC_URL}/api/frame`,
      }),
    );
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
    // const paymentSuccessful = await makePaymentRequest(accountAddress, '0x861Aea40c9AcC62435cEa31b2078FF3e022D6627', ITEM_PRICE_IN_WEI);

    // if (paymentSuccessful) {
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
  // }
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Mint NFT!`,
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
