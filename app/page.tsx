import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Mint NFT!',
    },
    // {
    //   action: 'link',
    //   label: 'Link to Google',
    //   target: 'https://www.google.com',
    // },
    // {
    //   label: 'Redirect to pictures',
    //   action: 'post_redirect',
    // },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/GoldStar.jpeg`,
    aspectRatio: '1:1',
  },
  input: {
    text: 'Tell me a boat story',
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: 'Loyalty',
  description: 'Rewards',
  openGraph: {
    title: 'Loyalty',
    description: 'Rewards',
    images: [`${NEXT_PUBLIC_URL}/GoldStar.jpeg`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>https://ipfs.io/ipfs/QmV3yaPUv61zheFg25nDWzA7vuhxyo4QsArwsBbykAqSBy</h1>
    </>
  );
}
