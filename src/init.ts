import { MOD_ID } from "$mod";
import mod from "@noita-ts/base";
import nxml from "@noita-ts/nxml";
import { bosses, countBosses, bossKilled } from "./lib";
import type { UiSetup } from "./settings";

for (const { xml_files } of bosses) {
  for (const xml_file of xml_files) {
    const tree = nxml.parse_file(xml_file);
    tree.create_child("LuaComponent", {
      script_death: `mods/${MOD_ID}/boss_death.lua`,
      execute_every_n_frame: -1,
    });
    ModTextFileSetContent(xml_file, tostring(tree));
  }
}

let gui: GuiID | null = null;

const translate = (names: string[], _community_name: string) => {
  const parts = names.map((n) => GameTextGetTranslatedOrNot(n));
  if (parts.length <= 1) return parts[1] ?? "";
  if (parts.length === 2) return `${parts[1]} and ${parts[2]}`;
  return `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}`;
};

const translateFunny = (names: string[], community_name: string) => {
  if (names.length !== 1) {
    const aliveNames = names.filter((name) => !bossKilled(name));
    if (aliveNames.length != 0) {
      names = aliveNames;
    }
  }
  return translate(names, community_name);
};

const render = (ui_setup: UiSetup, y: number = 10) => {
  GuiStartFrame((gui ??= GuiCreate()));

  const count = countBosses();
  GuiText(gui, 10, 10, `Bosses killed: ${count}`);

  if (ui_setup === "none") {
    return;
  }

  let t = translate;
  let tf = translateFunny;

  if (mod.settings.use_community_names) {
    t = tf = (_, c) => c;
  }

  if (ui_setup === "todo") {
    if (count === bosses.length) {
      return;
    }

    y += 10;
    GuiOptionsAddForNextWidget(gui, 26); // DrawSemiTransparent
    GuiText(gui, 10, y, `Remaining:`);

    for (const boss of bosses) {
      if (bossKilled(boss.flag)) {
        continue;
      }

      const name = tf(boss.names, boss.community_name);
      y += 10;
      GuiText(gui, 15, y, `${name}`);
    }
    return;
  }

  for (const boss of bosses) {
    y += 10;

    if (bossKilled(boss.flag)) {
      GuiOptionsAddForNextWidget(gui, 26); // DrawSemiTransparent
      GuiText(gui, 15, y, `[x] ${t(boss.names, boss.community_name)}`);
    } else {
      // manually offset the text as space and 'x' have different widths in noitapixel
      GuiText(gui, 15, y, `[`);
      GuiText(gui, 23, y, `] ${tf(boss.names, boss.community_name)}`);
    }
  }
};

mod.on("WorldPostUpdate", () => {
  if (!GameIsInventoryOpen()) render(mod.settings.ingame_ui, 35);
});
mod.on("PausePreUpdate", () => render(mod.settings.paused_ui));
