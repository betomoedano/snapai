export function buildFinalIconPrompt(params: {
  prompt: string;
  rawPrompt?: boolean;
  style?: string;
  squareOnly?: boolean;
  sizeHint?: string;
  useIconWords?: boolean;
}): string {
  const {
    prompt,
    rawPrompt = false,
    style,
    squareOnly = false,
    sizeHint,
    useIconWords = false,
  } = params;

  if (rawPrompt) {
    return style ? `${prompt}\nStyle: ${style}.` : prompt;
  }

  const sizeText = sizeHint ? sizeHint : "1024x1024";
  const squareText = squareOnly ? "Square (1:1) aspect ratio only. " : "";
  const artworkNoun = useIconWords ? "app icon" : "square app artwork";

  const enhanced =
    `Create a full-bleed ${sizeText} ${artworkNoun}: ${prompt}. ` +
    `${squareText}` +
    `Use crisp, minimal design with a bold, readable silhouette. ` +
    `No text. No watermark. No border. No frame. No outer drop shadow. ` +
    `No padding and no margin: the background must touch all 4 edges. ` +
    `Avoid a "sticker" / "badge" / "floating logo" look. ` +
    `The main subject should occupy about 85–95% of the canvas area (cropped/expanded if needed) so there is no big empty border. ` +
    `Clean shapes, high contrast, and Apple-native simplicity.`;

  return style ? `${enhanced}\nStyle: ${style}.` : enhanced;
}

