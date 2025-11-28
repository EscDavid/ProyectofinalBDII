import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");
const logFile = path.join(logDir, "logs.txt");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export function logAction(action, user = "system") {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] (${user}) ${action}\n`;

  try {
    fs.appendFileSync(logFile, entry, "utf8");
  } catch (err) {
    console.error("Error al escribir en el archivo de logs:", err);
  }
}
