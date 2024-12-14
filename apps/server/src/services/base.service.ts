import Logger from "../utils/logger";
import { SocketService } from "./socket.service";

export abstract class BaseService {
  protected logger: Logger;
  protected static socketService: SocketService;

  constructor(loggerName: string) {
    this.logger = new Logger(loggerName);
  }

  public static setSocketService(service: SocketService) {
    BaseService.socketService = service;
  }
}
