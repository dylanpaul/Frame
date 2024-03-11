import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Buy with Onyx!',
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/Storefront.jpeg`,
    aspectRatio: '1:1',
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/frame1`,
});

export const metadata: Metadata = {
  title: 'Loyalty',
  description: 'Rewards',
  openGraph: {
    title: 'Loyalty',
    description: 'Rewards',
    images: [`${NEXT_PUBLIC_URL}/Storefront.jpeg`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>Gold Star NFT</h1>
      <img
        src="https://ipfs.io/ipfs/QmV3yaPUv61zheFg25nDWzA7vuhxyo4QsArwsBbykAqSBy"
        alt="IPFS Image"
      />
    </>
  );
}
