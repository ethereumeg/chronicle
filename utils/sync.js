import { Chronicle } from "./chronicle.js";

const chronicle = new Chronicle({ silent: true });
await chronicle.init();

if (Deno.args[0]) {
  const ev = chronicle.data.events.items.find((e) => e.id === Deno.args[0]);
  await ev.sync();
} else {
  for (const event of chronicle.data.events.items) {
    if (!event.haveSync) {
      continue;
    }
    await event.sync();
  }
}
