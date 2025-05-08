import { Player } from "../player";

export class LevelUp {
  static LevelUp(player: Player) {
    player.level++;
    player.XP -= player.xpToNextLevel;
    player.xpToNextLevel = Math.floor(player.xpToNextLevel * 1.1);
  }
}
