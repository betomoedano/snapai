import fs from "fs-extra";
import path from "path";

export async function saveBase64Images(
  base64DataArray: string[],
  outputDir: string,
  outputFormat: string,
  filenamePrefix: string = "icon"
): Promise<string[]> {
  await fs.ensureDir(outputDir);

  const outputPaths: string[] = [];
  const timestamp = Date.now();

  for (let i = 0; i < base64DataArray.length; i++) {
    const base64Data = base64DataArray[i];
    const extension = outputFormat || "png";
    const filename =
      base64DataArray.length === 1
        ? `${filenamePrefix}-${timestamp}.${extension}`
        : `${filenamePrefix}-${timestamp}-${i + 1}.${extension}`;
    const outputPath = path.join(outputDir, filename);

    const buffer = Buffer.from(base64Data, "base64");
    await fs.writeFile(outputPath, buffer);

    outputPaths.push(outputPath);
  }

  return outputPaths;
}

export async function saveBinaryImages(
  images: Array<{ base64: string; extension: string }>,
  outputDir: string,
  filenamePrefix: string = "icon"
): Promise<string[]> {
  await fs.ensureDir(outputDir);
  const outputPaths: string[] = [];
  const timestamp = Date.now();

  for (let i = 0; i < images.length; i++) {
    const { base64, extension } = images[i];
    const filename =
      images.length === 1
        ? `${filenamePrefix}-${timestamp}.${extension}`
        : `${filenamePrefix}-${timestamp}-${i + 1}.${extension}`;
    const outputPath = path.join(outputDir, filename);
    const buffer = Buffer.from(base64, "base64");
    await fs.writeFile(outputPath, buffer);
    outputPaths.push(outputPath);
  }

  return outputPaths;
}
