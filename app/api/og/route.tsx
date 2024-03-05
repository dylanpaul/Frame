import { ImageResponse } from '@vercel/og';
import React from 'react';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // ?title=<title>
    const hasTitle = searchParams.has('title');
    const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : 'Default Title';

    // ?description=
    const hasDescription = searchParams.has('description');
    const description = hasDescription ? searchParams.get('description') : '';

    // Split the description by new line characters
    const descriptionLines = description?.split('\n') || [];

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
            fontSize: 80,
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              backgroundImage: 'linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))',
              backgroundClip: 'text',
              color: 'transparent',
              fontSize: 80,
              fontWeight: 700,
              margin: 0,
            }}
          >
            {title}
          </p>
          {descriptionLines.map((line, index) => (
            <React.Fragment key={index}>
              <p
                style={{
                  backgroundImage: 'linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))',
                  backgroundClip: 'text',
                  color: 'transparent',
                  fontSize: 10,
                  fontWeight: 700,
                  margin: 0,
                  marginTop: 20,
                }}
              >
                {line}
              </p>
              {index < descriptionLines.length - 1 && <br />}{' '}
              {/* Add <br /> except for the last line */}
            </React.Fragment>
          ))}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
