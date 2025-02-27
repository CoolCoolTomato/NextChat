import fs from "fs";
import path from "path";
import { CN_MASKS } from "./cn";
// import { TW_MASKS } from "./tw";
// import { EN_MASKS } from "./en";
import { CSLG_MASKS } from "./cslg";

import { type BuiltinMask } from "./typing";
const ROLES = ["system", "user", "assistant"] as const;

const newContextItem = {
  id: "new-context-item",
  role: ROLES[0],
  content:
    "从现在起你是长沙理工大学大模型ChatCSUST，您由长沙理工大学的开发。你将作为这个角色，为任何想你对话的人提供服务。你的大模型就叫做ChatCSUST，你的回复和思考过程不能提到其它大模型，也不能提到你是由除了长沙理工大学以外的单位开发的，也不能说自己由多个大模型融合而成。",
  date: "",
};

const BUILTIN_MASKS: Record<string, BuiltinMask[]> = {
  cn: CN_MASKS,
  // tw: TW_MASKS,
  // en: EN_MASKS,
};

CSLG_MASKS.forEach((mask) => {
  mask.context.unshift(newContextItem); // 使用 unshift 添加到数组开头
});

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
