import mongoose, {
  ClientSession,
  Document,
  Connection,
  Model,
  FilterQuery,
} from "mongoose";
import { Logger } from "../utils/logger";
import { config } from "../config/config";

export class DatabaseService {
  private connection: Connection | null = null;
  private logger: Logger;
  private models: Map<string, Model<any>>;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 5000;

  constructor() {
    this.logger = new Logger("DatabaseService");
    this.initializeConnection();
    this.models = new Map();
    // mongoose.set('maxListeners', 20); // Increase max listeners
  }

  private async initializeConnection(): Promise<void> {
    try {
      mongoose.connection.on("connected", () => {
        this.logger.info("MongoDB connected successfully");
      });

      mongoose.connection.on("error", (error) => {
        this.logger.error("MongoDB connection error:", error);
      });

      mongoose.connection.on("disconnected", () => {
        this.logger.info("MongoDB disconnected");
      });
      await this.connect();
    } catch (error) {
      this.logger.error("Database initialization failed:", error);
      throw error;
    }
  }

  private async connect(retryCount = 0): Promise<void> {
    try {
      await mongoose.connect(config.mongodb, {
        maxPoolSize: 10,
        minPoolSize: 2,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
        heartbeatFrequencyMS: 10000,
      });

      this.connection = mongoose.connection;
    } catch (error) {
      if (retryCount < this.MAX_RETRIES) {
        this.logger.warn(
          `Retrying database connection (${retryCount + 1}/${this.MAX_RETRIES})`
        );
        await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY));
        return this.connect(retryCount + 1);
      }
      throw error;
    }
  }
  async create<T extends Document>(
    modelName: string,
    data: Partial<T>
  ): Promise<T> {
    try {
      const model = mongoose.model<T>(modelName);
      return await model.create(data);
    } catch (error) {
      this.logger.error(`Error creating document in ${modelName}:`, error);
      throw error;
    }
  }
  async findById<T extends Document>(
    collection: string,
    id: string,
    projection?: Record<string, any>
  ): Promise<T | null> {
    try {
      const model = mongoose.model(collection);
      return await model.findById(id, projection).exec();
    } catch (error) {
      this.logger.error(
        `Error finding document by ID in ${collection}:`,
        error
      );
      throw error;
    }
  }

  async findOne<T extends Document>(
    collection: string,
    filter: FilterQuery<T>,
    projection?: Record<string, any>
  ): Promise<T | null> {
    try {
      const model = mongoose.model(collection);
      return await model.findOne(filter, projection).exec();
    } catch (error) {
      this.logger.error(`Error finding document in ${collection}:`, error);
      throw error;
    }
  }

  async find<T extends Document>(
    collection: string,
    filter: FilterQuery<T>,
    options?: {
      sort?: Record<string, any>;
      limit?: number;
      skip?: number;
      projection?: Record<string, any>;
    }
  ): Promise<T[]> {
    try {
      const model = mongoose.model(collection);
      let query = model.find(filter);

      if (options?.sort) {
        query = query.sort(options.sort);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.skip) {
        query = query.skip(options.skip);
      }
      if (options?.projection) {
        query = query.select(options.projection);
      }

      return await query.exec();
    } catch (error) {
      this.logger.error(`Error finding documents in ${collection}:`, error);
      throw error;
    }
  }

  async update<T extends Document>(
    modelName: string,
    conditions: Record<string, any>,
    update: Partial<T>,
    options: mongoose.QueryOptions = { new: true }
  ): Promise<T | null> {
    try {
      const model = this.getModel<T>(modelName);
      return await model.findOneAndUpdate(conditions, update, options).exec();
    } catch (error) {
      throw error;
    }
  }

  async delete<T extends Document>(
    modelName: string,
    conditions: Record<string, any>
  ): Promise<boolean> {
    try {
      const model = this.getModel<T>(modelName);
      const result = await model.deleteOne(conditions).exec();
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndUpdate<T extends Document>(
    modelName: string,
    id: string,
    update: Partial<T>,
    options: mongoose.QueryOptions = { new: true }
  ): Promise<T | null> {
    try {
      const model = this.getModel<T>(modelName);
      return await model.findByIdAndUpdate(id, update, options).exec();
    } catch (error) {
      throw error;
    }
  }

  async startSession(): Promise<ClientSession> {
    try {
      return await mongoose.startSession();
    } catch (error) {
      this.logger.error("Error starting session:", error);
      throw error;
    }
  }

  async withTransaction<T>(
    callback: (session: ClientSession) => Promise<T>
  ): Promise<T> {
    const session = await this.startSession();

    try {
      session.startTransaction();
      const result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async closeConnection(): Promise<void> {
    if (this.connection) {
      await mongoose.disconnect();
      this.connection = null;
    }
  }

  getConnection(): Connection {
    if (!this.connection) {
      throw new Error("Database connection not initialized");
    }
    return this.connection;
  }

  private getModel<T extends Document>(modelName: string): Model<T> {
    const model = this.models.get(modelName);
    if (!model) {
      throw new Error(`Model ${modelName} not found`);
    }
    return model as Model<T>;
  }

  async checkHealth(): Promise<{
    status: string;
    responseTime: number;
  }> {
    const startTime = Date.now();
    try {
      await mongoose.connection.db?.admin().ping();
      return {
        status: "healthy",
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        status: "unhealthy",
        responseTime: Date.now() - startTime,
      };
    }
  }
}
