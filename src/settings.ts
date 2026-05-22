declare global {
  interface SettingsShape extends ExtractSettings<
    typeof import("./settings")
  > {}
}

const ui_setups = [
  ["none", "None"],
  ["short-todo", "List remaining bosses icons only"],
  ["todo", "List remaining bosses"],
  ["checkmarks", "List all bosses with checkmarks"],
] as const satisfies [string, string][];

export type UiSetup = (typeof ui_setups)[number][0];

const use_community_names: ModSettingCheckbox & { id: "use_community_names" } =
  {
    id: "use_community_names",
    ui_name: "Use Community Names",
    ui_description: "Toggle the use of community names for bosses",
    value_default: false,
    scope: ModSettingScope.Runtime,
  };

const gap: ModSettingSlider & { id: "gap" } = {
  id: "gap",
  ui_name: "Gap",
  ui_description: "Set the gap between boss icons in the icon-only UI",
  value_default: 1,
  value_min: 0,
  value_max: 100,
  scope: ModSettingScope.Runtime,
};

let ingameUi = "short-todo";
let pausedUi = "checkmarks";

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
      ingameUi = new_value;
      gap.hidden = !(new_value == "short-todo" || pausedUi == "short-todo");
      use_community_names.hidden =
        (new_value == "none" || new_value == "short-todo") &&
        (pausedUi == "none" || pausedUi == "short-todo");
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
      pausedUi = new_value;
      gap.hidden = !(new_value == "short-todo" || ingameUi == "short-todo");
      use_community_names.hidden =
        (new_value == "none" || new_value == "short-todo") &&
        (ingameUi == "none" || ingameUi == "short-todo");
    },
  },
  use_community_names,
  gap,
] as const satisfies ModSetting[];
