import { MOD_ID } from "$mod";

const mkBoss = (name: string, community_name: string, xml: string) => ({
  flag: `$animal_${name}`,
  community_name,
  names: [`$animal_${name}`],
  xml_files: [`data/entities/animals/${xml}.xml`],
  icon: `mods/${MOD_ID}/icons/${name}.png`,
});

const gateBoss = {
  flag: "$animal_gate_monster",
  community_name: "Triangle/Gate",
  names: [
    "$animal_gate_monster_a",
    "$animal_gate_monster_b",
    "$animal_gate_monster_c",
    "$animal_gate_monster_d",
  ],
  xml_files: [
    "data/entities/animals/boss_gate/gate_monster_a.xml",
    "data/entities/animals/boss_gate/gate_monster_b.xml",
    "data/entities/animals/boss_gate/gate_monster_c.xml",
    "data/entities/animals/boss_gate/gate_monster_d.xml",
  ],
  icon: `mods/${MOD_ID}/icons/gate_monster.png`,
};

export const bosses = [
  mkBoss("boss_alchemist", "Alchemist", "boss_alchemist/boss_alchemist"),
  mkBoss("boss_dragon", "Dragon", "boss_dragon"),
  gateBoss,
  mkBoss("boss_centipede", "Kolmi", "boss_centipede/boss_centipede"),
  mkBoss("boss_wizard", "Master of Masters", "boss_wizard/boss_wizard"),
  mkBoss("maggot_tiny", "Tiny/Maggot", "maggot_tiny/maggot_tiny"),
  mkBoss("boss_robot", "Mecha-Kolmi", "boss_robot/boss_robot"),
  mkBoss("boss_meat", "Meatball", "boss_meat/boss_meat"),
  mkBoss("boss_limbs", "Pyramid/Spider", "boss_limbs/boss_limbs"),
  mkBoss("boss_pit", "Squidward/Pit", "boss_pit/boss_pit"),
  mkBoss("fish_giga", "Leviathan", "boss_fish/fish_giga"),
  mkBoss("boss_ghost", "Forgotten/Ghost", "boss_ghost/boss_ghost"),
  mkBoss("friend", "Friend", "friend"),
  mkBoss("islandspirit", "Deer", "boss_spirit/islandspirit"),
  mkBoss("boss_sky", "Rock", "boss_sky/boss_sky"),
];

export const bossKilled = (name: string) =>
  (GlobalsGetValue(`${MOD_ID}.killed.${name}`, "0") as any as string) !== "0";

export const countBosses = () =>
  bosses.filter(({ flag }) => bossKilled(flag)).length;

export const trackBoss = (name: string) => {
  if (bossKilled(name)) {
    return false;
  }

  GlobalsSetValue(`${MOD_ID}.killed.${name}`, "1");

  return (
    !gateBoss.names.includes(name) ||
    gateBoss.names.every((name) => bossKilled(name))
  );
};
