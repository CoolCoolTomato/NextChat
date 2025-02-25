import fs from "fs";
import path from "path";
import { CN_MASKS } from "./cn";
// import { TW_MASKS } from "./tw";
// import { EN_MASKS } from "./en";
import { CSLG_MASKS } from "./cslg";

import { type BuiltinMask } from "./typing";

const BUILTIN_MASKS: Record<string, BuiltinMask[]> = {
  cn: CN_MASKS,
  // tw: TW_MASKS,
  // en: EN_MASKS,
};

const BUILTIN_CSLG_MASKS: Record<string, BuiltinMask[]> = {
  cn: CSLG_MASKS,
};

const dirname = path.dirname(__filename);

fs.writeFile(
  dirname + "/../../public/masks.json",
  JSON.stringify(BUILTIN_MASKS, null, 4),
  function (error) {
    if (error) {
      console.error("[Build] failed to build masks", error);
    }
  },
);

fs.writeFile(
  dirname + "/../../public/cslg.json",
  JSON.stringify(BUILTIN_CSLG_MASKS, null, 4),
  function (error) {
    if (error) {
      console.error("[Build] failed to build masks", error);
    }
  },
);
