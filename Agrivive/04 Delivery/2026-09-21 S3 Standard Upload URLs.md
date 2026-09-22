# S3 Standard Upload URLs

Date: 2026-09-21

## Change and reason

Removed the optional custom-domain setting at the owner's request. Uploaded objects now always return the standard regional S3 URL built from the configured bucket, region, and object key.

## Affected files

- `backend/src/utils/s3/index.ts`: removed the custom-domain URL branch.
- `backend/.env.example`: removed the unused custom-domain variable.

The owner is handling the local `.env` entry; its contents were not changed in this update.

## Verification

- `bunx tsc --noEmit`: passed.
- `bun build src/index.ts --outdir dist --target bun`: passed (1476 modules).
- Live upload and image read-access checks: pending owner testing; AWS credentials and bucket permissions were not tested.

No commit created.
