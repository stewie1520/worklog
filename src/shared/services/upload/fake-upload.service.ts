/* eslint-disable @typescript-eslint/no-unused-vars */
import { UploadService } from "./upload.service";

export class FakeUploadService extends UploadService {
  public getPresignedUrl(
    bucket: string,
    filename: string,
    contentSizeMb?: number | undefined,
    contentType?: string | undefined,
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
