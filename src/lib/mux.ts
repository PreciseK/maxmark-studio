type ThumbnailOptions = {
  time?: number;
  width?: number;
  height?: number;
  fitMode?: "preserve" | "stretch" | "crop" | "smartcrop" | "pad";
};

export function getMuxThumbnail(
  playbackId: string,
  options: ThumbnailOptions = {},
): string {
  const { time = 0, width = 1280, height, fitMode = "crop" } = options;
  const params = new URLSearchParams({
    time: String(time),
    width: String(width),
    fit_mode: fitMode,
  });
  if (height) params.set("height", String(height));
  return `https://image.mux.com/${playbackId}/thumbnail.webp?${params.toString()}`;
}
