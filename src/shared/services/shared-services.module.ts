import { ContainerModule } from "inversify";

import { DependencyRegistry } from "@/types";

import { BcryptPasswordService, PasswordService } from "./password.service";
import { JwtTokenService, TokenService } from "./token.service";

export const sharedServicesRegistry: DependencyRegistry = (config) =>
  new ContainerModule((bind) => {
    // FIXME: add spec class here
    bind(PasswordService).to(
      config.isTest ? BcryptPasswordService : BcryptPasswordService,
    );
    bind(TokenService).to(JwtTokenService);
  });
