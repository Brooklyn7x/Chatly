import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  profilePicture: f(["image"])
    .middleware(async ({ req }) => {
      const authToken = req.headers
        .get("Authorization")
        ?.replace("Bearer ", "");
      if (!authToken) throw new UploadThingError("Unauthorized");

      try {
        // const user = await authApi.verify(authToken);
        // if (!user) throw new UploadThingError("Unauthorized");
        // return { userId: user.id };
      } catch (error) {
        throw new UploadThingError("Unauthorized");
      }
    })
    .onUploadComplete(async ({ file, metadata }) => {
      console.log("Upload complete", file.ufsUrl, metadata);
    }),
  attachments: f({
    image: { maxFileSize: "16MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 3 },
    pdf: { maxFileSize: "16MB", maxFileCount: 5 },
  })
    .middleware(async ({ req }) => {
      const authToken = req.headers
        .get("Authorization")
        ?.replace("Bearer ", "");
      if (!authToken) throw new UploadThingError("Unauthorized");

      try {
        // const user = await authApi.verify(authToken);
        // if (!user) throw new UploadThingError("Unauthorized");
        // return { userId: user.id };
      } catch (error) {
        throw new UploadThingError("Unauthorized");
      }
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete", file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
