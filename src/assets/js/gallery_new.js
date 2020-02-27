/**
 * Dragdealer.js 0.10.0
 * http://github.com/skidding/dragdealer
 *
 * (c) 2010+ Ovidiu Cherecheï¿½
 * http://skidding.mit-license.org
 */
 (function(root, factory) {
    if (typeof define === "function" && define.amd) define(factory);
    else if (typeof module === "object" && module.exports) module.exports.Dragdealer = factory();
    else root.Dragdealer = factory()
})(this, function() {
    var Dragdealer = function(wrapper, options) {
        this.options = this.applyDefaults(options || {});
        this.bindMethods();
        this.wrapper = this.getWrapperElement(wrapper);
        if (!this.wrapper) return;
        this.handle = this.getHandleElement(this.wrapper, this.options.handleClass);
        if (!this.handle) return;
        this.init();
        this.bindEventListeners()
    };
    Dragdealer.prototype = {
        defaults: { disabled: false, horizontal: true, vertical: false, slide: true, steps: 0, snap: false, loose: false, speed: .1, xPrecision: 0, yPrecision: 0, handleClass: "handle", css3: true, activeClass: "active", tapping: true },
        init: function() {
            if (this.options.css3) triggerWebkitHardwareAcceleration(this.handle);
            this.value = { prev: [-1, -1], current: [this.options.x || 0, this.options.y || 0], target: [this.options.x || 0, this.options.y || 0] };
            this.offset = {
                wrapper: [0, 0],
                mouse: [0, 0],
                prev: [-999999, -999999],
                current: [0, 0],
                target: [0,
                0
                ]
            };
            this.dragStartPosition = { x: 0, y: 0 };
            this.change = [0, 0];
            this.stepRatios = this.calculateStepRatios();
            this.activity = false;
            this.dragging = false;
            this.tapping = false;
            this.reflow();
            if (this.options.disabled) this.disable()
        },
    applyDefaults: function(options) {
        for (var k in this.defaults)
            if (!options.hasOwnProperty(k)) options[k] = this.defaults[k];
        return options
    },
    getWrapperElement: function(wrapper) {
        if (typeof wrapper == "string") return document.getElementById(wrapper);
        else return wrapper
    },
getHandleElement: function(wrapper,
    handleClass) {
    var childElements, handleClassMatcher, i;
    if (wrapper.getElementsByClassName) { childElements = wrapper.getElementsByClassName(handleClass); if (childElements.length > 0) return childElements[0] } else {
        handleClassMatcher = new RegExp("(^|\\s)" + handleClass + "(\\s|$)");
        childElements = wrapper.getElementsByTagName("*");
        for (i = 0; i < childElements.length; i++)
            if (handleClassMatcher.test(childElements[i].className)) return childElements[i]
        }
},
calculateStepRatios: function() {
    var stepRatios = [];
    if (this.options.steps >= 1)
        for (var i =
            0; i <= this.options.steps - 1; i++)
            if (this.options.steps > 1) stepRatios[i] = i / (this.options.steps - 1);
        else stepRatios[i] = 0;
        return stepRatios
    },
    setWrapperOffset: function() { this.offset.wrapper = Position.get(this.wrapper) },
    calculateBounds: function() {
        var bounds = { top: this.options.top || 0, bottom: -(this.options.bottom || 0) + this.wrapper.offsetHeight, left: this.options.left || 0, right: -(this.options.right || 0) + this.wrapper.offsetWidth };
        bounds.availWidth = bounds.right - bounds.left - this.handle.offsetWidth;
        bounds.availHeight = bounds.bottom -
        bounds.top - this.handle.offsetHeight;
        return bounds
    },
    calculateValuePrecision: function() {
        var xPrecision = this.options.xPrecision || Math.abs(this.bounds.availWidth),
        yPrecision = this.options.yPrecision || Math.abs(this.bounds.availHeight);
        return [xPrecision ? 1 / xPrecision : 0, yPrecision ? 1 / yPrecision : 0]
    },
    bindMethods: function() {
        if (typeof this.options.customRequestAnimationFrame === "function") this.requestAnimationFrame = bind(this.options.customRequestAnimationFrame, window);
        else this.requestAnimationFrame = bind(requestAnimationFrame,
            window);
            if (typeof this.options.customCancelAnimationFrame === "function") this.cancelAnimationFrame = bind(this.options.customCancelAnimationFrame, window);
        else this.cancelAnimationFrame = bind(cancelAnimationFrame, window);
        this.animateWithRequestAnimationFrame = bind(this.animateWithRequestAnimationFrame, this);
        this.animate = bind(this.animate, this);
        this.onHandleMouseDown = bind(this.onHandleMouseDown, this);
        this.onHandleTouchStart = bind(this.onHandleTouchStart, this);
        this.onDocumentMouseMove = bind(this.onDocumentMouseMove,
            this);
        this.onWrapperTouchMove = bind(this.onWrapperTouchMove, this);
        this.onWrapperMouseDown = bind(this.onWrapperMouseDown, this);
        this.onWrapperTouchStart = bind(this.onWrapperTouchStart, this);
        this.onDocumentMouseUp = bind(this.onDocumentMouseUp, this);
        this.onDocumentTouchEnd = bind(this.onDocumentTouchEnd, this);
        this.onHandleClick = bind(this.onHandleClick, this);
        this.onWindowResize = bind(this.onWindowResize, this)
    },
    bindEventListeners: function() {
        addEventListener(this.handle, "mousedown", this.onHandleMouseDown);
        addEventListener(this.handle,
            "touchstart", this.onHandleTouchStart);
        addEventListener(document, "mousemove", this.onDocumentMouseMove);
        addEventListener(this.wrapper, "touchmove", this.onWrapperTouchMove);
        addEventListener(this.wrapper, "mousedown", this.onWrapperMouseDown);
        addEventListener(this.wrapper, "touchstart", this.onWrapperTouchStart);
        addEventListener(document, "mouseup", this.onDocumentMouseUp);
        addEventListener(document, "touchend", this.onDocumentTouchEnd);
        addEventListener(this.handle, "click", this.onHandleClick);
        addEventListener(window,
            "resize", this.onWindowResize);
        this.animate(false, true);
        this.interval = this.requestAnimationFrame(this.animateWithRequestAnimationFrame)
    },
    unbindEventListeners: function() {
        removeEventListener(this.handle, "mousedown", this.onHandleMouseDown);
        removeEventListener(this.handle, "touchstart", this.onHandleTouchStart);
        removeEventListener(document, "mousemove", this.onDocumentMouseMove);
        removeEventListener(this.wrapper, "touchmove", this.onWrapperTouchMove);
        removeEventListener(this.wrapper, "mousedown", this.onWrapperMouseDown);
        removeEventListener(this.wrapper, "touchstart", this.onWrapperTouchStart);
        removeEventListener(document, "mouseup", this.onDocumentMouseUp);
        removeEventListener(document, "touchend", this.onDocumentTouchEnd);
        removeEventListener(this.handle, "click", this.onHandleClick);
        removeEventListener(window, "resize", this.onWindowResize);
        this.cancelAnimationFrame(this.interval)
    },
    onHandleMouseDown: function(e) {
        Cursor.refresh(e);
        preventEventDefaults(e);
        stopEventPropagation(e);
        this.activity = false;
        this.startDrag()
    },
    onHandleTouchStart: function(e) {
        Cursor.refresh(e);
        stopEventPropagation(e);
        this.activity = false;
        this.startDrag()
    },
    onDocumentMouseMove: function(e) {
        if (e.clientX - this.dragStartPosition.x === 0 && e.clientY - this.dragStartPosition.y === 0) return;
        Cursor.refresh(e);
        if (this.dragging) {
            this.activity = true;
            preventEventDefaults(e)
        }
    },
    onWrapperTouchMove: function(e) {
        Cursor.refresh(e);
        if (!this.activity && this.draggingOnDisabledAxis()) { if (this.dragging) this.stopDrag(); return }
        preventEventDefaults(e);
        this.activity = true
    },
    onWrapperMouseDown: function(e) {
        Cursor.refresh(e);
        preventEventDefaults(e);
        this.startTap()
    },
    onWrapperTouchStart: function(e) {
        Cursor.refresh(e);
        preventEventDefaults(e);
        this.startTap()
    },
    onDocumentMouseUp: function(e) {
        this.stopDrag();
        this.stopTap()
    },
    onDocumentTouchEnd: function(e) {
        this.stopDrag();
        this.stopTap()
    },
    onHandleClick: function(e) {
        if (this.activity) {
            preventEventDefaults(e);
            stopEventPropagation(e)
        }
    },
    onWindowResize: function(e) { this.reflow() },
    enable: function() {
        this.disabled = false;
        this.handle.className = this.handle.className.replace(/\s?disabled/g, "")
    },
    disable: function() {
        this.disabled =
        true;
        this.handle.className += " disabled"
    },
    reflow: function() {
        this.setWrapperOffset();
        this.bounds = this.calculateBounds();
        this.valuePrecision = this.calculateValuePrecision();
        this.updateOffsetFromValue()
    },
    getStep: function() { return [this.getStepNumber(this.value.target[0]), this.getStepNumber(this.value.target[1])] },
    getStepWidth: function() { return Math.abs(this.bounds.availWidth / this.options.steps) },
    getValue: function() { return this.value.target },
    setStep: function(x, y, snap) {
        this.setValue(this.options.steps && x >
            1 ? (x - 1) / (this.options.steps - 1) : 0, this.options.steps && y > 1 ? (y - 1) / (this.options.steps - 1) : 0, snap)
    },
    setValue: function(x, y, snap) {
        this.setTargetValue([x, y || 0]);
        if (snap) {
            this.groupCopy(this.value.current, this.value.target);
            this.updateOffsetFromValue();
            this.callAnimationCallback()
        }
    },
    startTap: function() {
        if (this.disabled || !this.options.tapping) return;
        this.tapping = true;
        this.setWrapperOffset();
        if (this.options.snap && this.options.steps) {
            var cursorXRatio = (Cursor.x - this.offset.wrapper[0]) / this.bounds.availWidth;
            var cursorYRatio =
            (Cursor.y - this.offset.wrapper[1]) / this.bounds.availHeight;
            this.setValue(this.getClosestStep(cursorXRatio), this.getClosestStep(cursorYRatio), true)
        } else this.setTargetValueByOffset([Cursor.x - this.offset.wrapper[0] - this.handle.offsetWidth / 2, Cursor.y - this.offset.wrapper[1] - this.handle.offsetHeight / 2])
    },
    stopTap: function() {
        if (this.disabled || !this.tapping) return;
        this.tapping = false;
        this.setTargetValue(this.value.current)
    },
    startDrag: function() {
        if (this.disabled) return;
        this.dragging = true;
        this.setWrapperOffset();
        this.dragStartPosition = { x: Cursor.x, y: Cursor.y };
        this.offset.mouse = [Cursor.x - Position.get(this.handle)[0], Cursor.y - Position.get(this.handle)[1]];
        if (!this.wrapper.className.match(this.options.activeClass)) this.wrapper.className += " " + this.options.activeClass;
        this.callDragStartCallback()
    },
    stopDrag: function() {
        if (this.disabled || !this.dragging) return;
        this.dragging = false;
        var deltaX = this.bounds.availWidth === 0 ? 0 : (Cursor.x - this.dragStartPosition.x) / this.bounds.availWidth,
        deltaY = this.bounds.availHeight === 0 ? 0 :
        (Cursor.y - this.dragStartPosition.y) / this.bounds.availHeight,
        delta = [deltaX, deltaY];
        var target = this.groupClone(this.value.current);
        if (this.options.slide) {
            var ratioChange = this.change;
            target[0] += ratioChange[0] * 4;
            target[1] += ratioChange[1] * 4
        }
        this.setTargetValue(target);
        this.wrapper.className = this.wrapper.className.replace(" " + this.options.activeClass, "");
        this.callDragStopCallback(delta)
    },
    callAnimationCallback: function() {
        var value = this.value.current;
        if (this.options.snap && this.options.steps > 1) value = this.getClosestSteps(value);
        if (!this.groupCompare(value, this.value.prev)) {
            if (typeof this.options.animationCallback == "function") this.options.animationCallback.call(this, value[0], value[1]);
            this.groupCopy(this.value.prev, value)
        }
    },
    callTargetCallback: function() { if (typeof this.options.callback == "function") this.options.callback.call(this, this.value.target[0], this.value.target[1]) },
    callDragStartCallback: function() { if (typeof this.options.dragStartCallback == "function") this.options.dragStartCallback.call(this, this.value.target[0], this.value.target[1]) },
    callDragStopCallback: function(delta) { if (typeof this.options.dragStopCallback == "function") this.options.dragStopCallback.call(this, this.value.target[0], this.value.target[1], delta) },
    animateWithRequestAnimationFrame: function(time) {
        if (time) {
            this.timeOffset = this.timeStamp ? time - this.timeStamp : 0;
            this.timeStamp = time
        } else this.timeOffset = 25;
        this.animate();
        this.interval = this.requestAnimationFrame(this.animateWithRequestAnimationFrame)
    },
    animate: function(direct, first) {
        if (direct && !this.dragging) return;
        if (this.dragging) {
            var prevTarget =
            this.groupClone(this.value.target);
            var offset = [Cursor.x - this.offset.wrapper[0] - this.offset.mouse[0], Cursor.y - this.offset.wrapper[1] - this.offset.mouse[1]];
            this.setTargetValueByOffset(offset, this.options.loose);
            this.change = [this.value.target[0] - prevTarget[0], this.value.target[1] - prevTarget[1]]
        }
        if (this.dragging || first) this.groupCopy(this.value.current, this.value.target);
        if (this.dragging || this.glide() || first) {
            this.updateOffsetFromValue();
            this.callAnimationCallback()
        }
    },
    glide: function() {
        var diff = [this.value.target[0] -
        this.value.current[0], this.value.target[1] - this.value.current[1]
        ];
        if (!diff[0] && !diff[1]) return false;
        if (Math.abs(diff[0]) > this.valuePrecision[0] || Math.abs(diff[1]) > this.valuePrecision[1]) {
            this.value.current[0] += diff[0] * Math.min(this.options.speed * this.timeOffset / 25, 1);
            this.value.current[1] += diff[1] * Math.min(this.options.speed * this.timeOffset / 25, 1)
        } else this.groupCopy(this.value.current, this.value.target);
        return true
    },
    updateOffsetFromValue: function() {
        if (!this.options.snap) this.offset.current = this.getOffsetsByRatios(this.value.current);
        else this.offset.current = this.getOffsetsByRatios(this.getClosestSteps(this.value.current));
        if (!this.groupCompare(this.offset.current, this.offset.prev)) {
            this.renderHandlePosition();
            this.groupCopy(this.offset.prev, this.offset.current)
        }
    },
    renderHandlePosition: function() {
        var transform = "";
        if (this.options.css3 && StylePrefix.transform) {
            this.offset.current[0] = (this.offset.current[0] < 0 ? 0 : this.offset.current[0]);
            if (this.options.horizontal) transform += "translateX(" + this.offset.current[0] + "px)";
            if (this.options.vertical) transform += " translateY(" + this.offset.current[1] + "px)";
            this.handle.style[StylePrefix.transform] =
            transform;
            return
        }
        if (this.options.horizontal) this.handle.style.left = this.offset.current[0] + "px";
        if (this.options.vertical) this.handle.style.top = this.offset.current[1] + "px"
    },
setTargetValue: function(value, loose) {
    var target = loose ? this.getLooseValue(value) : this.getProperValue(value);
    this.groupCopy(this.value.target, target);
    this.offset.target = this.getOffsetsByRatios(target);
    this.callTargetCallback()
},
setTargetValueByOffset: function(offset, loose) {
    var value = this.getRatiosByOffsets(offset);
    var target = loose ?
    this.getLooseValue(value) : this.getProperValue(value);
    this.groupCopy(this.value.target, target);
    this.offset.target = this.getOffsetsByRatios(target)
},
getLooseValue: function(value) { var proper = this.getProperValue(value); return [proper[0] + (value[0] - proper[0]) / 4, proper[1] + (value[1] - proper[1]) / 4] },
getProperValue: function(value) {
            /*
            2018.05.17 ìˆ˜ì •
            proper[0] = Math.max(proper[0], 0); -> proper[0] = Math.max(proper[0], -1);
            
            proper[0](= x)ê°’ì´ 0ë°‘ìœ¼ë¡œ ì•ˆ ë–¨ì–´ì ¸(Math.max(proper[0], 0))
            ë§ˆìš°ìŠ¤ê°€ ì™¼ìª½ìœ¼ë¡œ ì´ë™í•  ë•Œ -ë°©í–¥ìœ¼ë¡œ ì´ë™í•œ ë§Œí¼ì„ ë”í•´ì¤„ ìˆ˜ ì—†ê¸° ë•Œë¬¸ì— -1(Math.max(proper[0], -1))ë¡œ ìˆ˜ì • 
            */
            var proper = this.groupClone(value);
            proper[0] = Math.max(proper[0], -1);
            proper[1] = Math.max(proper[1], 0);
            proper[0] = Math.min(proper[0], 1);
            proper[1] = Math.min(proper[1], 1);
            if (!this.dragging &&
                !this.tapping || this.options.snap)
                if (this.options.steps > 1) proper = this.getClosestSteps(proper);
            return proper
        },
        getRatiosByOffsets: function(group) { return [this.getRatioByOffset(group[0], this.bounds.availWidth, this.bounds.left), this.getRatioByOffset(group[1], this.bounds.availHeight, this.bounds.top)] },
        getRatioByOffset: function(offset, range, padding) { return range ? (offset - padding) / range : 0 },
        getOffsetsByRatios: function(group) {
            return [this.getOffsetByRatio(group[0], this.bounds.availWidth, this.bounds.left), this.getOffsetByRatio(group[1],
                this.bounds.availHeight, this.bounds.top)]
        },
        getOffsetByRatio: function(ratio, range, padding) { return Math.round(ratio * range) + padding },
        getStepNumber: function(value) { return this.getClosestStep(value) * (this.options.steps - 1) + 1 },
        getClosestSteps: function(group) { return [this.getClosestStep(group[0]), this.getClosestStep(group[1])] },
        getClosestStep: function(value) {
            var k = 0;
            var min = 1;
            for (var i = 0; i <= this.options.steps - 1; i++)
                if (Math.abs(this.stepRatios[i] - value) < min) {
                    min = Math.abs(this.stepRatios[i] - value);
                    k = i
                }
                return this.stepRatios[k]
            },
            groupCompare: function(a, b) { return a[0] == b[0] && a[1] == b[1] },
            groupCopy: function(a, b) {
                a[0] = b[0];
                a[1] = b[1]
            },
            groupClone: function(a) { return [a[0], a[1]] },
            draggingOnDisabledAxis: function() { return !this.options.horizontal && Cursor.xDiff > Cursor.yDiff || !this.options.vertical && Cursor.yDiff > Cursor.xDiff }
        };
        var bind = function(fn, context) { return function() { return fn.apply(context, arguments) } };
        var addEventListener = function(element, type, callback) {
            if (element.addEventListener) element.addEventListener(type, callback, false);
            else if (element.attachEvent) element.attachEvent("on" + type, callback)
        };
    var removeEventListener = function(element, type, callback) {
        if (element.removeEventListener) element.removeEventListener(type, callback, false);
        else if (element.detachEvent) element.detachEvent("on" + type, callback)
    };
var preventEventDefaults = function(e) {
    if (!e) e = window.event;
    if (e.preventDefault) e.preventDefault();
    e.returnValue = false
};
var stopEventPropagation = function(e) {
    if (!e) e = window.event;
    if (e.stopPropagation) e.stopPropagation();
    e.cancelBubble =
    true
};
var Cursor = {
    x: 0,
    y: 0,
    xDiff: 0,
    yDiff: 0,
    refresh: function(e) {
        if (!e) e = window.event;
        if (e.type == "mousemove") this.set(e);
        else if (e.touches) this.set(e.touches[0])
    },
set: function(e) {
    var lastX = this.x,
    lastY = this.y;
    if (e.clientX || e.clientY) {
        this.x = e.clientX;
        this.y = e.clientY
    } else if (e.pageX || e.pageY) {
        this.x = e.pageX - document.body.scrollLeft - document.documentElement.scrollLeft;
        this.y = e.pageY - document.body.scrollTop - document.documentElement.scrollTop
    }
    this.xDiff = Math.abs(this.x - lastX);
    this.yDiff = Math.abs(this.y - lastY);
}
};
var Position = { get: function(obj) { var rect = { left: 0, top: 0 }; if (obj.getBoundingClientRect !== undefined) rect = obj.getBoundingClientRect(); return [rect.left, rect.top] } };
var StylePrefix = { transform: getPrefixedStylePropName("transform"), perspective: getPrefixedStylePropName("perspective"), backfaceVisibility: getPrefixedStylePropName("backfaceVisibility") };

function getPrefixedStylePropName(propName) {
    var domPrefixes = "Webkit Moz ms O".split(" "),
    elStyle = document.documentElement.style;
    if (elStyle[propName] !==
        undefined) return propName;
        propName = propName.charAt(0).toUpperCase() + propName.substr(1);
    for (var i = 0; i < domPrefixes.length; i++)
        if (elStyle[domPrefixes[i] + propName] !== undefined) return domPrefixes[i] + propName
    }

function triggerWebkitHardwareAcceleration(element) {
    if (StylePrefix.backfaceVisibility && StylePrefix.perspective) {
        element.style[StylePrefix.perspective] = "1000px";
        element.style[StylePrefix.backfaceVisibility] = "hidden"
    }
}
var vendors = ["webkit", "moz"];
var requestAnimationFrame = window.requestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame;
for (var x = 0; x < vendors.length && !requestAnimationFrame; ++x) {
    requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"]
}
if (!requestAnimationFrame) {
    requestAnimationFrame = function(callback) { return setTimeout(callback, 25) };
    cancelAnimationFrame = clearTimeout
}
return Dragdealer
});


