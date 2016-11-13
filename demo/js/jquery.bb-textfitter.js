/* jshint -W117 */

/*!
 * BB Text Fitter 1.0.0
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
            canProcessAgain     : false     // possibility to call resizer again
        };        
        // Settings extendable with options
        $.extend(settings, options);
        

        /**
         * Set up the textfitter functionality for each DOM element
         *   - No objects are needed, just a lambda with closures
         *   - State can also be saved in $.cache object with jquery.data()
         */
        
        return this.each(function() {
                        
            /**
             * Declare variables
             */
            
            var processed           = false;
            var toFit               = $(this);
            var parent              = toFit.parent();
            var parentHeight        = parent.height();
            var parentWidth         = parent.width();
            var originalText        = toFit.html();
            // New span to wrap around original text
            var newSpan;
            var singleLineHeight;
            var multiLine;
            // For binary search algorithm
            var low;
            var mid;
            var high;
            
            /**
             * Check agains settings and solve some simple logic
             */
            
            // First check if this element has been processed already
            if(processed === true && settings.canProcessAgain === false) {
                // Return if we're not allowed to re-process
                return toFit;
            }
            
            // If we haven't added span.textfittie in a previous iteration..
            if (toFit.find('span.textfittie').length === 0) {
                // ..empty the <p> from its contents..
                toFit.html("");
                // ..build span.textfittie..
                newSpan = $("<SPAN>").addClass("textfittie").html(originalText);
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
            
            // Detect multiline
            singleLineHeight = Math.round(parseInt(toFit.css("font-size")) * settings.lineHeight);
            if (newSpan.height() > (singleLineHeight * 1.5)) {
                multiLine = true;
            } else {
                multiLine = false;
            }
            
            
            /**
             * Binary search for best fit
             */
            
            low  = settings.minFontSize + 1;
            high = settings.maxFontSize + 1;
            
            
            if (!settings.scaleUpToo && (settings.forceSingleLine || !multiLine)) {
                // do nothing
            } else {
                while ( low <= high ) {
                    mid  = parseInt((low + high) / 2); //34
                    toFit.css('font-size', mid);

                    if (toFit.height() <= parentHeight && (false || newSpan.width() <= parentWidth)) {
                        // increase low
                        low = mid + 1;
                    } else {            
                        // decrease high                
                        high = mid - 1;
                    }
                }
                // finally subtract 1 if width is still a little too large
                if (newSpan.width() > toFit.innerWidth()) {
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
                parent.css({
                    display: "table"
                });
                toFit.css({
                    display: "table-cell",
                    verticalAlign: "middle"
                });
            }
               
        });               
    };
}(jQuery));