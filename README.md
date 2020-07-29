# image-to-colors

`image-to-colors` is a simple tool that gives you all the colors from an image. A color is just an array of 3 numbers
 whose values are from 0 to 255. Yes, they are the RGB values!
 
 ```js
const colors = [[25, 50, 75], [3, 120, 60], [90, 27, 9], [210, 160, 180]];
```
 
 Colors are obtained by collecting the pixels of the image: from left to right, from top to bottom.

## Usage

- Is your image already loaded? You can use an `HTMLImageElement` or an `HTMLCanvasElement` as a source!
```js
import ImageToColors from "image-to-colors";

const myImage = document.getElementById('myImage');
const myColors = ImageToColors.get(myImage);
```

- Do you want to get them from a URL? No problem!
```js
import ImageToColors from "image-to-colors";

const url = 'https://this.is.my/fancy/image.png';
let myColors;

ImageToColors.getFromExternalSource(url).then((colors) => {
  myColors = colors;
});
```

## Configuration

You can pass a second argument with some adjustments you want to make for color extraction.

```js
{
  // Scale the image to the indicated percentage, changing its resolution but maintaining its aspect ratio.
  detailingPercentage: number;

  // Indicates a specific part of the image from which to extract colors.
  cuttingParameters: {
      // The way in which the cutting dimensions will be calculated.
      mode: ImageToColorsCuttingMode;

      // The x-axis point of the top-left corner of the rectangle from which the colors will be extracted.
      cutFromX: number;

      // The y-axis point of the top-left corner of the rectangle from which the colors will be extracted.
      cutFromY: number;

      // The width of the rectangle from which the colors will be extracted.
      cutWidth: number;

      // The height of the rectangle from which the colors will be extracted.
      cutHeight: number;

  };

  // Set to true if you are having problems with images not loading into canvas because of CORS.
  setImageCrossOriginToAnonymous: boolean;
}
```
