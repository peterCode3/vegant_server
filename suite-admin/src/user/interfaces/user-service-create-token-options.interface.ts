import { AdminDocument } from '../schemas/admin.schema';

export interface TokenOptions {
  user: AdminDocument;
  exp?: number;
  scopes?: string[];
}
