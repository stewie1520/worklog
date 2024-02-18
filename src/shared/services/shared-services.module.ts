import { ContainerModule } from "inversify";

import { DependencyLoader } from "@/types";

import { BcryptPasswordService, PasswordService } from "./password.service";
import { JwtTokenService, TokenService } from "./token.service";
import { FakeUploadService, GcpUploadService, UploadService } from "./upload";

export const sharedServicesLoader: DependencyLoader = (config) =>
  new ContainerModule((bind) => {
    bind(PasswordService).to(BcryptPasswordService);
    bind(TokenService).to(JwtTokenService);
    bind(UploadService).to(
      config.isTest ? FakeUploadService : GcpUploadService,
    );
  });
