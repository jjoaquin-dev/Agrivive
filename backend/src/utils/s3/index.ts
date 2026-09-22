import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export function getS3Client(): S3Client {
  const region = process.env.AWS_REGION || "ap-southeast-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim();

  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "AWS S3 credentials missing: Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in backend/.env",
    );
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function uploadToS3(params: {
  buffer: Buffer;
  key: string;
  contentType: string;
}): Promise<string> {
  const bucket = process.env.AWS_S3_BUCKET_NAME?.trim();
  if (!bucket) {
    throw new Error(
      "AWS S3 bucket missing: Please set AWS_S3_BUCKET_NAME in backend/.env",
    );
  }

  const s3 = getS3Client();
  const region = process.env.AWS_REGION || "ap-southeast-1";

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: params.key,
      Body: params.buffer,
      ContentType: params.contentType,
    }),
  );

  return `https://${bucket}.s3.${region}.amazonaws.com/${params.key}`;
}
