import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

import { auth } from '@cs/auth';

// Use-case: uploading images for blog posts
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Generate a client token for the browser to upload the file

        // ⚠️ Authenticate users before generating the token.
        // Otherwise, you're allowing anonymous uploads.
        const { user } = await auth();
        if (!user) {
          throw new Error('Not authorized');
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'], // optional, default to all content types
          // maximumSizeInBytes: number, optional, default to 500MB
          // validUntil: number, optional, timestamp in ms, by default now + 30s (30,000)
          // addRandomSuffix: boolean, optional, allows to disable or enable random suffixes (defaults to `true`)
          // cacheControlMaxAge: number, optional, a duration in seconds to configure the edge and browser caches.
          tokenPayload: JSON.stringify({
            // optional, sent to your server on upload completion
            userId: user.id,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow

        console.log('blob upload completed', blob, tokenPayload);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
