import { Vector2 } from "threejs-math";
import TextureManager from "../texture_manager";
import {
  Collectable,
  CollectableType,
} from "../collectables/collectable.abstract";
import { ExperienceOrb } from "../collectables/experience-orb";
import { Camera2D } from "../camera";
import { Collidable, CollisionController } from "./collision.controller";

export class CollectableController extends CollisionController<Collectable> {
  private id_counter: number = 1;
  private collectables: Collectable[] = [];

  private TextureRepository = {
    Coin: 0,
    BlueCoin: 0,
  };

  constructor() {
    super();
    this.registerTextures();
  }

  get counter(): number {
    return this.collectables.length;
  }

  private registerTextures(): void {
    const tm = TextureManager.getInstance<TextureManager>();
    this.TextureRepository.Coin = tm.loadTexture(
      "./assets/sprites/xp/coin.png"
    );
    this.TextureRepository.BlueCoin = tm.loadTexture(
      "./assets/sprites/xp/blue-coin.png"
    );
  }

  public add(type: CollectableType, position: Vector2): Collectable {
    let collectable: Collectable;

    switch (type) {
      case CollectableType.Xp:
        collectable = new ExperienceOrb(position);
        collectable.textureId = this.TextureRepository.Coin;
        break;
      default:
        throw new Error(`Invalid collectable type: ${type}`);
    }

    collectable.id = this.id_counter++;
    this.collectables.push(collectable);

    return collectable;
  }

  remove(collectableId: number): void {
    const i = this.collectables.findIndex((e) => e.id === collectableId);
    if (i > -1) {
      this.collectables.splice(i, 1);
    }
  }

  update(deltaTime: number): void {
    for (let i = 0; i < this.collectables.length; i++) {
      if (this.collectables[i].collected == true) continue;
      this.collectables[i].update(deltaTime);
    }
  }

  fixedUpdate(fixedDeltaTime: number): void {
    this.clear();

    for (let i = 0; i < this.collectables.length; i++) {
      if (this.collectables[i].collected == true) continue;
      this.collectables[i].fixedUpdate(fixedDeltaTime);
      this.insert(this.collectables[i]);
    }
  }

  render(): void {
    console.log(this.TextureRepository.Coin);

    for (let i = 0; i < this.collectables.length; i++) {
      const collectable = this.collectables[i];
      if (collectable.collected == true) continue;

      const sprite = TextureManager.getInstance<TextureManager>().getTexture(
        collectable.textureId
      );
      sprite.width = collectable.tileSize.x;
      sprite.height = collectable.tileSize.y;

      const pos = Camera2D.toScreenSpace(collectable.position).sub(
        collectable.size.clone().divideScalar(2)
      );

      sprite.draw(pos.x, pos.y);
    }
  }

  clearAll(): void {
    this.collectables = [];
  }
}
