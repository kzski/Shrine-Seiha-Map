import Dexie, { type EntityTable } from "dexie";

export interface VisitRecord {
  id?: number;
  shrineId: string;
  visitedAt: Date;
}

const db = new Dexie("KamiSeihaMaDB") as Dexie & {
  visits: EntityTable<VisitRecord, "id">;
};

db.version(1).stores({
  visits: "++id, shrineId, visitedAt",
});

export { db };
