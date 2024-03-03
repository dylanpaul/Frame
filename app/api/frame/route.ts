import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import NFT from '../../../constants/NFT.json';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
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
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
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
const { createCanvas, loadImage } = require('canvas');

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

  const processedImagePath = path.join('/tmp', 'image_with_text.jpg');
  const imagePath = path.join(process.cwd(), 'public', 'Receipt.jpg');
  const text = `Order Confirmed!\n${address}\n${city}\n${state}\n${zip}\nThank you ${name}!\n\nOrder sent to your email: dhp21312123@gmail.com`;
  const firebaseConfig = require('../../../firebase-config');
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const storageRef = ref(storage, 'images/receipt.jpeg');

  async function textOverlay() {
    // Create a canvas
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');

    // Load the image
    const image = await loadImage(imagePath);
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the image on the canvas
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Set font properties
    ctx.font = '20px Roboto';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Add text to the center of the canvas
    const lines = text.split('\n');
    const lineHeight = 30;
    const startY = canvas.height / 2 - (lines.length * lineHeight) / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
    });

    // Save the canvas to an image file
    const out = fs.createWriteStream(processedImagePath);
    const stream = canvas.createJPEGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('Image with text saved.'));

    // Upload the processed image to Firebase Storage
    // const destination = ref(storage, processedImagePath);

    await uploadBytes(storageRef, processedImagePath)
      .then((snapshot) => {
        console.log('File uploaded successfully!', snapshot);
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  }

  await textOverlay();

  // Get the download URL of the uploaded image
  const downloadURL = await getDownloadURL(storageRef);
  console.log('Image uploaded to Firebase Storage. Download URL:', downloadURL);

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
          src: downloadURL,
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
