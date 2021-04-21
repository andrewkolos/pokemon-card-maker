export function calculateAspectRatioFit({ height, width, maxWidth, maxHeight }: { height: number, width: number, maxWidth: number, maxHeight: number }) {
  const ratio = Math.min(maxWidth / width, maxHeight / height);
  return {
    width: width * ratio,
    height: height * ratio,
  };
};