$(function() {

    var tabs, slider;
    var totalList, sortList = [],
    listCon1, list1, lists1, lists2, list1W, thumW, isDrag = false,
    dragX = 0,
        lastestX = 0, // 2018.05.17 ì¶”ê°€
        timer, list1X = 0,
        sliderX = 0, // 2018.05.17 ì¶”ê°€ 
        sliderWidth = 0, // 2018.05.17 ì¶”ê°€
        isMove = false;

        tabs = $('.pip_gallery_new .tab_nav li button');

        thumW = 420;

        listCon1 = $('#thum-list-1');
        list1 = $('#thum-list-1 .thum_list');
        lists1 = $('#thum-list-1 .thum_list>li');

    // 2018.05.17 ì¶”ê°€
    sliderWidth = $("#slider-con").width - $("#slider-con .handle").width();

    $(listCon1).width(thumW * lists1.length);

    list1W = $(list1).width() - $('.pip_gallery_new').width();

    totalList = $('.thum_list>li');
    $(totalList).each(function(index) {
        var obj = {};
        $(this).attr('idx', index);
        obj.filter = $(this).attr('data-filter');
        obj.type = $(this).attr('data-type');
        obj.url = $(this).attr('data-url');
        sortList.push(obj);

    });

    totalList.on('click', function(e) {
        openPopup($(e.currentTarget).attr('idx'));
    })

    tabs.on('click', function(e) {
        tabs.removeClass('active');
        $(e.currentTarget).addClass('active');
        sortTab($(e.currentTarget).attr('data-filter'))
    })

    $(window).resize(function() {
        resize();
    });
    setTimeout(resize, 1000);
    setTimeout(resize, 3000);
    var sortTab = function(filterName) {

        var idx = 0;
        $(lists1).removeClass('first')
        $(lists1).removeClass('last')
        $(lists2).removeClass('first')
        $(lists2).removeClass('last')
        while (sortList.length) {
            sortList.pop();
        }
        if (filterName == 'all') {
            $(lists1).css('display', 'block');
            $(lists2).css('display', 'block');
            $(totalList).each(function(index) {
                var obj = {};
                $(this).attr('idx', index);
                obj.filter = $(this).attr('data-filter');
                obj.type = $(this).attr('data-type');
                obj.url = $(this).attr('data-url');
                sortList.push(obj);
            });
        } else {
            $(lists1).each(function(index) {
                var obj1 = {};
                if ($(this).attr('data-filter') != filterName) {
                    $(this).css('display', 'none');
                    $(this).attr('idx', '');
                } else {
                    $(this).css('display', 'block');
                    $(this).attr('idx', idx);

                    idx++;

                    obj1.filter = $(this).attr('data-filter');
                    obj1.type = $(this).attr('data-type');
                    obj1.url = $(this).attr('data-url');

                    sortList.push(obj1);
                }
            });
            $(lists2).each(function(index) {
                var obj2 = {};
                if ($(this).attr('data-filter') != filterName) {
                    $(this).css('display', 'none');
                    $(this).attr('idx', '');
                } else {
                    $(this).css('display', 'block');
                    $(this).attr('idx', idx);
                    idx++;
                    obj2.filter = $(this).attr('data-filter');
                    obj2.type = $(this).attr('data-type');
                    obj2.url = $(this).attr('data-url');

                    sortList.push(obj2);
                }
            });
        }
        $('#thum-list-1 .thum_list').find('li:visible').first().addClass('first')
        $('#thum-list-1 .thum_list').find('li:visible').last().addClass('last')
        $('#thum-list-2 .thum_list').find('li:visible').first().addClass('first')
        $('#thum-list-2 .thum_list').find('li:visible').last().addClass('last')

        resize();
        setTimeout(resize, 100);
        setTimeout(resize, 500);
    }

    var moveThum = function() {
        isMove = true;
        list1X = $(list1).position().left;
        list1X = list1X + 0.05 * (dragX * list1W * -1 - list1X);

        if ((!isDrag) && (Math.abs(list1X - dragX * list1W * -1) < 0.3)) {

            list1X = dragX * list1W * -1;

            isMove = false;
            clearInterval(timer);

        }
        if (!$('#tumb-wrap .handle').hasClass('disabled')) {
            if (list1X > 0) {
                list1X = 0;
                // isMove = false;
                // clearInterval(timer);
            }
        }
        /* //2018.05.29 ìˆ˜ì • */

        $(list1).css('left', list1X);

    }


    var resize = function() {
        var w = $('.pip_gallery_new').width();
        list1W = $(list1).width() - $('.pip_gallery_new').width();
        if ($(list1).width() < w) {

            slider.setValue(0.5, 0, snap = false);
            slider.disable();
            $('#slider-con').css('opacity', 0.5);

            moveSlider.disable();

        } else {
            slider.enable();
            $('#slider-con').css('opacity', 1);
            slider.setValue(0, 0, snap = false);

            moveSlider.enable();
            moveSlider.setValue(0, 0, snap = false);

        }
        thumW = $(lists1[0]).outerWidth() + 20;
        $(listCon1).width(thumW * lists1.length);
        if ($(listCon1).width() < w) $(listCon1).width(w);
        if (!isMove) {

            clearInterval(timer);
            timer = setInterval(moveThum, 1000 / 60);
        }

        // 2018.05.17 ì¶”ê°€ ì°½ì˜ í¬ê¸°ê°€ ë°”ë€”ë•Œë§ˆë‹¤ ì´ë™ê°€ëŠ¥í•œ ìŠ¬ë¼ì´ë”ì˜ í¬ê¸°(sliderWidth)
        sliderWidth = $("#slider-con").width() - $("#slider-con .handle").width();
    }

    slider = new Dragdealer('slider-con', {
        slide: false,
        dragStartCallback: function(x, y) {
            if (!isMove) {
                timer = setInterval(moveThum, 1000 / 60)
            };
            isDrag = true;
        },
        dragStopCallback: function(x, y) {
            /* 
            2018.05.17 ì¶”ê°€
            ìŠ¬ë¼ì´ë”ë¡œ ìˆ˜ì •í•œ ë¦¬ìŠ¤íŠ¸ì˜ ì´ë™ê°’ì´ ê·¸ëŒ€ë¡œ ë§ˆìš°ìŠ¤ë¥¼ ì‚¬ìš©í• ë•Œë„
            ìžˆì–´ì•¼ ëŠê¸°ì§€ ì•Šê³  ì´ë™ì´ ë˜ë¯€ë¡œ ë§ˆì§€ë§‰ ê°’ ì €ìž¥ (x = dragX) 
            */
            lastestX = dragX;

            isDrag = false;

        },
        animationCallback: function(x, y) {
            x = x < 0 ? 0 : x;
            dragX = x;
            //console.log(dragX)
            /*
            2018.05.17 ì¶”ê°€
            dragdealer getProperValue ë©”ì„œë“œì˜ properê°’ì˜ ìµœì†Œê°’ì„ 0ì—ì„œ -1ë¡œ ë°”ê¾¸ë©´ì„œ
            ìŠ¬ë¼ì´ë” ë²„íŠ¼ì´ ìŠ¬ë¼ì´ë”ì˜ ì™¼ìª½ì„ ë²—ì–´ë‚˜ì„œ ì´ë™í•˜ëŠ” ë¬¸ì œ(trnaslateX < 0)ë¥¼ translateX : 0ìœ¼ë¡œ ë°”ê¾¸ë©´ì„œ í•´ê²°
            */
            if ($('#slider-con .handle').css('transform').split(',')[4] < 0) {
                $('#slider-con .handle').css({
                    'transform': 'translateX(' + 0 + 'px' + ')'
                });
            }

        }
    });

    // 2018.05.17 ì¶”ê°€ Swipe ê°ì²´ ì¶”ê°€
    var moveSlider;
    var conW = $('#slider-con').outerWidth() - $('#slider-con .handle').outerWidth();

    (function() {
        var elw = -1;
        $('#tumb-wrap .thum_list_con .thum_list').each(function() {
            elw = elw > $(this).width() ? elw : $(this).width();
        });
        $('#tumb-wrap .handle').width(elw);
    })()


    moveSlider = new Dragdealer('tumb-wrap', {
        slide: false,
        css3: false,
        dragStartCallback: function(x, y) {
            if (!isMove) {
                timer = setInterval(moveThum, 1000 / 60);
            };
            isDrag = true;
        },
        dragStopCallback: function(x, y) {
            //console.log(x,y);
            lastestX = dragX;
            isDrag = false;
        },
        animationCallback: function(x, y) {
            dragX = lastestX + x;
            dragX = dragX < 0 ? 0 : dragX;
            dragX = dragX > 1 ? 1 : dragX;

            sliderX = dragX * conW;
            sliderX = sliderX < 0 ? 0 : sliderX;
            sliderX = sliderX > sliderWidth ? sliderWidth : sliderX;
            $('#slider-con .handle').css({
                'transform': 'translateX(' + sliderX + 'px' + ')'
            });
        }
    });

    resize();
    sortTab('all');
    tabs.eq(0).trigger('click');


})

