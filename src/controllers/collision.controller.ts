import { Box2, Vector2 } from "threejs-math";
import { Singleton } from "../abstract/singleton";

interface BVHObject {
  aabb: Box2;
  data: any;
}

class BVHNode {
  id: number;
  aabb: Box2;
  parent: BVHNode | null = null;
  left: BVHNode | null = null;
  right: BVHNode | null = null;
  object: BVHObject | null = null;

  constructor(id: number, aabb?: Box2, object?: BVHObject) {
    this.id = id;
    this.aabb = aabb ? aabb.clone() : new Box2();
    if (object) {
      this.object = object;
      this.aabb.copy(object.aabb);
    }
  }

  isLeaf() {
    return this.object !== null;
  }
}

export class CollisionController extends Singleton {
  private root: BVHNode | null = null;
  private nodes = new Map<number, BVHNode>();
  private nextId = 1;

  // Optimization configs
  fatAABBMargin = 15;
  updateThreshold = 10;

  // Temporary reused AABBs for performance
  private tmpBox1 = new Box2();
  private tmpBox2 = new Box2();

  constructor() {
    super();
  }

  insert(obj: BVHObject): number {
    const id = this.nextId++;
    const fatAABB = obj.aabb.clone().expandByScalar(this.fatAABBMargin);
    const node = new BVHNode(id, fatAABB, {
      aabb: fatAABB.clone(),
      data: obj.data,
    });

    this.nodes.set(id, node);
    this.insertNode(node);
    return id;
  }

  remove(id: number): boolean {
    const node = this.nodes.get(id);
    if (!node) {
      throw new Error(`Node with id ${id} not found while removing!`);
    }

    this.removeNode(node);
    this.nodes.delete(id);
    return true;
  }

  update(id: number, newAABB: Box2): boolean {
    const node = this.nodes.get(id);
    if (!node) {
      throw new Error(`Node with id ${id} not found while updating!`);
    }

    // Only update if newAABB is outside fat AABB
    if (node.aabb.containsBox(newAABB)) return true;

    // Check surface area change threshold
    const oldArea = this.surfaceArea(node.aabb);
    const newPadded = newAABB.clone().expandByScalar(this.fatAABBMargin);
    const newArea = this.surfaceArea(newPadded);

    // Check position change threshold
    const deltaPosition = node.aabb
      .getCenter()
      .distanceToSquared(newAABB.getCenter());

    // Check position change threshold
    const deltaArea = Math.abs(newArea - oldArea);

    if (
      deltaArea < this.updateThreshold &&
      deltaPosition < this.updateThreshold
    ) {
      return true;
    }

    this.removeNode(node);
    node.aabb.copy(newAABB);
    if (node.object) node.object.aabb.copy(newAABB);
    this.insertNode(node);
    return true;
  }

  get(id: number): BVHObject | null {
    const node = this.nodes.get(id);
    return node?.object ?? null;
  }

  query(aabb: Box2, callback: (obj: BVHObject) => void) {
    const stack: (BVHNode | null)[] = [this.root];
    while (stack.length) {
      const node = stack.pop();
      if (!node) continue;
      if (!node.aabb.intersectsBox(aabb)) continue;

      if (node.isLeaf()) {
        callback(node.object!);
      } else {
        stack.push(node.left, node.right);
      }
    }
  }

  countObjects(): number {
    return this.nodes.size;
  }

  /** ⚙ Optional: Rebuilds entire tree for balancing (O(n log n)) */
  rebuild() {
    const objects = Array.from(this.nodes.values()).map((n) => n.object!);
    this.root = null;
    this.nodes.clear();
    this.nextId = 1;
    for (const obj of objects) {
      obj.data.nodeId = this.insert(obj);
    }
  }

  // --- Internal Methods ---

  private insertNode(node: BVHNode) {
    if (!this.root) {
      this.root = node;
      return;
    }

    let current = this.root;

    while (!current.isLeaf()) {
      const left = current.left!;
      const right = current.right!;

      this.tmpBox1.copy(left.aabb).union(node.aabb);
      this.tmpBox2.copy(right.aabb).union(node.aabb);

      const costLeft = this.surfaceArea(this.tmpBox1);
      const costRight = this.surfaceArea(this.tmpBox2);

      current = costLeft < costRight ? left : right;
    }

    const oldParent = current.parent;
    const newParent = new BVHNode(-1, current.aabb.clone().union(node.aabb));
    newParent.left = current;
    newParent.right = node;
    newParent.parent = oldParent;

    current.parent = newParent;
    node.parent = newParent;

    if (!oldParent) {
      this.root = newParent;
    } else {
      if (oldParent.left === current) oldParent.left = newParent;
      else oldParent.right = newParent;
    }

    this.updateHierarchy(newParent);
  }

  private removeNode(node: BVHNode) {
    if (!node.parent) {
      this.root = null;
      return;
    }

    const parent = node.parent;
    const sibling = parent.left === node ? parent.right : parent.left;

    if (!sibling) {
      this.root = null;
    } else {
      sibling.parent = parent.parent;
      if (!parent.parent) {
        this.root = sibling;
      } else {
        if (parent.parent.left === parent) parent.parent.left = sibling;
        else parent.parent.right = sibling;
        this.updateHierarchy(parent.parent);
      }
    }
  }

  private updateHierarchy(start: BVHNode | null) {
    while (start) {
      const left = start.left;
      const right = start.right;
      start.aabb.makeEmpty();
      if (left) start.aabb.union(left.aabb);
      if (right) start.aabb.union(right.aabb);
      start = start.parent;
    }
  }

  private surfaceArea(box: Box2): number {
    const size = new Vector2();
    box.getSize(size);
    return size.x * size.y;
  }
}
