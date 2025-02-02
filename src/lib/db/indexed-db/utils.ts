"use client";

import { Result, success, failure } from "../result";
import { DatabaseError } from "../contract";

const DB_NAME = "cloud-text2diagram-db";
const DEFAULT_VERSION = 1;

export const openDatabase = async (
  storeName: string,
  version = DEFAULT_VERSION
): Promise<Result<IDBDatabase, DatabaseError>> => {
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, version);

    request.onerror = () => {
      resolve(
        failure(new DatabaseError("Failed to open database", request.error))
      );
    };

    request.onsuccess = () => {
      resolve(success(request.result));
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };
  });
};

export const executeTransaction = async <T>(
  db: IDBDatabase,
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest
): Promise<Result<T, DatabaseError>> => {
  return new Promise((resolve) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const request = operation(store);

    request.onerror = () => {
      resolve(failure(new DatabaseError("Transaction failed", request.error)));
    };

    request.onsuccess = () => {
      resolve(success(request.result));
    };
  });
};
