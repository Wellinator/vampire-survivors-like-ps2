import { Alive } from "./alive.abstract";

export interface Hostile {
  damage: number;
  applyDamage(target: Alive): void;
}
