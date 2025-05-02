export interface Alive {
  health: number;
  getHealth(): number;
  takeDamage(amount: number): void;
  isAlive(): boolean;
}
