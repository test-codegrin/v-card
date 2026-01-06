// app/api/upload-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { imagekit } from '@/lib/imagekit';
import jwt from 'jsonwebtoken';

// Extract user from JWT
function getUserFromRequest(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    const decoded = jwt.verify(token, secret) as { email?: string };
    return decoded;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const user = getUserFromRequest(req);
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { file, fileName, folder } = await req.json();

    if (!file || !fileName) {
      return NextResponse.json(
        { error: 'File and fileName are required' },
        { status: 400 }
      );
    }

    // Upload to ImageKit
    const response = await imagekit.upload({
      file, // base64 string or URL
      fileName,
      folder: folder || '/v-card',
      useUniqueFileName: true,
      tags: ['v-card', user.email]
    });

    return NextResponse.json({
      url: response.url,
      fileId: response.fileId,
      filePath: response.filePath,
      name: response.name
    });
  } catch (error: any) {
    console.error('ImageKit upload failed:', error);
    return NextResponse.json(
      { error: error?.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
