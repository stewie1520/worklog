import { injectable } from "inversify";

@injectable()
export abstract class UploadService {
  public abstract getPresignedUrl(
    bucket: string,
    filename: string,
    contentSizeMb?: number,
    contentType?: string,
  ): Promise<string>;
}
