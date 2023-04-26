import * as fs from "https://deno.land/std@0.173.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.179.0/path/mod.ts";
import * as yaml from "https://deno.land/x/js_yaml_port@3.14.0/js-yaml.js";
import * as syncTools from "./sync.lib.js";

export const CHRONICLE_COLLECTIONS = [
  ["families", { schema: "family" }],
  ["series", { schema: "series" }],
  ["events", { schema: "event", grouping: true }],
];

let _silentMode = false;

export class Chronicle {
  constructor(options = {}) {
    this.options = options;
    this.srcDir = this.options.srcDir || "./data";
    this.outputDir = this.options.outputDir || "./dist/data";
    this.schemaDir = this.options.schemaDir || "./schema";
    this.data = {};
    this.schemas = {};
    this.initialized = false;
  }

  async init() {
    this.initialized = true;
    // Load collections & schemas
    for (const [col, colConfig] of CHRONICLE_COLLECTIONS) {
      const schema = this.schemas[colConfig.schema] = await _yamlLoad(
        path.join(this.schemaDir, `${colConfig.schema}.yaml`),
      );
      // load data
      this.data[col] = new ChronicleCollection(this, col, colConfig, schema);
      await this.data[col].load(path.join(this.srcDir, col));
    }
  }

  async build() {
    if (!this.initialized) {
      throw new Error("Chronicle is not initialized (eq. init())");
    }
    await fs.emptyDir(this.outputDir);
    await _jsonWrite(path.join(this.outputDir, "index.json"), this.data);
    // write schemas
    const schemaOutputDir = path.join(this.outputDir, "schema");
    await fs.emptyDir(schemaOutputDir);
    for (const schemaKey of Object.keys(this.schemas)) {
      await _jsonWrite(
        path.join(schemaOutputDir, `${schemaKey}.json`),
        this.schemas[schemaKey],
      );
    }
  }
}

export class ChronicleCollection {
  constructor(engine, name, config, schema) {
    this.engine = engine;
    this.name = name;
    this.config = config;
    this.items = [];
    this.schema = schema;
  }
  async load(dir) {
    // load data
    for await (const f of Deno.readDir(dir)) {
      if (!f.isDirectory) {
        continue;
      }
      if (this.config.grouping) {
        const subdir = path.join(dir, f.name);
        for await (const sf of Deno.readDir(subdir)) {
          await this._loadItem(sf.name, path.join(subdir, sf.name));
        }
      } else {
        await this._loadItem(f.name, path.join(dir, f.name));
      }
    }
  }
  async _loadItem(id, dir) {
    const item = new ChronicleItem(id, this);
    await item.load(dir);
    this.items.push(item);
  }

  toJSON() {
    return this.items;
  }

  toArray() {
    return this.items.map((i) => i.toJSON());
  }
}

export class ChronicleItem {
  constructor(id, col) {
    this.id = id;
    this.index = { id };
    this.dir = null;
    this.haveSync = null;
    this.syncFile = null;
    this.syncData = {};
  }
  async load(dir) {
    this.dir = dir;
    this.syncFile = path.join(this.dir, "+sync.js");
    this.index = Object.assign(
      this.index,
      await _yamlLoad(path.join(this.dir, "index.yaml")),
    );
    const dataFile = path.join(this.dir, "+data.json");
    if (await fs.exists(dataFile)) {
      this.index = Object.assign(this.index, await _jsonLoad(dataFile));
    }
    this.haveSync = await fs.exists(this.syncFile);
  }
  async sync() {
    if (!this.haveSync || !this.syncFile) {
      return null;
    }
    const module = await import("../" + this.syncFile);
    console.log(`syncing ${this.id} ..`);
    if (module.data) {
      const data = await module.data(syncTools);
      this.syncData = data;
      await _jsonWrite(path.join(this.dir, "+data.json"), data);
    }
  }
  toJSON() {
    return Object.assign(this.index, this.syncData);
  }
}

async function _jsonLoad(fn) {
  return JSON.parse(await Deno.readTextFile(fn));
}

async function _yamlLoad(fn) {
  return yaml.load(await Deno.readTextFile(fn));
}
async function _jsonWrite(fn, data) {
  if (Array.isArray(fn)) {
    fn = fn.join("/");
  }
  await Deno.writeTextFile(fn, JSON.stringify(data, null, 2));
  if (!_silentMode) {
    console.log(`${fn} writed`);
  }
  return true;
}
