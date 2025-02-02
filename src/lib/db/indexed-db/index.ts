"use client";

import { z } from "zod";
import { Repository } from "../contract";
import { Result, failure } from "../result";
import { DatabaseError } from "../contract";
import { db } from "./utils";

export abstract class BaseRepository<T extends { id: string }>
  implements Repository<T>
{
  constructor(
    protected readonly storeName: string,
    protected readonly schema: z.ZodType<T>
  ) {
    // Register the object store
    db.registerObjectStore({
      name: storeName,
      keyPath: "id",
    });
  }

  async create(item: T): Promise<Result<T, DatabaseError>> {
    const validationResult = this.schema.safeParse(item);
    if (!validationResult.success) {
      return failure(
        new DatabaseError("Validation failed", validationResult.error)
      );
    }

    return await db.executeTransaction<T>(
      this.storeName,
      "readwrite",
      (store) => store.add(item)
    );
  }

  async update(id: string, item: T): Promise<Result<T, DatabaseError>> {
    const validationResult = this.schema.safeParse(item);
    if (!validationResult.success) {
      return failure(
        new DatabaseError("Validation failed", validationResult.error)
      );
    }

    return await db.executeTransaction<T>(
      this.storeName,
      "readwrite",
      (store) => store.put({ ...item, id })
    );
  }

  async delete(id: string): Promise<Result<void, DatabaseError>> {
    return await db.executeTransaction<void>(
      this.storeName,
      "readwrite",
      (store) => store.delete(id)
    );
  }

  async findById(id: string): Promise<Result<T | null, DatabaseError>> {
    return await db.executeTransaction<T | null>(
      this.storeName,
      "readonly",
      (store) => store.get(id)
    );
  }

  async findAll(): Promise<Result<T[], DatabaseError>> {
    return await db.executeTransaction<T[]>(
      this.storeName,
      "readonly",
      (store) => store.getAll()
    );
  }
}
