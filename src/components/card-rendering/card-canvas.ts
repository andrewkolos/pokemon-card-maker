import { calculateAspectRatioFit } from './calculate-card-aspect-ratio-fit';

export interface RenderTextArgs {
  x: number;
  y: number;
  text: string;
  fontName: string;
  fontSize: number;
  color: string;
  maxWidth: number;
  stroke?: {
    color: string;
    width: number;
  };
  wrap?: {
    baselineY: number;
  };
}

const cardWidth = 747;
const cardHeight = 1038;

export class CardCanvas {
  private static ImageCache = new Map<string, HTMLImageElement>();
  private readonly canvas: HTMLCanvasElement;

  private pendingOperations: Promise<unknown>[] = [];

  public constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = cardWidth;
    this.canvas.height = cardHeight;
    const context = this.canvas.getContext('2d')!;
    context.fillStyle = '#cdcdcd';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  public async drawText(args: RenderTextArgs): Promise<number> {
    await this.awaitPendingOperations();

    // TODO: narrow type of fontName to a specific set of names.
    const ctx = this.canvas.getContext('2d')!;

    ctx.font = `${args.fontSize}px ${args.fontName}`;
    if (args.stroke) {
      ctx.strokeStyle = args.stroke.color;
      ctx.lineWidth = args.stroke.width;
    } else {
      ctx.lineWidth = 0;
    }
    ctx.fillStyle = args.color;

    const textMetrics = ctx.measureText('fizz buzz');
    const lineHeight = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;

    if (args.wrap) {
      return renderMultilineText();
    } else {
      ctx.fillText(args.text, args.x, args.y, args.maxWidth);
      ctx.strokeText(args.text, args.x, args.y, args.maxWidth);
      return lineHeight;
    }

    function renderMultilineText(): number {
      const words = args.text.split(' ');
      let candidateLineWords: string[] = [];
      const lines: string[] = [];
      for (let i = 0; i < words.length; i++) {
        const testLine = `${candidateLineWords.length > 0 ? candidateLineWords.join(' ') + ' ' : ''}${words[i]}`;
        const candidateLineWidth = ctx.measureText(testLine).width;
        if (candidateLineWidth > args.maxWidth && i > 0) {
          candidateLineWords.pop();
          lines.push(candidateLineWords.join(' '));
          candidateLineWords = [words[i]];
        } else {
          candidateLineWords.push(words[i]);
        }
      }

      lines.push(candidateLineWords.join(' '));

      const blockHeight = lineHeight * lines.length;

      lines.forEach((l, i) => {
        ctx.fillText(l, args.x, args.y - (blockHeight - lineHeight * i));
        ctx.strokeText(l, args.x, args.y - (blockHeight - lineHeight * i));
      });

      return blockHeight;
    }
  }

  public drawImage(x: number, y: number, imgSrc: string, opts: { maxWidth?: number; maxHeight?: number } = {}): void {
    const context = this.canvas.getContext('2d')!;
    const imageCache = CardCanvas.ImageCache;

    const promise = new Promise<void>((resolve) => {
      const fromCache = imageCache.get(imgSrc);

      const imgEl =
        fromCache ||
        (() => {
          const value = document.createElement('img');
          value.src = imgSrc;
          imageCache.set(imgSrc, value);
          return value;
        })();

      if (fromCache) {
        paint();
      } else {
        imgEl.onload = () => paint();
      }

      function paint() {
        const originalHeight = imgEl.height;
        const originalWidth = imgEl.width;

        const maxHeight = opts.maxHeight ?? originalHeight;
        const maxWidth = opts.maxWidth ?? originalWidth;
        const { height, width } = calculateAspectRatioFit({
          height: originalHeight,
          width: originalWidth,
          maxHeight,
          maxWidth,
        });

        imgEl.width = width;
        imgEl.height = height;

        context.drawImage(imgEl, x, y);
        resolve();
      }
    });

    this.pendingOperations.push(promise);
  }

  public async toDataURL(): Promise<string> {
    await this.awaitPendingOperations();
    return this.canvas.toDataURL();
  }

  private async awaitPendingOperations(): Promise<void> {
    await Promise.all(this.pendingOperations);
    this.pendingOperations = [];
  }
}
