import { ContainerModule } from "inversify";

import { DependencyLoader } from "@/types";

import { BcryptPasswordService, PasswordService } from "./password.service";
import { JwtTokenService, TokenService } from "./token.service";

export const sharedServicesLoader: DependencyLoader = () =>
  new ContainerModule((bind) => {
    bind(PasswordService).to(BcryptPasswordService);
    bind(TokenService).to(JwtTokenService);
  });
