import {
  Circle,
  Indexable,
  Line,
  Quadtree,
  Rectangle,
} from "@timohausmann/quadtree-ts";

export type Collidable = Indexable | Rectangle | Circle | Line;

export abstract class CollisionController<T extends Indexable> {
  protected quadTree: Quadtree<T>;

  constructor() {
    this.quadTree = new Quadtree({
      width: 2000,
      height: 2000,
      maxObjects: 4,
    });
  }

  protected insert(object: T) {
    this.quadTree.insert(object);
  }

  protected clear(): void {
    this.quadTree.clear();
  }

  public intersects(query: Collidable): Array<T> {
    return this.quadTree.retrieve(query);
  }
}
