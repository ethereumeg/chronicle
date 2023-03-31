import { Chronicle } from "./chronicle.js";

const args = Deno.args || [];
const options = Object.fromEntries(
  args.map((x) => {
    const [key, value] = x.split("=");
    if (!value) return null;
    return [key, value];
  }).filter((x) => x),
);

const chronicle = new Chronicle(options);
await chronicle.init();

const output = await chronicle.build();
if (output) {
  console.log(output);
}
