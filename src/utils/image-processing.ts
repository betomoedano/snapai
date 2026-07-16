import sharp from "sharp";

export async function resizeToFeatureGraphic(
  inputBuffer: Buffer,
  format: "png" | "jpeg"
): Promise<Buffer> {
  let pipeline = sharp(inputBuffer)
    .resize(1024, 500, { fit: "cover", position: "centre" })
    .flatten({ background: "#ffffff" });

  if (format === "jpeg") {
    pipeline = pipeline.jpeg({ quality: 95 });
  } else {
    pipeline = pipeline.png();
  }

  return pipeline.toBuffer();
}

export async function compositeLogoOnBanner(
  bannerBuffer: Buffer,
  logoPath: string,
  position: "left" | "center" | "right" = "left"
): Promise<Buffer> {
  const resizedLogo = await sharp(logoPath)
    .resize(120, 120, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const gravityMap: Record<string, string> = {
    left: "west",
    center: "centre",
    right: "east",
  };

  return sharp(bannerBuffer)
    .composite([
      {
        input: resizedLogo,
        gravity: gravityMap[position] as any,
      },
    ])
    .toBuffer();
}
