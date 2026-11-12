import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

const MAX_SIDE = 1280;

/**
 * Makes a photo small enough for weak mobile data: longest side 1280px, JPEG at 70%.
 * A phone camera photo of 3 to 5 MB becomes about 200 to 400 KB. If anything fails, the original photo is sent.
 */
export async function shrinkImage(uri: string): Promise<string> {
  try {
    const original = await ImageManipulator.manipulate(uri).renderAsync();
    const longest = Math.max(original.width, original.height);
    let context = ImageManipulator.manipulate(uri);
    if (longest > MAX_SIDE) {
      context = original.width >= original.height ? context.resize({ width: MAX_SIDE }) : context.resize({ height: MAX_SIDE });
    }
    const result = await (await context.renderAsync()).saveAsync({ compress: 0.7, format: SaveFormat.JPEG });
    return result.uri;
  } catch (error) {
    console.warn("Could not shrink the photo, sending the original", error);
    return uri;
  }
}
