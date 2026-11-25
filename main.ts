// The GPS Swears It Was a Shortcut — one line, at most 200 characters:
// the GPS's own excuse for sending the driver down the wrong road. No
// setup, no dialogue tags, just the excuse, in the GPS's voice.
// Writes /output/entry.txt.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const LIMIT = 200;

const EXCUSE =
  "The shortcut was real — it just shortcuts through a cornfield, a creek, and your remaining patience. Recalculating your trust now.";

class GpsExcuse {
  readonly text: string;

  constructor(text: string) {
    // One breath, one line: collapse stray whitespace.
    this.text = text.replace(/\s+/g, " ").trim();
  }

  get length(): number {
    return [...this.text].length;
  }

  validate(): void {
    if (this.length < 1 || this.length > LIMIT) {
      throw new Error(`entry must be 1-${LIMIT} chars, got ${this.length}`);
    }
    if (this.text.includes("\n") || this.text.includes("\r")) {
      throw new Error("entry must be a single line");
    }
    // The GPS owns the mistake: it must name the shortcut itself.
    if (!/shortcut/i.test(this.text)) {
      throw new Error("entry must be the GPS excusing the shortcut");
    }
    // GPS voice: it recalculates, even its own trust.
    if (!/Recalculating/i.test(this.text)) {
      throw new Error("entry must sound like the GPS itself");
    }
  }

  save(): string {
    this.validate();
    const target = join(OUTPUT_DIR, "entry.txt");
    mkdirSync(OUTPUT_DIR, { recursive: true });
    writeFileSync(target, this.text + "\n", "utf8");
    return target;
  }
}

const excuse = new GpsExcuse(EXCUSE);
const target = excuse.save();
console.log(`${excuse.length} chars -> ${target}`);
console.log(excuse.text);
