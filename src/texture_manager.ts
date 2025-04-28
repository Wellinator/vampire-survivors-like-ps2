import { Singleton } from "./abstract/singleton";

type TextureID = number;

class TextureManager extends Singleton {
  private textures: Map<TextureID, Image> = new Map();
  private pathToID: Map<string, TextureID> = new Map();
  private nextID: TextureID = 1;

  constructor() {
    super();
  }

  /**
   * Loads a texture by its path and returns its ID.
   * If the texture is already loaded, returns the existing ID.
   * @param path The path to the texture file.
   * @returns The ID of the loaded texture.
   */
  loadTexture(path: string): TextureID {
    if (this.pathToID.has(path)) {
      return this.pathToID.get(path)!;
    }

    const texture = new Image(path);

    const id = this.nextID++;
    this.textures.set(id, texture);
    this.pathToID.set(path, id);

    return id;
  }

  /**
   * Retrieves a texture by its ID.
   * @param id The ID of the texture.
   * @returns The texture associated with the ID, or undefined if not found.
   */
  getTexture(id: TextureID): Image {
    if (!this.textures.has(id)) {
      throw new Error(`Texture not found for id: ${id}!`);
    }

    return this.textures.get(id);
  }
}

export default TextureManager;

export const g_TextureManager = TextureManager.getInstance();
