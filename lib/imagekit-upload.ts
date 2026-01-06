// lib/imagekit-upload.ts
interface UploadToImageKitParams {
  file: string; // base64 string
  fileName: string;
  folder: string;
}

interface UploadResponse {
  url: string;
  fileId: string;
  name: string;
  filePath: string;
}

export async function uploadToImageKit({
  file,
  fileName,
  folder
}: UploadToImageKitParams): Promise<UploadResponse> {
  // Get auth params from your API
  const authRes = await fetch('/api/upload-auth');
  if (!authRes.ok) {
    throw new Error('Failed to get upload authentication');
  }

  const { token, signature, expire, publicKey } = await authRes.json();

  // Upload to ImageKit
  const formData = new FormData();
  
  // Convert base64 to blob
  const base64Response = await fetch(file);
  const blob = await base64Response.blob();
  
  formData.append('file', blob);
  formData.append('fileName', fileName);
  formData.append('folder', folder);
  formData.append('publicKey', publicKey);
  formData.append('signature', signature);
  formData.append('expire', expire.toString());
  formData.append('token', token);

  const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: formData
  });

  if (!uploadRes.ok) {
    const errorData = await uploadRes.json();
    throw new Error(errorData?.message || 'Upload failed');
  }

  return await uploadRes.json();
}
