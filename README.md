# BB Text Fitter
A JavaScript plugin to resize text in order to fit perfectly within its parent container.  
Oh, and it's **_fast_** due to binary search algorithm awesomeness.

## Demo
Live demonstation at [bobbybol.com/plugins/bb-textfitter](http://bobbybol.com/plugins/bb-textfitter/).

## Features
BB Text Fitter can:
- scale text _down_ to fit parent container.
- scale text _up_ to fit parent container.
- center text horizontally and vertically.
- find long words, fit their width, and scale other text accordingly.
- force text onto a single line.
- set/deal with any line height
- fit text with different size combinations
- fit text with different font combinations
- account for padding
- fit all your text nodes with one call
- equalize font sizes between different text nodes

## Basic Usage
**HTML structure**  
If you have need of this plugin, you probably have some container with at least one fixed dimension like width or height. You also most likely have some text that needs to fit this container, no matter how long this text could get. Alas, the Text Fitter plugin assumes that you have at least these two elements in place: a text element such as a `<p>` tag, and a container element which could be a `<div>` or some other element that you gave some dimensions:
```html
<div class="textContainer">
  <p>Some text you'd like to fit</p>
</div>
```
**Activating Text Fitter with JavaScript**  
The most basic way of using Text Fitter is simply calling it on the `<p>` tag you wish to be fitted to its parent:
```javascript
$('.textContainer p').bbFitText();
```
This will use default settings, scaling text down only if it currently overflows the parent container.

## Settings and their Defaults
There's a number of `options` you can fiddle with, to get the desired result of your specific use-case:
```javascript
{
  /* SETTING               DEFAULT         EXPLANATION
  =========================================================================== */
     minFontSize           : 6,            // minimum size to scale down to
     maxFontSize           : 60,           // maximum size to scale up to
     lineHeight            : 1.2,          // line-height in em           
  
     centerHorizontal      : false,        // center text horizontally or not
     centerVertical        : false,        // center text vertically or not   
  
     forceSingleLine       : false,        // force text onto single line
     scaleUpToo            : false,        // possibility to scale text up too  
}
```
Note that you when implementing the plugin functionality, you only have to refer to the settings that you want different. An example of using some custom settings:
```javascript
$('.textContainer p').bbFitText({
  maxFontSize: 44,
  centerVertical: true,
  scaleUpToo: true
});
```

## Tips & Tricks
- Font size is measured in pixels, do not assume anything else.
- Line height is measured in ems, so it scales nicely relative to font size.
- Minimizing the range between `minFontSize` and `maxFontSize` will result in fewer search iterations, so improves performance.
- Note that if you have multiple text elements that need to be fitted with the same settings, you can do so in one call. There's no need to instantiate the plugin on each text element individually:
```html
<div class="tc tc1">
  <p>Paragraph 1</p>
</div>
<div class="tc tc2">
  <p>Paragrahph 2</p>
</div>
<div class="tc tc3">
  <p>Paragrahph 3</p>
</div>
```
Only one call is needed:
```javascript
$('.tc p').bbFitText({
  minFontSize: 10,
  maxFontSize: 36,
  lineHeight: 1.35
});
```
- Issues have been know to arise from weird scaling settings on the `<body>`; if the plugin is executing but refusing to set put a pixel value on the `<p>` tag, check your `<body>` styling first for absolute `width` and `height`, wrong values for `line-height`, etc.

## Equalizing multiple text nodes
It might be necessary to first fit multiple text elements to their container, and subsequently equalize those text elements between themselves. This would effectively give them the same font size, which is often desirable from a design/layout point of view.
The text fitter plugin provides you with a second plugin (yes a plugin within a plugin), called bbEqualizeText. You can use it like so:
```html
<div class="equalizeUs">
  <p>Some text</p>
</div>
<div class="equalizeUs">
  <p>A little more text</p>
</div>
<div class="equalizeUs">
  <p>Some more text still</p>
</div>
```
Fit the text, then equalize:
```javascript
$('.equalizeUs p').bbFitText({
  centerVertical: true,
  forceSingleLine: true
}).bbEqualizeText();
```
