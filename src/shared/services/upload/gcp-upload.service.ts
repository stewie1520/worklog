import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";
import convert from "convert";
import { inject, injectable } from "inversify";

import { Config } from "@/shared/config";
import { UploadService } from "@/shared/services/upload/upload.service";

import { createStorage } from "./storage";

@injectable()
export class GcpUploadService extends UploadService {
  private storage: Storage;

  constructor(@inject(Config) config: Config) {
    super();
    this.storage = createStorage(config);
  }

  public async getPresignedUrl(
    bucket: string,
    filename: string,
    contentSizeMb?: number,
    contentType?: string,
  ): Promise<string> {
    const uploadOptions: GetSignedUrlConfig = {
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: contentType ?? "application/octet-stream",
    };

    if (contentSizeMb) {
      uploadOptions.extensionHeaders = {
        "x-goog-content-length-range": `0,${convert(contentSizeMb, "mb").to("byte")}`,
      };
    }

    const [url] = await this.storage
      .bucket(bucket)
      .file(filename)
      .getSignedUrl(uploadOptions);

    return url;
  }
}
