import * as AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 } from "uuid";

const mimeToExtension: { [key: string]: string } = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/bmp": "bmp",
};

const s3: AWS.S3 = new AWS.S3();

export function getList() {
  return new Promise((resolve, reject) => {
    s3.listBuckets((err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data.Buckets);
    });
  });
}

export async function ready() {
  if (
    process.env.AWS_FILE_BUCKET_ALLOW_MAX_SIZE == "" ||
    isNaN(Number(process.env.AWS_FILE_BUCKET_ALLOW_MAX_SIZE))
  )
    throw new Error(`env "AWS_FILE_BUCKET_ALLOW_MAX_SIZE" is invalid`);
  const S3Buckets: any = await getList();
  if (
    !(<string[]>S3Buckets.map((b: any) => b.Name)).includes(
      `${process.env.AWS_FILE_BUCKET_NAME}`
    )
  ) {
    throw new Error(
      `can't find S3 Buckets named "${process.env.AWS_FILE_BUCKET_NAME}"`
    );
  }
  console.log("[AWS] S3 ready");
}

export const profile = multer({
  storage: multerS3({
    s3: s3,
    bucket: `${process.env.AWS_FILE_BUCKET_NAME}`,
    acl: "public-read",
    key: function (request, file, cb) {
      if (!mimeToExtension[file.mimetype]) {
        cb(new Error("extension not supported"));
      }
      const filename = `${request.user!.id}n${v4()
        .toString()
        .replace("-", "")}.${mimeToExtension[file.mimetype]}`;
      request.urls!.push(`profile/${filename}`);
      cb(null, `profile/${filename}`);
    },
    contentType: function (request, file, cb) {
      cb(null, file.mimetype);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * Number(process.env.AWS_FILE_BUCKET_ALLOW_MAX_SIZE),
  },
});

export const project = multer({
  storage: multerS3({
    s3: s3,
    bucket: `${process.env.AWS_FILE_BUCKET_NAME}`,
    acl: "public-read",
    key: function (request, file, cb) {
      if (!mimeToExtension[file.mimetype]) {
        cb(new Error("extension not supported"));
      }
      const filename = `${request.user!.id}n${v4()
        .toString()
        .replace("-", "")}.${mimeToExtension[file.mimetype]}`;
      request.urls!.push(`project/${filename}`);
      cb(null, `project/${filename}`);
    },
    contentType: function (request, file, cb) {
      cb(null, file.mimetype);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * Number(process.env.AWS_FILE_BUCKET_ALLOW_MAX_SIZE),
  },
});
