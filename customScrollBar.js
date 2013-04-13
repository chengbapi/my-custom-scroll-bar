/**
 * @fileoverview This is jQuery plugin to change the style of default scroll bar
 * @author chengbapi@gmail.com (Mingyu Cheng)
 * @version 0.1.1
 * */

;(function() {
    $.fn.extend({
        customScrollBar : function() {
            
            var template = $(
            "<div class='v scrollBar'>" + 
                "<div class='v scrollButton'></div>" + 
            "</div>" + 
            "<div class='h scrollBar'>" + 
                "<div class='h scrollButton'></div>" +
            "</div>");

            return function() {

                var displayWidth = $(this).width(),
                    displayHeight = $(this).height(),
                    that = this,

                    ele,
                    scrollBarWidth,
                    val;

                // render CSS style and insert template into target
                $(this).css({overflow : "hidden"})
                $(this).wrapInner("<div class='scrollBarWrapper'></div>");

                ele = $(this).children(".scrollBarWrapper");
                ele.css({position : 'absolute', width : displayWidth, height : displayHeight});

                ele.after(template);
                
                // addEventListener mousewheel Event on ele
                ele.on("mousewheel DOMMouseScroll", function(e) {
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
                        isVertical = $target.hasClass('v');
                    
                    $(that).addClass("user_select_none");

                    if ($target.hasClass("scrollButton")) {
                        $(document).on("mousemove", function(e) {
                            if (isVertical) {
                                ele.customScrollBarRender({y : e.pageY, x : null});
                            } else {
                                ele.customScrollBarRender({y : null, x : e.pageX});
                            }
                        })

                        $(document).one("mouseup", function(e) {
                            $(document).off("mousemove");
                            $(that).removeClass("user_select_none");
                        })
                    }

                    if ($target.hasClass("scrollBar")) {
                        $(this).one("mouseup", function(e) {
                            if (isVertical) {
                                ele.customScrollBarRender({y : e.pageY, x : null});
                            } else {
                                ele.customScrollBarRender({y : null, x : e.pageX});
                            }
                            $(that).removeClass("user_select_none");
                        })
                    }
                    
                })

                // render for the fisrt time vertically and horizentally
                ele.customScrollBarRender({y : 0, x : 0});

                return this;
            
            };
        }(),
        customScrollBarRender : function( pointTo ) {

            var ele = $(this).hasClass("scrollBarWrapper") ? $(this) : $(this).children(".scrollBarWrapper"),
                displayWidth = ele.width(),
                displayHeight = ele.height(),
                
                prevContent = ele.prevAll().not(".scrollBar"),
                nextContent = ele.nextAll().not(".scrollBar"),

                contentWidth,
                contentHeight,
                contentTop,
                contentLeft,
                widthRate,
                heightRate,

                vScrollBar = ele.nextAll(".v.scrollBar"),
                vScrollBarWidth = vScrollBar.width(),
                vScrollBarLength = displayHeight,
                vScrollBarOffset = vScrollBar.offset(),
                vScrollBarOffsetX = vScrollBarOffset.left,
                vScrollBarOffsetY = vScrollBarOffset.top,

                vScrollButton = vScrollBar.find(".v.scrollButton"),
                vScrollButtonLength,
                vScrollButtonTop,

                hScrollBar = ele.nextAll(".h.scrollBar"),
                hScrollBarWidth = hScrollBar.height(),
                hScrollBarLength = displayWidth,
                hScrollBarOffset = hScrollBar.offset(),
                hScrollBarOffsetX = hScrollBarOffset.left,
                hScrollBarOffsetY = hScrollBarOffset.top,

                hScrollButton = hScrollBar.find(".h.scrollButton"),
                hScrollButtonLength,
                hScrollButtonLeft,

                max,
                toTop,
                toLeft;

            // put new content into ele if new content has added
            ele.prepend(prevContent);
            ele.append(nextContent);

            // position vScrollBar in proper position
            vScrollBar.css({ height : vScrollBarLength, right : 0, top : 0})
            hScrollBar.css({ width : hScrollBarLength, left : 0, bottom : 0})

            // calculate contentWidth and contentHeight
            ele.css({width : "auto", height : "auto"});
            contentWidth = ele.width() + vScrollBarWidth;
            contentHeight = ele.height() + hScrollBarWidth;
            // back to initial status
            ele.css({width : displayWidth, height : displayHeight});

            // calculate Rate for buttonSize use
            widthRate = contentWidth / displayWidth;
            heightRate = contentHeight / displayHeight;

            // handle vertical content overflow
            if (heightRate > 1) {
                vScrollBar.show();

                vScrollButtonLength = displayHeight / heightRate;
                vScrollButton.height(vScrollButtonLength);

                // calculate toTop value
                if (!pointTo) {
                    // content change Event
                    contentTop = - parseFloat(ele.css("top"));

                    vScrollButtonTop = (contentTop / contentHeight) * vScrollBarLength;

                } else if (pointTo.y !== null) {
                    // mousemove Event
                    vScrollButtonTop = (pointTo.y - vScrollBarOffsetY - 0.5 * vScrollButtonLength);
                } else if(pointTo.top !== undefined){
                    // mousewheel Event
                    vScrollButtonTop = parseFloat(vScrollButton.css("top")) - (pointTo.top / contentHeight) * vScrollButtonLength;
                }

                // modify
                max = vScrollBarLength - vScrollButtonLength;
                vScrollButtonTop = vScrollButtonTop < 0 ? 0 : vScrollButtonTop;
                vScrollButtonTop = vScrollButtonTop > max ? max : vScrollButtonTop;

                toTop = vScrollButtonTop / vScrollBarLength;

                // move
                ele.css({top : -toTop * contentHeight});
                vScrollButton.css({top : vScrollButtonTop});

            }else{
                vScrollBar.hide();
            }

            // handle horizental content overflow
            if (widthRate > 1) {
                hScrollBar.show();
                
                hScrollButtonLength = displayWidth / widthRate;
                hScrollButton.width(hScrollButtonLength);

                // calculate toTop value
                if (!pointTo) {
                     // content change Event
                    contentLeft = - parseFloat(ele.css("left"));

                    hScrollButtonLeft = (contentLeft / contentWidth) * hScrollBarLength;
                } else if (pointTo.x !== null) {
                    hScrollButtonLeft = (pointTo.x - hScrollBarOffsetX - 0.5 * hScrollButtonLength);
                }

                // modify 
                max = hScrollBarLength - hScrollButtonLength;
                hScrollButtonLeft = hScrollButtonLeft < 0 ? 0 : hScrollButtonLeft;
                hScrollButtonLeft = hScrollButtonLeft > max ? max : hScrollButtonLeft;

                toLeft = hScrollButtonLeft / hScrollBarLength;

                // move
                ele.css({left : -toLeft * contentWidth});
                hScrollButton.css({left : hScrollButtonLeft});

            }else{
                hScrollBar.hide();
            }
        }
    });

})(jQuery);
