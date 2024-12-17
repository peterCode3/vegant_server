import { AdminDocument } from '../../user/schemas/admin.schema';
import { JwtPayload } from 'jsonwebtoken';
import { JwtService } from '../../jwt/jwt.service';
import { TokenService } from '../../user/token.service';
import { I18nService } from 'nestjs-i18n';
import { Response } from 'express';

export interface JwtValidatorContext {
  authorizationHeader?: string | string[];
  authorizationCookie?: string;
  token?: string;
  user?: AdminDocument;
  verifiedToken?: JwtPayload;
  jwtService?: JwtService;
  tokenService?: TokenService;
  scopes?: string[];
  i18n?: I18nService;
  errorMessage?: string;
  errorCode?: number;
  response?: Response;
}

export type JwtValidatorServiceSchema = {
  verifyToken: {
    data: {
      verifiedToken: JwtPayload;
    };
  };

  verifyUser: {
    data: {
      user: AdminDocument;
    };
  };

  checkScopes: {
    data: boolean;
  };
};
