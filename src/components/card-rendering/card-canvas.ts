import { FontFamily } from '../../font-family';
import { calculateAspectRatioFit } from './calculate-card-aspect-ratio-fit';

export interface RenderTextArgs {
  x: number;
  y: number;
  text: string;
  color: string;
  maxWidth: number;
  font: Font;
  stroke?: {
    color: string;
    width: number;
  };
  wrap?: {
    baseline: 'top' | 'bottom',
  }
}

export interface Font {
  style?: unknown; // to be implemented.
  weight?: 'bold';
  stretch?: 'condensed',
  size: number,
  family: FontFamily,
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
  }

  public async drawText(args: RenderTextArgs): Promise<number> {
    await this.awaitPendingOperations();

    const ctx = this.canvas.getContext('2d')!;

    ctx.fillStyle = 'darkred';
    ctx.fillRect(args.x, args.y, args.maxWidth, 3);

    ctx.font = buildFontString();
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

    function buildFontString() {
      return `${opt(args.font.weight)}${opt(args.font.stretch)}${args.font.size}px ${args.font.family}`;

      function opt(str?: string) {
        return str ? (str + ' ') : '';
      }
    }

    function renderMultilineText(): number {
      if (args.wrap == null) throw Error('Cannot render multiline text when `wrap` arg is undefined.');

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
        const y = args.wrap!.baseline === 'bottom' ?
          args.y - (blockHeight - lineHeight * (i + 1)) : args.y + (lineHeight * i);

        ctx.fillText(l, args.x, y);
        ctx.strokeText(l, args.x, y);
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

  /**
   * @param x X-coordinate of center.
   * @param y Y-coordinate of center.
   */
  public drawCircle(x: number, y: number, radius: number, color: string) {
    this.awaitPendingOperations();

    const ctx = this.canvas.getContext('2d')!;
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.fill();
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
