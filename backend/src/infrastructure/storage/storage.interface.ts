export interface IStorage {
  uploadFile(file: Express.Multer.File): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
  getFileUrl(filename: string): string;
}