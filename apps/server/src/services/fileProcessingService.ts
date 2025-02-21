import { EventEmitter } from "events";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { FileModel } from "../models/file";
import { StreamingBlobPayloadOutputTypes } from "@smithy/types";
interface ProcessingJob {
  fileId: string;
  operations: ("thumbnail" | "virus-scan" | "transcode")[];
}

export class FileProcessingService {
  private emitter = new EventEmitter();
  private queue: ProcessingJob[] = [];
  private isProcessing = false;
  private s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    this.emitter.on("thumbnail", async (job) => {
      try {
        await this.generateThumbnail(job.fileId);
        this.markComplete(job);
      } catch (error) {
        console.error("Thumbnail generation failed:", error);
        this.retryJob(job);
      }
    });
  }

  async addToQueue(job: ProcessingJob) {
    this.queue.push(job);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue() {
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const job = this.queue.shift()!;
      this.emitter.emit(job.operations[0], job);
    }
    this.isProcessing = false;
  }

  private retryJob(job: ProcessingJob, attempt = 1) {
    if (attempt < 3) {
      setTimeout(() => {
        this.queue.unshift(job);
        this.processQueue();
      }, 1000 * attempt);
    } else {
      console.error("Job failed after 3 attempts:", job);
    }
  }

  private markComplete(job: ProcessingJob) {
    console.log("Completed job:", job);
  }

  private async generateThumbnail(fileId: string) {
    try {
      const fileRecord = await FileModel.findOne({ fileId });
      if (!fileRecord) throw new Error("File not found");

      const { Body: fileStream } = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileRecord.s3_key,
        })
      );

      const thumbnailBuffer = await sharp(await streamToBuffer(fileStream))
        .resize(250, 250, { fit: "inside" })
        .jpeg({ quality: 80 })
        .toBuffer();

      const thumbnailKey = `thumbnails/${fileRecord.s3_key}`;
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: thumbnailKey,
          Body: thumbnailBuffer,
          ContentType: "image/jpeg",
        })
      );

      await FileModel.updateOne(
        { fileId },
        { $set: { "versions.thumbnail": thumbnailKey } }
      );
    } catch (error) {
      console.error("Thumbnail generation failed:", error);
      throw error;
    }
  }
}
function streamToBuffer(
  fileStream: StreamingBlobPayloadOutputTypes | undefined
):
  | sharp.SharpOptions
  | PromiseLike<sharp.SharpOptions | undefined>
  | undefined {
  throw new Error("Function not implemented.");
}
