"use client";

import { Result, success, failure } from "../result";
import { DatabaseError } from "../contract";

const DB_NAME = "cloud-text2diagram-db";

export interface ObjectStoreSchema {
  name: string;
  keyPath: string;
  indexes?: { name: string; keyPath: string; unique: boolean }[];
}

class DatabaseService {
  private static instance: DatabaseService;
  private db: IDBDatabase | null = null;
  private objectStores: ObjectStoreSchema[] = [];
  private version = 1;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  registerObjectStore(schema: ObjectStoreSchema): void {
    if (!this.objectStores.find((store) => store.name === schema.name)) {
      this.objectStores.push(schema);
      // Increment version to trigger onupgradeneeded
      this.version++;
      // Reset database connection to force upgrade
      this.db = null;
    }
  }

  async getDatabase(): Promise<Result<IDBDatabase, DatabaseError>> {
    if (this.db) return success(this.db);

    return new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, this.version);

      request.onerror = () => {
        resolve(
          failure(new DatabaseError("Failed to open database", request.error))
        );
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(success(request.result));
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create or update object stores
        this.objectStores.forEach((store) => {
          if (!db.objectStoreNames.contains(store.name)) {
            const objectStore = db.createObjectStore(store.name, {
              keyPath: store.keyPath,
            });

            // Create any indexes
            store.indexes?.forEach((index) => {
              objectStore.createIndex(index.name, index.keyPath, {
                unique: index.unique,
              });
            });
          }
        });
      };
    });
  }

  async executeTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest
  ): Promise<Result<T, DatabaseError>> {
    // Make sure the store is registered before attempting transaction
    if (!this.objectStores.find((store) => store.name === storeName)) {
      return failure(
        new DatabaseError(`Object store ${storeName} not registered`)
      );
    }

    const dbResult = await this.getDatabase();
    if (dbResult._tag === "failure") return dbResult;

    return new Promise((resolve) => {
      try {
        const transaction = dbResult.value.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        const request = operation(store);

        request.onerror = () => {
          resolve(
            failure(new DatabaseError("Transaction failed", request.error))
          );
        };

        request.onsuccess = () => {
          resolve(success(request.result));
        };
      } catch (error) {
        resolve(failure(new DatabaseError("Transaction failed", error)));
      }
    });
  }

  // Helper method to delete the database (useful for troubleshooting)
  async deleteDatabase(): Promise<Result<void, DatabaseError>> {
    return new Promise((resolve) => {
      const request = indexedDB.deleteDatabase(DB_NAME);

      request.onerror = () => {
        resolve(
          failure(new DatabaseError("Failed to delete database", request.error))
        );
      };

      request.onsuccess = () => {
        this.db = null;
        this.version = 1;
        resolve(success(undefined));
      };
    });
  }
}

export const db = DatabaseService.getInstance();
