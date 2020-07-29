/**
 * A class that get an array of colors of an image.
 *
 * - If your image is loaded in an <code>HTMLCanvasElement</code> or an <code>HTMLImageElement</code>, you will get
 * the colors synchronously.
 *
 * - If your image is not loaded and you don't plan to load it into the document or if you just want to get it from
 * its URL, you will get the colors asynchronously.
 */
export default class ImageToColors {
  /**
   * Get the colors of an item in which the image is already loaded.
   *
   * @param origin
   * An <code>HTMLCanvasElement</code> or an <code>HTMLImageElement</code> with the image loaded on them.
   *
   * @param parameters
   * Optional configuration for color extraction.
   */
  static get(
    origin: HTMLCanvasElement | HTMLImageElement,
    parameters?: ImageToColorsParameters
  ): Color[] {
    let canvas: HTMLCanvasElement;

    if (origin instanceof HTMLImageElement) {
      canvas = this.drawImageOnCanvas(origin, parameters);
    } else {
      canvas = origin;
    }

    const subPixels = this.getSubPixels(canvas, parameters);
    const colors: Color[] = [];

    for (let i = 0; i < subPixels.length; i += 4) {
      colors.push([subPixels[i], subPixels[i + 1], subPixels[i + 2]]);
    }

    return colors;
  }

  /**
   * Get the image from an external source (or a not loaded source) and return the colors in a promise. The
   * promise resolves when the image is fully loaded. If the image cannot be loaded, the promise rejects.
   *
   * @param source
   * The external source that will first be loaded into an <code>HTMLImageElement</code> for parsing purposes.
   *
   * @param parameters
   * Optional configuration for color extraction.
   */
  static getFromExternalSource(
    source: string,
    parameters?: ImageToColorsParameters
  ): Promise<Color[]> {
    return new Promise((resolve, reject) => {
      const image = new Image();

      if (parameters?.setImageCrossOriginToAnonymous) {
        image.crossOrigin = "Anonymous";
      }

      image.onload = () => {
        resolve(this.get(image, parameters));
      };

      image.onerror = () => reject();

      image.src = source;
    });
  }

  private static drawImageOnCanvas(
    image: HTMLImageElement,
    parameters?: ImageToColorsParameters
  ): HTMLCanvasElement {
    const canvas = document.createElement("canvas");

    canvas.width =
      image.naturalWidth * ((parameters?.detailingPercentage ?? 100) / 100);
    canvas.height =
      image.naturalHeight * ((parameters?.detailingPercentage ?? 100) / 100);

    canvas
      .getContext("2d")!
      .drawImage(image, 0, 0, canvas.width, canvas.height);

    return canvas;
  }

  private static getSubPixels(
    canvas: HTMLCanvasElement,
    parameters?: ImageToColorsParameters
  ): Uint8ClampedArray {
    switch (parameters?.cuttingParameters?.mode) {
      case ImageToColorsCuttingMode.percentage:
        return canvas
          .getContext("2d")!
          .getImageData(
            (parameters?.cuttingParameters?.cutFromX / 100) * canvas.width,
            (parameters?.cuttingParameters?.cutFromY / 100) * canvas.height,
            (parameters?.cuttingParameters?.cutWidth / 100) * canvas.width,
            (parameters?.cuttingParameters?.cutHeight / 100) * canvas.height
          ).data;
      case ImageToColorsCuttingMode.pixels:
        return canvas
          .getContext("2d")!
          .getImageData(
            parameters?.cuttingParameters?.cutFromX,
            parameters?.cuttingParameters?.cutFromY,
            parameters?.cuttingParameters?.cutWidth,
            parameters?.cuttingParameters?.cutHeight
          ).data;
      default:
        return canvas
          .getContext("2d")!
          .getImageData(0, 0, canvas.width, canvas.height).data;
    }
  }
}

export enum ImageToColorsCuttingMode {
  pixels,
  percentage,
}

export interface ImageToColorsParameters {
  /**
   * Scale the image to the indicated percentage, changing its resolution but maintaining its aspect ratio.
   * Consequently, the number of colors obtained can be greater or less.
   */
  detailingPercentage?: number;
  /**
   * Indicates a specific part of the image from which to extract colors.
   */
  cuttingParameters?: ImageToColorsCuttingParameters;
  /**
   * Set to true if you are having problems with images not loading into canvas because of CORS.
   *
   * Only valid if you are fetching the image from a URL.
   */
  setImageCrossOriginToAnonymous?: boolean;
}

export interface ImageToColorsCuttingParameters {
  /**
   * The way in which the cutting dimensions will be calculated.
   */
  mode: ImageToColorsCuttingMode;
  /**
   * The x-axis point of the top-left corner of the rectangle from which the colors will be extracted.
   */
  cutFromX: number;
  /**
   * The y-axis point of the top-left corner of the rectangle from which the colors will be extracted.
   */
  cutFromY: number;
  /**
   * The width of the rectangle from which the colors will be extracted. Positive values are to the right, and
   * negative to the left.
   */
  cutWidth: number;
  /**
   * The height of the rectangle from which the colors will be extracted. Positive values are down, and negative
   * are up.
   */
  cutHeight: number;
}

export interface Color {
  [index: number]: number;
}
