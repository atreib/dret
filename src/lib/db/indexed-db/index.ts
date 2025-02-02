"use client";

import { Repository, RepositoryOptions, DatabaseError } from "../contract";
import { Result, success, failure } from "../result";
import { openDatabase, executeTransaction } from "./utils";

export class IndexedDBRepository<T extends { id: string }>
  implements Repository<T>
{
  private db: IDBDatabase | null = null;
  private readonly options: RepositoryOptions<T>;

  constructor(options: RepositoryOptions<T>) {
    this.options = options;
  }

  private async ensureConnection(): Promise<
    Result<IDBDatabase, DatabaseError>
  > {
    if (this.db) return success(this.db);

    const result = await openDatabase(
      this.options.storeName,
      this.options.version
    );
    if (result._tag === "success") {
      this.db = result.value;
    }
    return result;
  }

  async create(item: T): Promise<Result<T, DatabaseError>> {
    const validationResult = this.options.schema.safeParse(item);
    if (!validationResult.success) {
      return failure(
        new DatabaseError("Validation failed", validationResult.error)
      );
    }

    const connectionResult = await this.ensureConnection();
    if (connectionResult._tag === "failure") return connectionResult;

    return await executeTransaction<T>(
      connectionResult.value,
      this.options.storeName,
      "readwrite",
      (store) => store.add(item)
    );
  }

  async update(id: string, item: T): Promise<Result<T, DatabaseError>> {
    const validationResult = this.options.schema.safeParse(item);
    if (!validationResult.success) {
      return failure(
        new DatabaseError("Validation failed", validationResult.error)
      );
    }

    const connectionResult = await this.ensureConnection();
    if (connectionResult._tag === "failure") return connectionResult;

    return await executeTransaction<T>(
      connectionResult.value,
      this.options.storeName,
      "readwrite",
      (store) => store.put({ ...item, id })
    );
  }

  async delete(id: string): Promise<Result<void, DatabaseError>> {
    const connectionResult = await this.ensureConnection();
    if (connectionResult._tag === "failure") return connectionResult;

    return await executeTransaction<void>(
      connectionResult.value,
      this.options.storeName,
      "readwrite",
      (store) => store.delete(id)
    );
  }

  async findById(id: string): Promise<Result<T | null, DatabaseError>> {
    const connectionResult = await this.ensureConnection();
    if (connectionResult._tag === "failure") return connectionResult;

    return await executeTransaction<T | null>(
      connectionResult.value,
      this.options.storeName,
      "readonly",
      (store) => store.get(id)
    );
  }

  async findAll(): Promise<Result<T[], DatabaseError>> {
    const connectionResult = await this.ensureConnection();
    if (connectionResult._tag === "failure") return connectionResult;

    return await executeTransaction<T[]>(
      connectionResult.value,
      this.options.storeName,
      "readonly",
      (store) => store.getAll()
    );
  }
}
