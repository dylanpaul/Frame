import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import NFT from '../../../constants/NFT.json';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
// import { MetaMaskInpageProvider } from "@metamask/providers";
import { createWalletClient, http, createPublicClient } from 'viem';
import { decodeJWT } from 'did-jwt';
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
const gm = require('gm');

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  //let vp: string = '';
  let isVpJwtValid = false;
  let name: string = '';
  let address: string = '';
  let city: string = '';
  let state: string = '';
  let country: string = '';
  let zip: string = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  // if (message?.input) {
  //   vp = message.input;
  // }
  const didResolver = getSupportedResolvers([didKey, didEthr]);

  const vp =
    'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2cCI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVQcmVzZW50YXRpb24iXSwidmVyaWZpYWJsZUNyZWRlbnRpYWwiOlsiZXlKaGJHY2lPaUpGVXpJMU5rc2lMQ0owZVhBaU9pSktWMVFpZlEuZXlKbGVIQWlPakUzTkRBMU1UTXlOamtzSW5aaklqcDdJa0JqYjI1MFpYaDBJanBiSW1oMGRIQnpPaTh2ZDNkM0xuY3pMbTl5Wnk4eU1ERTRMMk55WldSbGJuUnBZV3h6TDNZeElsMHNJblI1Y0dVaU9sc2lWbVZ5YVdacFlXSnNaVU55WldSbGJuUnBZV3dpTENKUVVrOVBSbDlQUmw5QlJFUlNSVk5USWwwc0ltTnlaV1JsYm5ScFlXeFRkV0pxWldOMElqcDdJbTVoYldVaU9pSkVlV3hoYmlCUVlYVnNJaXdpWVdSa2NtVnpjeUk2SWpFeU16UWdUVzlqYTJsdVoySnBjbVFnVEdGdVpTSXNJbU5wZEhraU9pSkJibmwwYjNkdUlpd2ljM1JoZEdVaU9pSkJibmx6ZEdGMFpTSXNJbU52ZFc1MGNua2lPaUpWVXlJc0lucHBjQ0k2SWpBeE1qTTBJbjE5TENKemRXSWlPaUprYVdRNlpYUm9janB6WlhCdmJHbGhPakI0T0RZeFFXVmhOREJqT1VGalF6WXlORE0xWTBWaE16RmlNakEzT0VaR00yVXdNakpFTmpZeU55SXNJbXAwYVNJNkltUnBaRHBsZEdoeU9uTmxjRzlzYVdFNk1IaEdZMFZDT1RrM00yWXpPVFkxWXpWaFpUbGxOakEyWlRZMFl6ZzBaRFJpTmpjek9FVXhaV1F6SWl3aWJtSm1Jam94TnpBNE9Ea3dPRFk1TENKcGMzTWlPaUprYVdRNlpYUm9janB6WlhCdmJHbGhPakI0UlVVd05rSkdPVFl6WWpJMk5ESTFOa1UwTkVZNU1ESmhNakF3T1RVeFltRkdOelEyWVRWRU55SjkuNWVYWU5wS0VXMDRWWWN0SFRxVlZnSzNORFNKN0ZacjlHcTFjV1pQNlpwS0RTNEZzWkxkUXpVWDRaUHh5UF90VFJQRjUySmd2QWFCNWJqOHVka25vU2ciXX0sImlzcyI6ImRpZDpldGhyOnNlcG9saWE6MHg4NjFBZWE0MGM5QWNDNjI0MzVjRWEzMWIyMDc4RkYzZTAyMkQ2NjI3In0.bj29mlM8RO_Pjsx-q3PjGYhcclN0yOThbpRRpKeUVE0E5qn1V47U8s0KgxrkcE2QQH1iX0HxqG01waliCMhFSg';
  try {
    isVpJwtValid = await verifyPresentationJWT(vp, didResolver);
  } catch (error) {
    console.log(error);
  }
  if (isVpJwtValid) {
    const vcJwt = getCredentialsFromVP(vp)[0];
    try {
      console.log('\nVerifying VC\n');
      const vcVerified = await verifyDIDs(vcJwt, didResolver);
      console.log(`\nVerification status: ${vcVerified}\n`);
      if (typeof vcJwt === 'string') {
        const credential = decodeJWT(vcJwt).payload;
        name = credential.vc.credentialSubject.name;
        address = credential.vc.credentialSubject.address;
        city = credential.vc.credentialSubject.city;
        state = credential.vc.credentialSubject.state;
        country = credential.vc.credentialSubject.country;
        zip = credential.vc.credentialSubject.zip;
      }
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

  const outputPath = '../../../public/image_with_text.jpeg';
  const imagePath = `${NEXT_PUBLIC_URL}/Receipt.jpeg`

  const text = `Order Confirmed!\n${address}\n${city}\n${state}\n${zip}\nThank you ${name}!\n`;
  gm(imagePath)
  .font('Arial', 12) // Replace 'Arial' with your desired font family
  .fill('black') // Text color  .drawText(10, 10, text)      // Draw text on the image
  .write(outputPath, (err: any) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Text added to image successfully');
    }
  });

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
            label: `Thank you ${name}!`,
          },
        ],
        image: {
          src: `${NEXT_PUBLIC_URL}/Receipt.jpeg`,
        },
      }),
    );
  } else {
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
              label: `Thank you! NFT minted as reward!`,
            },
          ],
          image: {
            src: `${NEXT_PUBLIC_URL}/Receipt.jpeg`,
          },
        }),
      );
    }
  }
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Thank you!`,
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/Receipt.jpeg`,
      },
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
