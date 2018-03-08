/* jshint -W117 */

/*!
 * BB Text Fitter 2.2.2
 * Uses binary search to fit text with minimal layout calls.
 * https://github.com/bobbybol/textFitter
 * @license MIT licensed
 *
 * Copyright (C) 2018 bobbybol.com - A project by Bobby Bol
 * Thanks: @STRML - https://github.com/STRML
 */

;(function ($) {
    "use strict";

    /**
     * Defining the `Text Fitter` Plugin
     */
    
    $.fn.bbFitText = function(options) {
        
        /**
         * Setting the Defaults
         */

        var settings = {
            // Text sizing
            minFontSize         : 6,        // minimum size to scale down to
            maxFontSize         : 60,       // maximum size to scale up to
            lineHeight          : 1.2,      // line-height in em           
            // Text centering
            centerHorizontal    : false,    // center text horizontally or not
            centerVertical      : false,    // center text vertically or not   
            // Extra options
            forceSingleLine     : false,    // force text onto single line
            scaleUpToo          : false,    // possibility to scale text up too   
            // Smart break
            smartBreak          : false,    // use smart break for big words
            smartBreakCharacter : '~'       // character to break a word on
        };        
        // Settings extendable with options
        $.extend(settings, options);
        

        /**
         * Set up the textfitter functionality for each DOM element
         *   - No objects are needed, just a lambda with closures
         *   - As of v2.0.0 state is no longer saved in $.cache object with jquery.data()
         */
        
        return this.each(function() {
                        
            /**
             * Declare variables
             */
            
            var toFit               = $(this);
            var parent              = toFit.parent();
            var parentHeight        = parent.height();
            var parentWidth         = parent.width();
            var originalHTML        = toFit.html();            
            var originalText        = toFit.text();
            var newSpan;

            
            /**
             * Check against settings and solve some simple logic
             */
                    
            // If we haven't added span.textfittie in a previous iteration..
            if (toFit.find('span.textfittie').length === 0) {
                // ..empty the <p> from its contents..
                toFit.html("");
                // ..build span.textfittie..
                newSpan = $("<SPAN>").addClass("textfittie").html(originalHTML);
                // ..and put span.textfittie into <p>
                toFit.html(newSpan);
            } else {
                // Otherwise just make a reference to the pre-existing span
                newSpan = toFit.find('span.textfittie');
            }
            
            // Force single line
            if (settings.forceSingleLine) {
                toFit.css({
                    whiteSpace: "nowrap"
                });
            }
            
            // Set line height
            toFit.css({
                lineHeight: settings.lineHeight + "em"
            });
                                   
            
            /**
             * Binary search for best fit
             */
            
            function findBestFit(elementToFit) {            
                var low  = settings.minFontSize + 1;
                var high = settings.maxFontSize + 1;
                var mid;
                
                if (!settings.scaleUpToo && elementToFit.height() <= parentHeight && newSpan.width() <= parentWidth) {
                    // Do nothing if we do not scale up and the text fits all parent boundaries.
                } else {
                    while ( low <= high ) {
                        mid  = parseInt((low + high) / 2); //34
                        elementToFit.css('font-size', mid);

                        if (elementToFit.height() <= parentHeight && newSpan.width() <= parentWidth) {
                            // increase low
                            low = mid + 1;
                        } else {            
                            // decrease high                
                            high = mid - 1;
                        }
                    }
                    // finally subtract 1 if width is still a little too large
                    if (newSpan.width() > elementToFit.innerWidth() || elementToFit.height() > parentHeight) {
                        elementToFit.css('font-size', mid - 1);
                    }
                }            
            }
            
                        
            /**
             * Smart word break
             */
            
            function smartWordBreaker() {  
                
                // Locally scoped version of the HTML
                var smartHTML = originalHTML;
                
                // Save an array of all words
                var longWordArray = originalText
                    .trim()
                    .split(" ")
                    .filter(function(word) {
                        return word.indexOf(settings.smartBreakCharacter) > -1;
                    })
                ;
                
                // Create an object for each longword with three properties
                var objectArray = longWordArray.map(function(longword) {                    
                    var splitWord = longword.split(settings.smartBreakCharacter);
                    
                    return {
                        longwordBroken   : splitWord.join("- "),
                        longwordIntact   : splitWord.join("")
                    };
                });
                       
                // We want to create an array of all possible combinations of smartwords,
                // including when they're all intact and where they're all broken
                /*[
                    ['1n', '2n', '3n'],
                    ['1y', '2n', '3n'],
                    ['1y', '2y', '3n'],
                    ['1y', '2n', '3y'],
                    ['1y', '2y', '3y'],
                    ['1n', '2y', '3n'],
                    ['1n', '2y', '3y'],
                    ['1n', '2n', '3y'],
                ]*/
                
                function createAllCombinations(arr) {
                    var i, j, temp;
                    var result = [];
                    var arrLen = arr.length;
                    var power = Math.pow;
                    var combinations = power(2, arrLen);
                    
                    // Time & Space Complexity O (n * 2^n)
                    for(i = 0; i < combinations; i++) {
                        temp = [];
                        
                        for(j = 0; j < arrLen; j++) {
                            // & is bitwise AND
                            if((i & power(2, j))) {
                                temp.push(arr[j].longwordBroken);
                            } else {
                                temp.push(arr[j].longwordIntact);
                            }
                        }
                        result.push(temp);
                    }
                    return result;
                }
                
                var combiArray = createAllCombinations(objectArray);
                
                // In the DOM, we want to get rid of all original words and replace them with <span>s.                
                longWordArray.forEach(function(el) {
                    smartHTML = smartHTML.replace(el, '<span class="smartWordBreak"></span>');
                });
                
                newSpan.html(smartHTML);

                // Now we want to get a new reference to those <span>s so we can start replacing words and testing for font-size
                var allSmartWords = newSpan.find('.smartWordBreak');

                var cachedFontSizes = [];
                
                // We have to do a wordbreak-check for every possible combination
                combiArray.forEach(function(arr, index) {
                    // Replace all words
                    arr.forEach(function(word, index){
                        $(allSmartWords[index]).text(word);
                    });
                    // Fit
                    findBestFit(toFit);
                    // Store the font size
                    cachedFontSizes.push(
                        parseInt(toFit.css('font-size').split('px')[0])
                    );
                });

                // Now we get the first occurence of the largest font size,
                // which is our `best fit` (least broken words).
                var largest = cachedFontSizes.reduce(function(a, b) {
                    return Math.max(a, b);
                });
                var firstIndexOfLargest = cachedFontSizes.indexOf(largest);

                // And finally, we use that fit one final time
                combiArray[firstIndexOfLargest].forEach(function(word, index){
                    $(allSmartWords[index]).text(word);
                });
                findBestFit(toFit);
            }
            
            
            /**
             * Function to call the fitter
             */
            
            function fitIt() {
                if(!settings.smartBreak || originalText.indexOf(settings.smartBreakCharacter) === -1 ) {
                    findBestFit(toFit);                
                } else {                            
                    smartWordBreaker();
                }
            }
            
            
            /**
             * Function to align to center
             */
            
            function alignIt() {
                // Horizontal
                if (settings.centerHorizontal) {
                    toFit.css({
                        textAlign: "center"
                    });
                }

                // Vertical
                if (settings.centerVertical) {            
                    setTimeout(function() {
                        parent.css({
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center"
                        });
                    }, 10);
                }
            }
            
            
            /**
             * Resolve `fit` promise before aligning
             */
            
            $.when( fitIt() ).done( alignIt() );
            
        });
    };
    
    
    /**
     * Defining the `Text Equalizer` Plugin
     */
    
    $.fn.bbEqualizeText = function() {
        
        // Find font size of passed element
        function findFontSize(element) {
            return parseInt($(element).css("fontSize"));
        }
        
        // Compare values, return smallest number
        function findSmallest(val1, val2) {
            return val2 < val1 ? val2 : val1;
        }
        
        // Get smallest font size
        var smallestFontSize = this
            .toArray()
            .map(findFontSize)
            .reduce(findSmallest)
        ;
        
        // Assign smallest font size to every element
        // ..and return object for chainability
        return this.each(function() {
            $(this).css("fontSize", smallestFontSize);
        }); 
    };   
    
}(jQuery));