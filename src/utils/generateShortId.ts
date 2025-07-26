import { v4 } from "uuid";
import { redis } from "./redis";

export default async function generateShortId(): Promise<string> {
  let shortId: string;
  while (true) {
    shortId = v4().replace(/-/g, "").substring(0, 8);
    const checkIfExists = await redis.exists(shortId);
    if (checkIfExists === 0) {
      break;
    }
  }
  return shortId;
}
