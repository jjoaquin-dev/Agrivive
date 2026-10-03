import "dotenv/config";
import { runScheduledJobs } from "./jobs/run-scheduled";

let running = false;
let stopping = false;

async function tick() {
  if (running) return;
  running = true;
  try {
    const result = await runScheduledJobs();
    console.log("Scheduled jobs completed", result);
  } catch (error) {
    console.error("Scheduled jobs failed", error);
  } finally {
    running = false;
  }
}

void tick();
const timer = setInterval(() => void tick(), 60_000);

async function stop() {
  if (stopping) return;
  stopping = true;
  clearInterval(timer);
  while (running) await new Promise((resolve) => setTimeout(resolve, 100));
  process.exit(0);
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
