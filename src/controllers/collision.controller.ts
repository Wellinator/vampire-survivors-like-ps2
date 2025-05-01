import { Singleton } from "../abstract/singleton";
import {
  Circle,
  Line,
  Quadtree,
  Rectangle,
  Indexable,
} from "@timohausmann/quadtree-ts";

export type Collidable = Rectangle | Circle | Line | Indexable;

export class CollisionController extends Singleton {
  private quadTree: Quadtree<any>;

  constructor() {
    super();
    this.quadTree = new Quadtree({
      width: 2000,
      height: 2000,
      maxObjects: 4,
    });
  }

  public insert(object: Collidable) {
    this.quadTree.insert(object);
  }

  public reset(): void {
    this.quadTree.clear();
  }

  public query(query: Collidable): Array<Collidable> {
    return this.quadTree.retrieve(query);
  }
}
