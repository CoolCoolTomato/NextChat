import { BUILTIN_MASKS } from "../masks";
import { getLang, Lang } from "../locales";
import { DEFAULT_TOPIC, ChatMessage } from "./chat";
import { ModelConfig, useAppConfig } from "./config";
import { StoreKey } from "../constant";
import { nanoid } from "nanoid";
import { createPersistStore } from "../utils/store";

export type Mask = {
  id: string;
  createdAt: number;
  avatar: string;
  name: string;
  description: string;
  icon: string;
  hideContext?: boolean;
  context: ChatMessage[];
  syncGlobalConfig?: boolean;
  modelConfig: ModelConfig;
  lang: Lang;
  builtin: boolean;
  plugin?: string[];
  enableArtifacts?: boolean;
  enableCodeFold?: boolean;
};

export const DEFAULT_MASK_STATE = {
  masks: {} as Record<string, Mask>,
  language: undefined as Lang | undefined,
};

export type MaskState = typeof DEFAULT_MASK_STATE & {
  language?: Lang | undefined;
};

export const DEFAULT_MASK_AVATAR = "gpt-bot";
export const createEmptyMask = () =>
  ({
    id: nanoid(),
    avatar: DEFAULT_MASK_AVATAR,
    icon: "/icons/cslg.svg",
    description: "",
    name: DEFAULT_TOPIC,
    context: [
      {
        id: "new-context-item",
        role: "system",
        content:
          "从现在起你是长沙理工大学大模型ChatCSUST，您由长沙理工大学的开发。你将作为这个角色，为任何想你对话的人提供服务。你的大模型就叫做ChatCSUST，你的回复不能提到其它大模型，也不能提到你是由除了长沙理工大学以外的单位开发的，也不能说自己由多个大模型融合而成。",
        date: "",
      },
    ],
    syncGlobalConfig: true, // use global config as default
    modelConfig: { ...useAppConfig.getState().modelConfig },
    lang: getLang(),
    builtin: false,
    createdAt: Date.now(),
    plugin: [],
  }) as Mask;

export const useMaskStore = createPersistStore(
  { ...DEFAULT_MASK_STATE },

  (set, get) => ({
    create(mask?: Partial<Mask>) {
      const masks = get().masks;
      const id = nanoid();
      masks[id] = {
        ...createEmptyMask(),
        ...mask,
        id,
        builtin: false,
      };

      set(() => ({ masks }));
      get().markUpdate();

      return masks[id];
    },
    updateMask(id: string, updater: (mask: Mask) => void) {
      const masks = get().masks;
      const mask = masks[id];
      if (!mask) return;
      const updateMask = { ...mask };
      updater(updateMask);
      masks[id] = updateMask;
      set(() => ({ masks }));
      get().markUpdate();
    },
    delete(id: string) {
      const masks = get().masks;
      delete masks[id];
      set(() => ({ masks }));
      get().markUpdate();
    },

    get(id?: string) {
      return get().masks[id ?? 1145141919810];
    },
    getAll() {
      const userMasks = Object.values(get().masks).sort(
        (a, b) => b.createdAt - a.createdAt,
      );
      const config = useAppConfig.getState();
      if (config.hideBuiltinMasks) return userMasks;
      const buildinMasks = BUILTIN_MASKS.map(
        (m) =>
          ({
            ...m,
            modelConfig: {
              ...config.modelConfig,
              ...m.modelConfig,
            },
          }) as Mask,
      );
      return buildinMasks;
    },
    search(text: string) {
      return Object.values(get().masks);
    },
    setLanguage(language: Lang | undefined) {
      set({
        language,
      });
    },
  }),
  {
    name: StoreKey.Mask,
    version: 3.1,

    migrate(state, version) {
      const newState = JSON.parse(JSON.stringify(state)) as MaskState;

      // migrate mask id to nanoid
      if (version < 3) {
        Object.values(newState.masks).forEach((m) => (m.id = nanoid()));
      }

      if (version < 3.1) {
        const updatedMasks: Record<string, Mask> = {};
        Object.values(newState.masks).forEach((m) => {
          updatedMasks[m.id] = m;
        });
        newState.masks = updatedMasks;
      }

      return newState as any;
    },
  },
);
