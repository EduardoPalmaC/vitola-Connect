import crypto from 'crypto';

export function getCloudinarySignature(timestamp: number): string {
  const secret = process.env.CLOUDINARY_SECRET!;
  const toSign = `timestamp=${timestamp}${secret}`;
  return crypto.createHash('sha1').update(toSign).digest('hex');
}

export const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
