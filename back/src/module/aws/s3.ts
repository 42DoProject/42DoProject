import * as AWS from "aws-sdk";
import * as search from "../search";
import multer from "multer";
import multerS3 from "multer-s3";
import request from "request";
import { v4 } from "uuid";
import { User } from "../../models/user/user.model";

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

export async function profileToS3(userId: number, profileImage: string) {
  const filename = `${userId}n${v4().toString().replace("-", "")}.jpg`;
  try {
    await urlToBucket(
      `${process.env.AWS_FILE_BUCKET_NAME}`,
      profileImage,
      `origin/profile/${filename}`
    );
    await User.update(
      {
        profileImage: `https://${process.env.AWS_FILE_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/origin/profile/${filename}`,
      },
      { where: { id: userId } }
    );
    search.updateUser(
      {
        profileImage: `https://${process.env.AWS_FILE_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/origin/profile/${filename}`,
      },
      { id: userId }
    );
  } catch (e) {
    console.log(e);
  }
}

export function urlToBucket(bucket: string, url: string, key: string) {
  return new Promise((resolve, reject) => {
    const j = request.jar();
    const cookie: request.Cookie | undefined = request.cookie(
      "_intra_42_session_production=c5925e698f64cd1fa4aa121d1b623bf8"
    );
    if (cookie === undefined) {
      reject("cookie error");
      return;
    }
    j.setCookie(cookie, url);
    request(
      {
        url: url,
        jar: j,
        encoding: null,
      },
      async function (err, response, body) {
        if (err) reject(err);
        await s3
          .putObject({
            Bucket: bucket,
            Key: key,
            ContentType: response.headers["content-type"],
            Body: body,
          })
          .promise();
        resolve(true);
      }
    );
  });
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
      request.urls!.push(`origin/profile/${filename}`);
      cb(null, `origin/profile/${filename}`);
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
      request.urls!.push(`origin/project/${filename}`);
      cb(null, `origin/project/${filename}`);
    },
    contentType: function (request, file, cb) {
      cb(null, file.mimetype);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * Number(process.env.AWS_FILE_BUCKET_ALLOW_MAX_SIZE),
  },
});

export const projectContent = multer({
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
      request.urls!.push(`image/${filename}`);
      cb(null, `image/${filename}`);
    },
    contentType: function (request, file, cb) {
      cb(null, file.mimetype);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * Number(process.env.AWS_FILE_BUCKET_ALLOW_MAX_SIZE),
  },
});
