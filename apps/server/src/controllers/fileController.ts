import { FileService } from "../services/fileService";
import { SocketService } from "../services/socketService";
import { BaseController } from "./baseController";

export class FileController extends BaseController {
  private fileService: FileService;
  private socket: SocketService;

  constructor() {
    super("FileController");
    this.fileService = new FileService();
    this.socket = new SocketService();
  }

  async uploadFile() {}

  async getFile() {}

  async deleteFile() {}
}
