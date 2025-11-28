import fs from "fs";
import path from "path";

const logPath = path.resolve("backend", "logs.txt");

export function logAction(action, user = "system") {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] (${user}) ${action}\n`;
  fs.appendFileSync(logPath, entry, "utf8");
}
