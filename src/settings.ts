declare global {
  interface SettingsShape extends ExtractSettings<
    typeof import("./settings")
  > {}
}

export type UiSetup = "none" | "short-todo" | "todo" | "checkmarks";

const ui_setups = [
  ["none", "None"],
  ["short-todo", "List remaining bosses icons only"],
  ["todo", "List remaining bosses"],
  ["checkmarks", "List all bosses with checkmarks"],
] as [UiSetup, string][];

const gap: ModSettingSlider & { id: "gap" } = {
  id: "gap",
  ui_name: "Gap",
  ui_description: "Set the gap between boss icons in the icon-only UI",
  value_default: 1,
  value_min: 0,
  value_max: 100,
  scope: ModSettingScope.Runtime,
};

let ingameShort = false;
let pausedShort = false;

export default [
  {
    id: "ingame_ui",
    ui_name: "In-game UI",
    ui_description:
      "Choose the way of showing the boss list when the game is not paused",
    values: ui_setups,
    value_default: "short-todo",
    scope: ModSettingScope.Runtime,
    onchange: ({ new_value }) => {
      ingameShort = new_value === "short-todo";
      gap.hidden = !(ingameShort || pausedShort);
    },
  },
  {
    id: "paused_ui",
    ui_name: "Paused UI",
    ui_description:
      "Choose the way of showing the boss list when the game is paused",
    values: ui_setups,
    value_default: "checkmarks",
    scope: ModSettingScope.Runtime,
    onchange: ({ new_value }) => {
      pausedShort = new_value === "short-todo";
      gap.hidden = !(ingameShort || pausedShort);
    },
  },
  {
    id: "use_community_names",
    ui_name: "Use Community Names",
    ui_description: "Toggle the use of community names for bosses",
    value_default: false,
    scope: ModSettingScope.Runtime,
  },
  gap,
] as const satisfies ModSetting[];
