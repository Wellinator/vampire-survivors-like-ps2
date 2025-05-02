import TextureManager from "../texture_manager";
import { Weapon, Weapons } from "./weapon.abstract";
import { Projectile } from "../projectile/projectile.abstract";
import { Ball } from "../projectile/ball";
import { Player } from "../player";
import { Enemy } from "../enemies/enemy";

export class BaseballBat extends Weapon {
  private TextureRepository = {
    Ball: 0,
  };

  constructor() {
    const name = "Ball";
    const cooldown = 1000.0;
    const damage = 10.0;
    const range = 1.0;
    const speed = 20.0;

    super(name, damage, cooldown, range, speed);
    this.type = Weapons.BaseballBat;
    this.registerTextures();
  }

  registerTextures(): void {
    const textureManager = TextureManager.getInstance();
    this.TextureRepository.Ball = textureManager.loadTexture(
      "./assets/sprites/weapons/weapon-basebasell.png"
    );
  }

  update(deltaTime: number): void {
    this.reduceCooldown(deltaTime);
  }

  fixedUpdate(fixedDeltaTime: number): void {}

  resetCooldown(): void {
    this.cooldown = 1000.0;
  }

  attack(player: Player, target: Enemy): Projectile {
    console.log("Attacking rand enemy...");
    this.resetCooldown();

    const projectile = new Ball(
      this.TextureRepository.Ball,
      this.damage,
      this.range,
      this.speed
    );

    projectile.position = player.position.clone();
    projectile.direction = target.position
      .clone()
      .sub(projectile.position)
      .normalize();

    return projectile;
  }
}
