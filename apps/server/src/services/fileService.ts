import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BaseService } from "./baseService";
import mongoose from "mongoose";

import sharp from "sharp";
import { ServiceResponse } from "../types/service-respone";
import { FileModel, FileStatus } from "../models/file.model";
import { FileProcessingService } from "./fileProcessingService";

export class FileService extends BaseService {
  private s3Client: S3Client;
  private processingService: FileProcessingService;

  constructor() {
    super("FileService");
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.processingService = new FileProcessingService();
  }

  async uploadFile(
    file: any,
    userId: string,
    context: {
      type: "User" | "group" | "message" | "channel";
      id: string;
      purpose?: "avatar" | "banner" | "attachment";
    }
  ): Promise<ServiceResponse<any>> {
    try {
      const fileId = new mongoose.Types.ObjectId();
      const extension = file.originalname.split(".").pop();
      const s3Key = `conversation/${context.id}/${fileId}.${extension}`;

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
        conversationId: context.id,
        url,
        status: FileStatus.PROCESSING,
        metadata,
      });

      // await this.processingService.addJob({
      //   fileId: fileRecord.fileId,
      //   operations: this.getProcessingOperations(
      //     file.mimetype,
      //     context.purpose
      //   ),
      // });

      return {
        success: true,
        data: this.formatFileResponse(fileRecord),
      };
    } catch (error) {
      this.logger.error("File upload error:", error);
      return {
        success: false,
        error: "Failed to upload file",
      };
    }
  }

  async getFile(fileId: string, userId: string): Promise<ServiceResponse<any>> {
    try {
      const fileRecord = await FileModel.findOne({
        fileId,
        uploadedBy: userId,
      });

      if (!fileRecord) {
        return { success: false, error: "File not found or unauthorized" };
      }

      const url = await this.generateSignedUrl(fileRecord.s3_key);

      return {
        success: true,
        data: {
          ...fileRecord.toObject(),
          url,
        },
      };
    } catch (error) {
      this.logger.error("File fetch error:", error);
      return { success: false, error: "Failed to fetch file" };
    }
  }

  async deleteFile(
    fileId: string,
    userId: string
  ): Promise<ServiceResponse<any>> {
    try {
      const fileRecord = await FileModel.findOneAndDelete({
        fileId,
        uploadedBy: userId,
      });

      if (!fileRecord) {
        return { success: false, error: "File not found or unauthorized" };
      }

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileRecord.s3_key,
        })
      );

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error("File deletion error:", error);
      return { success: false, error: "Failed to delete file" };
    }
  }

  async getFilePreview() {}

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

  private getProcessingOperations(
    mimeType: string,
    purpose?: string
  ): string[] {
    const operations: string[] = ["virus-scan"];

    if (mimeType.startsWith("image/")) {
      operations.push("thumbnail");
      if (purpose === "banner") operations.push("optimize");
    }

    if (mimeType.startsWith("video/")) {
      operations.push("transcode");
    }

    return operations;
  }

  private formatFileResponse(fileRecord: any) {
    return {
      id: fileRecord.fileId,
      status: fileRecord.status,
      preview:
        fileRecord.status === FileStatus.READY
          ? fileRecord.versions.thumbnail
          : null,
      originalName: fileRecord.originalName,
      s3Key: fileRecord.s3Key,
      category: fileRecord.category,
      mimeType: fileRecord.mimeType,
      size: fileRecord.size,
      uploadedBy: fileRecord.uploadedBy,
      conversationId: fileRecord.conversationId,
      url: fileRecord.url,
      metadata: fileRecord.metadata,
    };
  }
}
