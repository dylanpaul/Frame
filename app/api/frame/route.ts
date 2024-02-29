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
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const express = require('express');
// const AWS = require('aws-sdk');
// const s3 = new AWS.S3();
const app = express();
const port = 3000;

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

  // const outputPath = path.join(process.cwd(), 'public', 'image_with_text.jpeg');
  const outputPath = path.join('/tmp', 'image_with_text.jpeg');

  const imagePath = path.join(process.cwd(), 'public', 'Receipt.jpeg');
  const text1 = `Order Confirmed!\n${address}\n${city}\n${state}\n${zip}\nThank you ${name}!\n\nOrder sent to your email: dhp21312123@gmail.com`;
  console.log(imagePath);
  console.log(outputPath);
  console.log(
    'Contents of the public directory:',
    fs.readdirSync(path.join(process.cwd(), 'public')),
  );
  async function textOverlay() {
    // Reading image
    const image = await Jimp.read(imagePath);
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'open-sans-16-black.fnt');
    console.log(fontPath);
    // Defining the text font
    const font = await new Promise((resolve) => {
      Jimp.loadFont(fontPath, (err: any, loadedFont: unknown) => {
        if (err) {
          console.error('Error loading font:', err);
          resolve(null);
        } else {
          resolve(loadedFont);
        }
      });
    });
    const overlayWidth = 800;
    const overlayHeight = 800;

    const xCoordinate = (image.getWidth() - overlayWidth) / 2;
    const yCoordinate = (image.getHeight() - overlayHeight) / 2;

    image.print(
      font,
      xCoordinate,
      yCoordinate,
      {
        text: text1,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      overlayWidth,
      overlayHeight,
    ); // Writing image after processing
    //   await image.writeAsync(outputPath);
    await image.writeAsync(path.join(outputPath));
  }

  textOverlay();
  console.log('Image is processed succesfully');
  app.use('/images', express.static(path.dirname(outputPath)));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
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
          src: `/images/${path.basename(outputPath)}`,
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
            src: `${NEXT_PUBLIC_URL}/image_with_text.jpeg`,
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
        src: `${NEXT_PUBLIC_URL}/image_with_text.jpeg`,
      },
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
