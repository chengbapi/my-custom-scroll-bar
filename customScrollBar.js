/**
 * @fileoverview This is jQuery plugin to change the style of default scroll bar
 * @author chengbapi@gmail.com (Mingyu Cheng)
 * @version 0.1.2
 * */

;(function($) {
    $.fn.extend({
        customScrollBar : function() {
            
            var 
                prev_arrow_template = $(
                "<div class='prev scrollBar_arrow'></div>"
                ),

                next_arrow_template = $(
                "<div class='next scrollBar_arrow'></div>"
                ),

                vertical_template = $(
                "<div class='v scrollBar'>" + 
                    "<div class='v scrollButtonWrapper'>" + 
                        "<div class='v scrollButton'></div>" + 
                    "</div>" +
                "</div>"),

                horizental_template = $(
                "<div class='h scrollBar'>" + 
                    "<div class='h scrollButtonWrapper'>" + 
                        "<div class='h scrollButton'></div>" + 
                    "</div>" +
                "</div>"),

                default_options = {
                    arrow : false,
                    vertical : true,
                    horizental : true
                };


            return function(options) {

                var 
                    that = this,

                    ele,
                    val,

                    options = $.extend(default_options, options),
                    arrow = options.arrow,
                    vertical = options.vertical,
                    horizental = options.horizental;

                // render CSS style and insert template into target
                $(this).css({overflow : "hidden"})
                $(this).wrapInner("<div class='scrollBarWrapper'></div>");

                ele = $(this).children(".scrollBarWrapper");

                if (vertical) {
                    ele.after(vertical_template);
                }
                if (horizental) {
                    ele.after(horizental_template);
                }
                if (arrow) {
                    ele.siblings(".scrollBar").prepend(prev_arrow_template).append(next_arrow_template);
                }

                // addEventListener mousewheel Event on ele
                ele.add(".v.scrollBar", ele.parent()).on("mousewheel DOMMouseScroll", function(e) {

                    e = e.originalEvent;
                    if (e.wheelDelta) {
                        val = e.wheelDelta;
                    } else if (e.detail) {
                        val =  -e.detail * 40;
                    }

                    ele.customScrollBarRender({top : val, y : null});

                    return false;

                })

                // addEventListener click and drag Event on scrollBars
                ele.nextAll('.scrollBar').on("mousedown", function(e) {
                    var $target = $(e.target),
                        timer,
                        isVertical = $target.hasClass('v');
                    
                    $(that).addClass("user_select_none");

                    if ($target.hasClass("scrollButton")) {
                        
                        $(document).on("mousemove", function(e) {
                            // reduce render
                            timer =  setTimeout(func, 100);
                           
                            function func() {
                                if (isVertical) {
                                    ele.customScrollBarRender({y : e.pageY, x : null});
                                } else {
                                    ele.customScrollBarRender({y : null, x : e.pageX});
                                }
                            }
                        })

                        $(document).one("mouseup", function(e) {
                            timer = null;

                            $(document).off("mousemove");
                            $(that).removeClass("user_select_none");
                        })
                    }

                    if ($target.hasClass("scrollButtonWrapper")) {
                        $(this).one("mouseup", function(e) {
                            if (isVertical) {
                                ele.customScrollBarRender({y : e.pageY, x : null});
                            } else {
                                ele.customScrollBarRender({y : null, x : e.pageX});
                            }
                            $(that).removeClass("user_select_none");
                        })
                    }

                    if ($target.hasClass("scrollBar_arrow")) {
                        if ($target.parent().hasClass("v")) {
                            if ($target.hasClass("prev")) {
                                ele.customScrollBarRender({top : 240, y : null});
                            } else {
                                ele.customScrollBarRender({top : -240, y : null});
                            }
                        } else {
                            if ($target.hasClass("prev")) {
                                ele.customScrollBarRender({left : 240, x : null});
                            } else {
                                ele.customScrollBarRender({left : -240, x : null});
                            }
                        }
                    }
                    
                })

                // render for the fisrt time vertically and horizentally
                ele.customScrollBarRender({y : 0, x : 0});

                ele.on("DOMSubtreeModified", function() {
                    setTimeout(function() {
                        ele.customScrollBarRender();
                    }, 1);
                });

                return this;
            
            };
        }(),

        customScrollBarRender : function( pointTo ) {

            var 
                ele = $(this).hasClass("scrollBarWrapper") ? $(this) : $(this).children(".scrollBarWrapper"),
                
                /* add support to body element */
                target = ele.parent(),
                target = target[0].tagName.toLowerCase() === 'body' ? window : target[0], 

                displayWidth = $(target).width(),
                displayHeight = $(target).height(),
                
                prevContent = ele.prevAll().not(".scrollBar"),
                nextContent = ele.nextAll().not(".scrollBar"),

                contentWidth,
                contentHeight,
                contentTop,
                contentLeft,
                widthRate,
                heightRate,

                // vertical
                vScrollBar = ele.nextAll(".v.scrollBar"),
                vScrollBarArrowLength = vScrollBar.children(".scrollBar_arrow").height(),

                vScrollBarWidth = vScrollBar.width(),
                vScrollBarLength = displayHeight,

                vScrollButtonWrapper = vScrollBar.children(".scrollButtonWrapper"),
                vScrollButtonWrapperLength,

                vScrollBarOffset = vScrollBar.offset(),
                vScrollBarOffsetX = vScrollBarOffset.left,
                vScrollBarOffsetY = vScrollBarOffset.top,

                vScrollButton = vScrollBar.find(".scrollButton"),
                vScrollButtonLength,
                vScrollButtonTop,

                // horizental
                hScrollBar = ele.nextAll(".h.scrollBar"),
                hScrollBarArrowLength = hScrollBar.children(".scrollBar_arrow").width(),

                hScrollBarWidth = hScrollBar.height(),
                hScrollBarLength = displayWidth,

                hScrollButtonWrapper = hScrollBar.children(".scrollButtonWrapper"),
                hScrollButtonWrapperLength,

                hScrollBarOffset = hScrollBar.offset(),
                hScrollBarOffsetX = hScrollBarOffset.left,
                hScrollBarOffsetY = hScrollBarOffset.top,

                hScrollButton = hScrollBar.find(".scrollButton"),
                hScrollButtonLength,
                hScrollButtonLeft,


                max,
                toTop,
                toLeft,

                // set scroll Event a proper speed
                speed = 15;
                

            // put new content into ele if new content has added
            ele.prepend(prevContent);
            ele.append(nextContent);

            ele.css({position : 'absolute', width : displayWidth, height : displayHeight});

            // calculate contentWidth and contentHeight
            ele.css({width : "auto", height : "auto"});
            contentWidth = ele.width() + vScrollBarWidth;
            contentHeight = ele.height() + hScrollBarWidth;
            // back to initial status
            ele.css({width : displayWidth, height : displayHeight});

            // calculate Rate for buttonSize use
            widthRate = contentWidth / displayWidth;
            heightRate = contentHeight / displayHeight;


            // position vScrollBar in proper position
            if (heightRate > 1 && widthRate > 1) {
                vScrollBarLength -= hScrollBarWidth;
                hScrollBarLength -= vScrollBarWidth;
            }

            vScrollButtonWrapperLength = vScrollBarLength - 2 * vScrollBarArrowLength;
            hScrollButtonWrapperLength = hScrollBarLength - 2 * hScrollBarArrowLength; 

            vScrollBar.height(vScrollBarLength);
            hScrollBar.width(hScrollBarLength);
            vScrollButtonWrapper.css({height : vScrollButtonWrapperLength, top : vScrollBarArrowLength});
            hScrollButtonWrapper.css({width : hScrollButtonWrapperLength, left : hScrollBarArrowLength});

            // handle vertical content overflow
            if (heightRate > 1) {
                vScrollBar.show();

                vScrollButtonLength = vScrollButtonWrapperLength / heightRate;
                vScrollButton.height(vScrollButtonLength);

                // calculate toTop value
                if (!pointTo) {
                    // content change Event
                    contentTop = - parseFloat(ele.css("top"));

                    vScrollButtonTop = (contentTop / contentHeight) * vScrollBarLength;

                } else if (pointTo.y !== null) {
                    // mousemove Event
                    vScrollButtonTop = (pointTo.y - vScrollBarOffsetY - 0.5 * vScrollButtonLength - vScrollBarArrowLength);
                } else if(pointTo.top !== undefined) {
                    // mousewheel Event
                    pointTo.top *= speed;
                    vScrollButtonTop = parseFloat(vScrollButton.css("top")) - (pointTo.top / contentHeight) * vScrollButtonLength;
                }

                // modify
                max = vScrollButtonWrapperLength - vScrollButtonLength;
                vScrollButtonTop = vScrollButtonTop < 0 ? 0 : vScrollButtonTop;
                vScrollButtonTop = vScrollButtonTop > max ? max : vScrollButtonTop;

                toTop = vScrollButtonTop / vScrollButtonWrapperLength;

                // move
                ele.css({top : -toTop * contentHeight});
                vScrollButton.css({top : vScrollButtonTop});

            }else{
                vScrollBar.hide();
            }

            // handle horizental content overflow
            if (widthRate > 1) {
                hScrollBar.show();
                
                hScrollButtonLength = hScrollButtonWrapperLength / widthRate;
                hScrollButton.width(hScrollButtonLength);

                // calculate toTop value
                if (!pointTo) {
                     // content change Event
                    contentLeft = - parseFloat(ele.css("left"));

                    hScrollButtonLeft = (contentLeft / contentWidth) * hScrollBarLength;
                } else if (pointTo.x !== null) {
                    hScrollButtonLeft = (pointTo.x - hScrollBarOffsetX - 0.5 * hScrollButtonLength);
                } else if (pointTo.left !== undefined) {
                    pointTo.left *= speed;
                    hScrollButtonLeft = parseFloat(hScrollButton.css("left")) - (pointTo.left / contentWidth) * hScrollButtonLength;
                }

                // modify 
                max = hScrollButtonWrapperLength - hScrollButtonLength;
                hScrollButtonLeft = hScrollButtonLeft < 0 ? 0 : hScrollButtonLeft;
                hScrollButtonLeft = hScrollButtonLeft > max ? max : hScrollButtonLeft;

                toLeft = hScrollButtonLeft / hScrollButtonWrapperLength;

                // move
                ele.css({left : -toLeft * contentWidth});
                hScrollButton.css({left : hScrollButtonLeft});

            }else{
                hScrollBar.hide();
            }
        }
    });

})(jQuery);
