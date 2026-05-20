declare global {
  interface SettingsShape extends ExtractSettings<
    typeof import("./settings")
  > {}
}

export type UiSetup = "none" | "todo" | "checkmarks";

const ui_setups = [
  ["none", "None"],
  ["todo", "List remaining bosses"],
  ["checkmarks", "List all bosses with checkmarks"],
] as [UiSetup, string][];

export default [
  {
    id: "ingame_ui",
    ui_name: "In-game UI",
    ui_description:
      "Choose the way of showing the boss list when the game is not paused",
    values: ui_setups,
    value_default: "none",
    scope: ModSettingScope.Runtime,
  },
  {
    id: "paused_ui",
    ui_name: "Paused UI",
    ui_description:
      "Choose the way of showing the boss list when the game is paused",
    values: ui_setups,
    value_default: "checkmarks",
    scope: ModSettingScope.Runtime,
  },
  {
    id: "use_community_names",
    ui_name: "Use Community Names",
    ui_description: "Toggle the use of community names for bosses",
    value_default: false,
    scope: ModSettingScope.Runtime,
  },
] as const satisfies ModSetting[];
