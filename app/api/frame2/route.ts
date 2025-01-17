import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
require('dotenv').config();

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

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
          label: `Black`,
        },
        {
          label: 'Orange',
        },
        {
          label: 'Green',
        },
        {
          label: 'Blue',
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/Hats.jpeg`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame1`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
