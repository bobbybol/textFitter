# BB Text Fitter - v2.2.0
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
- smartly choose to break words or leave them intact

## Basic Usage
**HTML structure**  
If you have need of this plugin, you probably have some container with at least one fixed dimension like width or height. You also most likely have some text that needs to fit within this container, no matter how long this text could get. Alas, the Text Fitter plugin assumes that you have at least these two elements in place: a text element such as a `<p>` tag, and a container element which could be a `<div>` or some other element that you gave some dimensions:
```html
<div class="textContainer">
  <p>Some text you'd like to fit</p>
</div>
```
**Incorporating the plugin**  
To start fitting text, you need the Text Fitter plugin to be available in your project. Download it [here](https://github.com/bobbybol/textFitter/archive/master.zip) from Github, and include it in your HTML like so:
```html
<!-- First include jQuery -->
<script src="path-to/jquery.js"></script>
<!-- Then include the textfitter plugin -->
<script src="path-to-the-plugin/jquery.bb-textfitter.js"></script>
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
     
     smartBreak            : false,        // use smart break for long words
     smartBreakCharacter   : '~'           // character to break a word on    
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
Or if you don't want to give an extra shared class to your elements:
```javascript
$('.tc1 p, .tc2 p, .tc3 p').bbFitText({
  minFontSize: 10,
  maxFontSize: 36,
  lineHeight: 1.35
});
```
- Issues have been know to arise from weird scaling settings on the `<body>`; if the plugin is executing but refusing to put a pixel value on the `<p>` tag, check your `<body>` styling first for absolute `width` and `height`, wrong values for `line-height`, etc.

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

## Smart Word Break
When setting `smartBreak` to `true`, you can now specify where long words would potentially be able to break if that would make the 'fit' look nicer. You can specify what character will be recognized as the `smartBreakCharacter`, and put that character at a smart place in the long word so that you control how a word could potentially be broken, not the browser. The default character is the 'tilda' sign `~`. As an example, `polyphilo~progenitive` would turn into either `polyphiloprogenitive` or `polyphilo-` with `progenitive` on the next line. The Smart Word Breaker makes sure that text doesn't get unneccessarily small due to the presence of overly long words. And it keeps you in control of the way these words might break.  
Use:
```html
<div class="longWordsContainer">
  <p>The old woman who lived in a shoe was quite polyphilo~progenitive, if we may believe Mother Goose.</p>
</div>
```
Apply Text Fitter with Smart Word Break:
```javascript
$('.longWordsContainer p').bbFitText({
  smartBreak: true,
  smartBreakCharacter: '~'
}).bbEqualizeText();
```
Smart Word Break is not limited to just one breakable word; you can specify smart breaks for as many words as you like.

## Changelog
### 2.2.1
#### Fixed
- IE bug when vertically aligning and scaling up

### 2.2.0
#### Added
- Smart Word Breaker functionality
- Smartbreak character now configurable in options

### 2.1.0
#### Added
- Text Equalizer plugin
- Text Equalizer can be called seperately, after fitting

### 2.0.0
#### Added
- New repository with completely rebuilt textfitter
- Text Aligner included in main plugin
- Upscaling is now optional
