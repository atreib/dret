import { z } from "zod";
import { Result } from "./result";

export interface Repository<T, K = string> {
  create(item: T): Promise<Result<T, DatabaseError>>;
  update(key: K, item: T): Promise<Result<T, DatabaseError>>;
  delete(key: K): Promise<Result<void, DatabaseError>>;
  findById(key: K): Promise<Result<T | null, DatabaseError>>;
  findAll(): Promise<Result<T[], DatabaseError>>;
}

export interface RepositoryOptions<T> {
  storeName: string;
  schema: z.ZodType<T>;
  version?: number;
}

export class DatabaseError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "DatabaseError";
  }
}
