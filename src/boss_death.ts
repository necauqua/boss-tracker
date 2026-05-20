import { bosses, countBosses, trackBoss } from "./lib";

(globalThis as any).death = () => {
  if (!trackBoss(EntityGetName(GetUpdatedEntityID()))) {
    return;
  }
  const remain = bosses.length - countBosses();
  GamePrintImportant(
    "A boss was slain",
    remain > 0 ? `Only ${remain} remain` : "It has been done",
  );
};
