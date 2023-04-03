import { assertEquals } from "https://deno.land/std@0.119.0/testing/asserts.ts";
import Ajv from "https://esm.sh/ajv@8.8.1?pin=v58";
import addFormats from "https://esm.sh/ajv-formats@2.1.1";

import { Chronicle } from "./chronicle.js";

const chronicle = new Chronicle({ silent: true });
await chronicle.init();

const ajv = new Ajv({ strict: false });
addFormats(ajv);

for (const col of Object.values(chronicle.data)) {
  const validator = ajv.compile(col.schema);
  const ids = [];
  for (const item of col.items) {
    Deno.test(`${col.name}/${item.id}`, () => {
      // schema
      if (!validator(item.index)) {
        throw validator.errors;
      }
      // duplicate ids
      if (ids.includes(item.id)) {
        throw `Duplicate ${col.name} id=${item.id}`;
      }
      ids.push(item.id);
      // check series
      if (
        item.index.series &&
        !chronicle.data.series.items.find((s) => s.id === item.index.series)
      ) {
        throw `Series not found: ${item.index.series}`;
      }
      // check family
      if (
        item.index.family &&
        !chronicle.data.families.items.find((s) => s.id === item.index.family)
      ) {
        throw `Family not found: ${item.index.family}`;
      }
    });
  }
}
