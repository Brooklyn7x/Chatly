import { SocketService } from "./socketService";
import { Logger } from "../utils/logger";

export abstract class BaseService {
  protected logger: Logger;
  protected static socketService: SocketService;

  constructor(loggerName: string) {
    this.logger = new Logger(loggerName);
  }

  public static setSocketService(service: SocketService) {
    BaseService.socketService = service;
  }

  protected get socketService(): SocketService {
    if (!BaseService.socketService) {
      throw new Error("SocketService not initialized");
    }
    return BaseService.socketService;
  }
}
