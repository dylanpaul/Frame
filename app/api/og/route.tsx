import { ImageResponse } from '@vercel/og';

// export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // ?title=<title>
    const hasTitle = searchParams.has('title');
    const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : 'Default Title';

    // ?description=
    const hasDescription = searchParams.has('description');
    const description = hasDescription ? searchParams.get('description') : '';
    console.log(description);

    // Split the description by new line characters
    const descriptionLines = description?.split('\n') || [];
    console.log(descriptionLines);

    return new ImageResponse(
      (
        <>
          <div
            style={{
              display: 'flex',
              height: '100vh',
              width: '100vw',
              paddingTop: '20px',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
              fontSize: '64px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                color: 'black',
                fontSize: '64px',
                fontWeight: 700,
                margin: 0,
                marginBottom: 20,
              }}
            >
              {title}
            </p>
            <br></br>
            {descriptionLines.map((line, index) => (
              <p
                key={index}
                style={{
                  color: 'black',
                  fontSize: '48px',
                  margin: 0,
                  marginTop: 5,
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </>
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
