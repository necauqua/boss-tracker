import { MOD_ID } from "$mod";
import mod from "@noita-ts/base";
import nxml from "@noita-ts/nxml";
import { bosses, bossKilled, countBosses } from "./lib";
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

  if (ui_setup === "short-todo") {
    if (count === bosses.length) {
      return;
    }

    const gap = mod.settings.gap;
    const [_1, _2, _3, lastX, y, lastWidth] = GuiGetPreviousWidgetInfo(gui);

    let x = lastX + lastWidth + 3;
    for (const boss of bosses) {
      if (!bossKilled(boss.flag)) {
        GuiImage(gui, y, x, y + 1, boss.icon, 1, 1);
        x += 8 + gap;
      }
    }
    return;
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

      y += 10;

      GuiImage(gui, y, 15, y + 1, boss.icon, 1, 1);
      GuiText(gui, 25, y, tf(boss.names, boss.community_name));
    }
    return;
  }

  const x = 15;
  for (const boss of bosses) {
    y += 10;

    // manually offseting the text as space and 'x' have different widths in noitapixel
    //  (and x is way too wide lol)

    const DrawSemiTransparent = 26;

    if (bossKilled(boss.flag)) {
      GuiOptionsAdd(gui, DrawSemiTransparent);

      GuiText(gui, x, y, `[`);
      GuiText(gui, x + 5, y, "x]");
      GuiImage(gui, y, x + 16, y + 1, boss.icon, 0.25, 1);
      GuiText(gui, x + 26, y, t(boss.names, boss.community_name));

      GuiOptionsRemove(gui, DrawSemiTransparent);
    } else {
      GuiText(gui, x, y, "[");
      GuiText(gui, x + 9, y, "]");
      GuiImage(gui, y, x + 16, y + 1, boss.icon, 1, 1);
      GuiText(gui, x + 26, y, tf(boss.names, boss.community_name));
    }
  }
};

mod.on("WorldPostUpdate", () => {
  if (!GameIsInventoryOpen()) render(mod.settings.ingame_ui, 35);
});
mod.on("PausePreUpdate", () => render(mod.settings.paused_ui));
