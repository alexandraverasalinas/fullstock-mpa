import fs from "node:fs/promises";
import path from "node:path";

const DATA_PATH = path.join("data", "data.json");

export async function getDb() {
  const data = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(data);
}

export async function saveDb(db) {
  await fs.writeFile(DATA_PATH, JSON.stringify(db, null, 2));
}

export async function getNextId(collectionName) {
  const db = await getDb();
  const collection = db[collectionName] || [];

  if (collection.length === 0) {
    return 1;
  }

  const ids = collection.map((item) => item.id);
  return Math.max(...ids) + 1;
}