export interface Alive {
  health: number;
  maxHealth: number;
  getHealth(): number;
  takeDamage(amount: number): void;
  isAlive(): boolean;
}
