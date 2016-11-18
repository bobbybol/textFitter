/* jshint -W117 */

/*!
 * BB Text Fitter 2.1.0
 * Uses binary search to fit text with minimal layout calls.
 * https://github.com/bobbybol/textFitter
 * @license MIT licensed
 *
 * Copyright (C) 2016 bobbybol.com - A project by Bobby Bol
 * Thanks: @STRML - https://github.com/STRML
 */

;(function ($) {
    "use strict";

    /**
     * Defining the Plugin
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
                // var originalText        = toFit.text();      <-- not used in v2.0.0
            var newSpan;
                // var singleLineHeight;                        <-- not used in v2.0.0
                // var multiLine;                               <-- not used in v2.0.0
            
            // For binary search algorithm
            var low;
            var mid;
            var high;
            
            /**
             * Check agains settings and solve some simple logic
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
                       
            /* v2.0.0 -- UNNECCESARY
            =========================================================================
            // Check for words that are too big to fit inside <p>
            if (newSpan.width() > toFit.innerWidth()) {
                // find longest word
                var wordArray = originalText.split(" ");
                console.log(wordArray);
                
                var longestWord = wordArray.reduce(function(longest, currentWord) {
                    if(currentWord.length > longest.length)
                        return currentWord;
                    else
                       return longest;
                }, "");
                
                console.log(longestWord);
                
                newSpan.html(longestWord);
            }
            =========================================================================
            */
            
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
                       
            /* v2.0.0 -- UNNECCESARY
            =======================================================================================
            // Detect multiline
            singleLineHeight = Math.round(parseInt(toFit.css("font-size")) * settings.lineHeight);
            if (newSpan.height() > (singleLineHeight * 1.5)) {
                multiLine = true;
            } else {
                multiLine = false;
            }
            =======================================================================================
            */           
            
            /**
             * Binary search for best fit
             */
            
            low  = settings.minFontSize + 1;
            high = settings.maxFontSize + 1;
                               
            if (!settings.scaleUpToo && toFit.height() <= parentHeight && newSpan.width() <= parentWidth) {
                // Do nothing if we do not scale up and the text fits all parent boundaries.
            } else {
                while ( low <= high ) {
                    mid  = parseInt((low + high) / 2); //34
                    toFit.css('font-size', mid);

                    if (toFit.height() <= parentHeight && newSpan.width() <= parentWidth) {
                        // increase low
                        low = mid + 1;
                    } else {            
                        // decrease high                
                        high = mid - 1;
                    }
                }
                // finally subtract 1 if width is still a little too large
                if (newSpan.width() > toFit.innerWidth() || toFit.height() > parentHeight) {
                    toFit.css('font-size', mid - 1);
                }
            }
            
            
            /**
             * Alignment to center
             */
            
            // Horizontal
            if (settings.centerHorizontal) {
                toFit.css({
                    textAlign: "center"
                });
            }
            
            // Vertical
            if (settings.centerVertical) {
                
                /* v2.0.0 -- FLEXBOX ONLY
                ============================
                parent.css({
                    display: "table"
                });
                toFit.css({
                    display: "table-cell",
                    verticalAlign: "middle"
                });
                ============================
                */
                
                parent.css({
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                });  
            }
            
        });
    };
    
    
    /**
     * Defining the Plugin
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