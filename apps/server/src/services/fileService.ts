import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BaseService } from "./baseService";
import mongoose from "mongoose";

import sharp from "sharp";
import { ServiceResponse } from "../types/service-respone";
import { FileModel, FileStatus } from "../models/file.model";

export class FileService extends BaseService {
  private s3Client: S3Client;
  constructor() {
    super("FileService");
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadFile(
    file: any,
    userId: string,
    conversationId: string
  ): Promise<ServiceResponse<any>> {
    try {
      const fileId = new mongoose.Types.ObjectId();
      const extension = file.originalname.split(".").pop();
      const s3Key = `conversation/${conversationId}/${fileId}.${extension}`;

      const category = this.getFileCategory(file.mimeType);
      let metadata: any = {};

      if (category === "image") {
        metadata = await this.processImage(file.buffer);
      }
      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(uploadCommand);

      const url = await this.generateSignedUrl(s3Key);

      const fileRecord = await FileModel.create({
        fileId: fileId.toString(),
        originalName: file.originalname,
        s3Key,
        category,
        mimeType: file.mimetype,
        size: file.size,
        uploadedBy: userId,
        conversationId,
        url,
        status: FileStatus.READY,
        metadata,
      });

      return {
        success: true,
        data: {
          file: fileRecord,
          attachment: {
            url,
            name: file.originalname,
            type: category,
            size: file.size,
            metadata,
          },
        },
      };
    } catch (error) {
      this.logger.error("File upload error:", error);
      return {
        success: false,
        error: "Failed to upload file",
      };
    }
  }

  async getFilePreview() {}

  async deleteFile() {}

  private async generateSignedUrl(s3Key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
    });
    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  private getFileCategory(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.startsWith("pdf") || mimeType.includes("document"))
      return "document";
    return "other";
  }

  private async processImage(buffer: Buffer) {
    try {
      const metadata = await sharp(buffer).metadata();
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
      };
    } catch (error) {
      this.logger.error("Image processing error:", error);
      return {};
    }
  }
}
