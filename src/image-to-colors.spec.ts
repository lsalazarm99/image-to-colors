import ImageToColors, {
  Color,
  ImageToColorsCuttingMode,
  ImageToColorsParameters,
} from "./image-to-colors";

describe("Colors extraction tests", () => {
  const imageSideSize = 5;
  const imagePixels: Uint8ClampedArray = new Uint8ClampedArray(
    Math.pow(imageSideSize, 2) * 4
  );
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  const imageData: ImageData = canvas
    .getContext("2d")!
    .createImageData(imageSideSize, imageSideSize);
  let imageUrl: string;

  beforeAll(() => {
    canvas.width = imageSideSize;
    canvas.height = imageSideSize;

    for (let i = 0, j = 0; i < Math.pow(imageSideSize, 2) * 4; i += 4, j++) {
      imagePixels[i] = j;
      imagePixels[i + 1] = 0;
      imagePixels[i + 2] = 0;
      imagePixels[i + 3] = 255;
    }

    imageData.data.set(imagePixels);
    canvas.getContext("2d")!.putImageData(imageData, 0, 0);

    imageUrl = canvas.toDataURL();
  });

  describe("Extract all", () => {
    const expectedValue = [
      [0, 0, 0],
      [1, 0, 0],
      [2, 0, 0],
      [3, 0, 0],
      [4, 0, 0],
      [5, 0, 0],
      [6, 0, 0],
      [7, 0, 0],
      [8, 0, 0],
      [9, 0, 0],
      [10, 0, 0],
      [11, 0, 0],
      [12, 0, 0],
      [13, 0, 0],
      [14, 0, 0],
      [15, 0, 0],
      [16, 0, 0],
      [17, 0, 0],
      [18, 0, 0],
      [19, 0, 0],
      [20, 0, 0],
      [21, 0, 0],
      [22, 0, 0],
      [23, 0, 0],
      [24, 0, 0],
    ];

    test("From loaded source", () => {
      expect(ImageToColors.get(canvas)).toEqual(expectedValue);
    });

    test("From external source", () => {
      return ImageToColors.getFromExternalSource(imageUrl).then((colors) => {
        expect(colors).toEqual(expectedValue);
      });
    });

    test("From external source, with cross origin modification", () => {
      return ImageToColors.getFromExternalSource(imageUrl, {
        setImageCrossOriginToAnonymous: true,
      }).then((colors) => {
        expect(colors).toEqual(expectedValue);
      });
    });

    test("From a less detailed image", () => {
      const expectedColors: Color[] = [
        [5, 0, 0],
        [7, 0, 0],
        [17, 0, 0],
        [19, 0, 0],
      ];
      const parameters: ImageToColorsParameters = {
        detailingPercentage: 40,
      };

      return ImageToColors.getFromExternalSource(imageUrl, parameters).then(
        (colors) => {
          expect(colors).toEqual(expectedColors);
        }
      );
    });
  });

  describe("Extract the first unit", () => {
    const expectedColors: Color[] = [[0, 0, 0]];
    const pixelParameters: ImageToColorsParameters = {
      cuttingParameters: {
        mode: ImageToColorsCuttingMode.pixels,
        cutFromX: 0,
        cutFromY: 0,
        cutWidth: 1,
        cutHeight: 1,
      },
    };
    const percentageParameters: ImageToColorsParameters = {
      cuttingParameters: {
        mode: ImageToColorsCuttingMode.percentage,
        cutFromX: 0,
        cutFromY: 0,
        cutWidth: 20,
        cutHeight: 20,
      },
    };

    test("Using pixel as measure unit", () => {
      expect(ImageToColors.get(canvas, pixelParameters)).toEqual(
        expectedColors
      );
    });

    test("Using percentage as measure unit", () => {
      expect(ImageToColors.get(canvas, percentageParameters)).toEqual(
        expectedColors
      );
    });
  });

  describe("Extract a square of 3 units from the center", () => {
    const expectedColors: Color[] = [
      [6, 0, 0],
      [7, 0, 0],
      [8, 0, 0],
      [11, 0, 0],
      [12, 0, 0],
      [13, 0, 0],
      [16, 0, 0],
      [17, 0, 0],
      [18, 0, 0],
    ];
    const pixelParameters: ImageToColorsParameters = {
      cuttingParameters: {
        mode: ImageToColorsCuttingMode.pixels,
        cutFromX: 1,
        cutFromY: 1,
        cutWidth: 3,
        cutHeight: 3,
      },
    };
    const percentageParameters: ImageToColorsParameters = {
      cuttingParameters: {
        mode: ImageToColorsCuttingMode.percentage,
        cutFromX: 20,
        cutFromY: 20,
        cutWidth: 60,
        cutHeight: 60,
      },
    };

    test("Using pixel as measure unit", () => {
      expect(ImageToColors.get(canvas, pixelParameters)).toEqual(
        expectedColors
      );
    });

    test("Using percentage as measure unit", () => {
      expect(ImageToColors.get(canvas, percentageParameters)).toEqual(
        expectedColors
      );
    });

    test("Using percentage as measure unit, from external source", () => {
      return ImageToColors.getFromExternalSource(
        imageUrl,
        percentageParameters
      ).then((colors) => {
        expect(colors).toEqual(expectedColors);
      });
    });
  });
});
