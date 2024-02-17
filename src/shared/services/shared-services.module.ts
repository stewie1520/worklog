import { ContainerModule } from "inversify";

import { DependencyRegistry } from "@/types";

import { BcryptPasswordService, PasswordService } from "./password.service";
import { JwtTokenService, TokenService } from "./token.service";

export const sharedServicesRegistry: DependencyRegistry = () =>
  new ContainerModule((bind) => {
    bind(PasswordService).to(BcryptPasswordService);
    bind(TokenService).to(JwtTokenService);
  });
