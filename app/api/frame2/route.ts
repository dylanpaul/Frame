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

  if (message?.button === 2) {
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
            text: 'Input Address JWT Presentation',
          },
          post_url: `${NEXT_PUBLIC_URL}/api/frame`,
        }),
      );
  }

  if (message?.button === 3) {
    return NextResponse.redirect(
        `${NEXT_PUBLIC_URL}/api/frame1`,
      { status: 302 },
    );
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Red`,
        },
        {
          action: 'link',
          label: 'Black',
          target: '{NEXT_PUBLIC_URL}/api/frame2',
        },
        {
          action: 'post_redirect',
          label: 'Yellow',
        },
        {
          label: 'Blue',
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/Storefront.jpeg`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame2`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
