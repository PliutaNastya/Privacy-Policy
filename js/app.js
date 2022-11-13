(() => {
    "use strict";
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    let links = document.querySelectorAll(".menu__link");
    for (let link of links) link.onclick = () => {
        document.documentElement.classList.remove("lock", "menu-open");
    };
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if ("last" === place || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if ("first" === place) {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (void 0 !== parent.children[index]) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if ("min" === this.type) arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return -1;
                    if ("last" === a.place || "first" === b.place) return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if ("first" === a.place || "last" === b.place) return 1;
                        if ("last" === a.place || "first" === b.place) return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    function Util() {}
    Util.hasClass = function(el, className) {
        if (el.classList) return el.classList.contains(className); else return !!el.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
    };
    Util.addClass = function(el, className) {
        var classList = className.split(" ");
        if (el.classList) el.classList.add(classList[0]); else if (!Util.hasClass(el, classList[0])) el.className += " " + classList[0];
        if (classList.length > 1) Util.addClass(el, classList.slice(1).join(" "));
    };
    Util.removeClass = function(el, className) {
        var classList = className.split(" ");
        if (el.classList) el.classList.remove(classList[0]); else if (Util.hasClass(el, classList[0])) {
            var reg = new RegExp("(\\s|^)" + classList[0] + "(\\s|$)");
            el.className = el.className.replace(reg, " ");
        }
        if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(" "));
    };
    Util.toggleClass = function(el, className, bool) {
        if (bool) Util.addClass(el, className); else Util.removeClass(el, className);
    };
    Util.setAttributes = function(el, attrs) {
        for (var key in attrs) el.setAttribute(key, attrs[key]);
    };
    Util.getChildrenByClassName = function(el, className) {
        el.children;
        var childrenByClass = [];
        for (var i = 0; i < el.children.length; i++) if (Util.hasClass(el.children[i], className)) childrenByClass.push(el.children[i]);
        return childrenByClass;
    };
    Util.is = function(elem, selector) {
        if (selector.nodeType) return elem === selector;
        var qa = "string" === typeof selector ? document.querySelectorAll(selector) : selector, length = qa.length;
        while (length--) if (qa[length] === elem) return true;
        return false;
    };
    Util.setHeight = function(start, to, element, duration, cb) {
        var change = to - start, currentTime = null;
        var animateHeight = function(timestamp) {
            if (!currentTime) currentTime = timestamp;
            var progress = timestamp - currentTime;
            var val = parseInt(progress / duration * change + start);
            element.style.height = val + "px";
            if (progress < duration) window.requestAnimationFrame(animateHeight); else cb();
        };
        element.style.height = start + "px";
        window.requestAnimationFrame(animateHeight);
    };
    Util.scrollTo = function(final, duration, cb) {
        var start = window.scrollY || document.documentElement.scrollTop, currentTime = null;
        var animateScroll = function(timestamp) {
            if (!currentTime) currentTime = timestamp;
            var progress = timestamp - currentTime;
            if (progress > duration) progress = duration;
            var val = Math.easeInOutQuad(progress, start, final - start, duration);
            window.scrollTo(0, val);
            if (progress < duration) window.requestAnimationFrame(animateScroll); else cb && cb();
        };
        window.requestAnimationFrame(animateScroll);
    };
    Util.moveFocus = function(element) {
        if (!element) element = document.getElementsByTagName("body")[0];
        element.focus();
        if (document.activeElement !== element) {
            element.setAttribute("tabindex", "-1");
            element.focus();
        }
    };
    Util.getIndexInArray = function(array, el) {
        return Array.prototype.indexOf.call(array, el);
    };
    Util.cssSupports = function(property, value) {
        if ("CSS" in window) return CSS.supports(property, value); else {
            var jsProperty = property.replace(/-([a-z])/g, (function(g) {
                return g[1].toUpperCase();
            }));
            return jsProperty in document.body.style;
        }
    };
    Util.extend = function() {
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;
        if ("[object Boolean]" === Object.prototype.toString.call(arguments[0])) {
            deep = arguments[0];
            i++;
        }
        var merge = function(obj) {
            for (var prop in obj) if (Object.prototype.hasOwnProperty.call(obj, prop)) if (deep && "[object Object]" === Object.prototype.toString.call(obj[prop])) extended[prop] = extend(true, extended[prop], obj[prop]); else extended[prop] = obj[prop];
        };
        for (;i < length; i++) {
            var obj = arguments[i];
            merge(obj);
        }
        return extended;
    };
    if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    if (!Element.prototype.closest) Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (null !== el && 1 === el.nodeType);
        return null;
    };
    if ("function" !== typeof window.CustomEvent) {
        function CustomEvent(event, params) {
            params = params || {
                bubbles: false,
                cancelable: false,
                detail: void 0
            };
            var evt = document.createEvent("CustomEvent");
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }
        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
    }
    Math.easeInOutQuad = function(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };
    (function() {
        var LanguagePicker = function(element) {
            this.element = element;
            this.select = this.element.getElementsByTagName("select")[0];
            this.options = this.select.getElementsByTagName("option");
            this.selectedOption = getSelectedOptionText(this);
            this.pickerId = this.select.getAttribute("id");
            this.trigger = false;
            this.dropdown = false;
            this.firstLanguage = false;
            this.svgPath = '<svg viewBox="0 0 10 7"><path d="M1 1.5L5 5.5L9 1.5" fill="transparent" stroke="#0360D9" stroke-width="2" stroke-linecap="round"/></svg>';
            initLanguagePicker(this);
            initLanguagePickerEvents(this);
        };
        function initLanguagePicker(picker) {
            picker.element.insertAdjacentHTML("beforeend", initButtonPicker(picker) + initListPicker(picker));
            picker.dropdown = picker.element.getElementsByClassName("language-picker__dropdown")[0];
            picker.firstLanguage = picker.dropdown.getElementsByClassName("language-picker__item")[0];
            picker.trigger = picker.element.getElementsByClassName("language-picker__button")[0];
        }
        function initLanguagePickerEvents(picker) {
            Util.addClass(picker.trigger.getElementsByTagName("svg")[0], "icon");
            initLanguageSelection(picker);
            picker.trigger.addEventListener("click", (function() {
                toggleLanguagePicker(picker, false);
            }));
        }
        function toggleLanguagePicker(picker, bool) {
            var ariaExpanded;
            if (bool) ariaExpanded = bool; else ariaExpanded = "true" == picker.trigger.getAttribute("aria-expanded") ? "false" : "true";
            picker.trigger.setAttribute("aria-expanded", ariaExpanded);
            if ("true" == ariaExpanded) {
                picker.firstLanguage.focus();
                picker.dropdown.addEventListener("transitionend", (function cb() {
                    picker.firstLanguage.focus();
                    picker.dropdown.removeEventListener("transitionend", cb);
                }));
            }
        }
        function checkLanguagePickerClick(picker, target) {
            if (!picker.element.contains(target)) toggleLanguagePicker(picker, "false");
        }
        function moveFocusToPickerTrigger(picker) {
            if ("false" == picker.trigger.getAttribute("aria-expanded")) return;
            if (document.activeElement.closest(".language-picker__dropdown") == picker.dropdown) picker.trigger.focus();
        }
        function initButtonPicker(picker) {
            var customClasses = picker.element.getAttribute("data-trigger-class") ? " " + picker.element.getAttribute("data-trigger-class") : "";
            var button = '<button class="language-picker__button' + customClasses + '" aria-label="' + picker.select.value + " " + picker.element.getElementsByTagName("label")[0].innerText + '" aria-expanded="false" aria-contols="' + picker.pickerId + '-dropdown">';
            button = button + '<span aria-hidden="true" class="language-picker__label language-picker__flag language-picker__flag--' + picker.select.value + '"><em>' + picker.selectedOption + "</em>";
            button = button + picker.svgPath + "</span>";
            return button + "</button>";
        }
        function initListPicker(picker) {
            var list = '<div class="language-picker__dropdown" aria-describedby="' + picker.pickerId + '-description" id="' + picker.pickerId + '-dropdown">';
            list = list + '<p class="sr-only" id="' + picker.pickerId + '-description">' + picker.element.getElementsByTagName("label")[0].innerText + "</p>";
            list += '<ul class="language-picker__list" role="listbox">';
            for (var i = 0; i < picker.options.length; i++) {
                var selected = picker.options[i].hasAttribute("selected") ? ' aria-selected="true"' : "", language = picker.options[i].getAttribute("lang");
                list = list + '<li><a lang="' + language + '" hreflang="' + language + '" href="' + getLanguageUrl(picker.options[i]) + '"' + selected + ' role="option" data-value="' + picker.options[i].value + '" class="language-picker__item language-picker__flag language-picker__flag--' + picker.options[i].value + '"><span>' + picker.options[i].text + "</span></a></li>";
            }
            return list;
        }
        function getSelectedOptionText(picker) {
            var label = "";
            if ("selectedIndex" in picker.select) label = picker.options[picker.select.selectedIndex].text; else label = picker.select.querySelector("option[selected]").text;
            return label;
        }
        function getLanguageUrl(option) {
            return "#";
        }
        function initLanguageSelection(picker) {
            picker.element.getElementsByClassName("language-picker__list")[0].addEventListener("click", (function(event) {
                var language = event.target.closest(".language-picker__item");
                if (!language) return;
                if (language.hasAttribute("aria-selected") && "true" == language.getAttribute("aria-selected")) {
                    event.preventDefault();
                    picker.trigger.setAttribute("aria-expanded", "false");
                } else {
                    event.preventDefault();
                    picker.element.getElementsByClassName("language-picker__list")[0].querySelector('[aria-selected="true"]').removeAttribute("aria-selected");
                    language.setAttribute("aria-selected", "true");
                    picker.trigger.getElementsByClassName("language-picker__label")[0].setAttribute("class", "language-picker__label language-picker__flag language-picker__flag--" + language.getAttribute("data-value"));
                    picker.trigger.getElementsByClassName("language-picker__label")[0].getElementsByTagName("em")[0].innerText = language.innerText;
                    picker.trigger.setAttribute("aria-expanded", "false");
                }
            }));
        }
        var languagePicker = document.getElementsByClassName("js-language-picker");
        if (languagePicker.length > 0) {
            var pickerArray = [];
            for (var i = 0; i < languagePicker.length; i++) (function(i) {
                pickerArray.push(new LanguagePicker(languagePicker[i]));
            })(i);
            window.addEventListener("keyup", (function(event) {
                if (event.keyCode && 27 == event.keyCode || event.key && "escape" == event.key.toLowerCase()) pickerArray.forEach((function(element) {
                    moveFocusToPickerTrigger(element);
                    toggleLanguagePicker(element, "false");
                }));
            }));
            window.addEventListener("click", (function(event) {
                pickerArray.forEach((function(element) {
                    checkLanguagePickerClick(element, event.target);
                }));
            }));
        }
    })();
    window["FLS"] = true;
    menuInit();
})();