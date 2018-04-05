"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var markdownIt = require("markdown-it");
var markdownProcessor = new markdownIt();
function processMarkdown(text) {
    return markdownProcessor.render(text);
}
exports.processMarkdown = processMarkdown;
function getValueOrDefault(obj, defaultValue) {
    return obj ? obj : defaultValue;
}
exports.getValueOrDefault = getValueOrDefault;
function isNullOrEmpty(value) {
    return value === undefined || value === null || value === "";
}
exports.isNullOrEmpty = isNullOrEmpty;
function appendChild(node, child) {
    if (child != null && child != undefined) {
        node.appendChild(child);
    }
}
exports.appendChild = appendChild;
function renderSeparation(separationDefinition, orientation) {
    var separator = document.createElement("div");
    if (orientation == "vertical") {
        if (separationDefinition.lineThickness) {
            separator.style.marginTop = (separationDefinition.spacing / 2) + "px";
            separator.style.paddingTop = (separationDefinition.spacing / 2) + "px";
            separator.style.borderTop = separationDefinition.lineThickness + "px solid " + stringToCssColor(separationDefinition.lineColor);
        }
        else {
            separator.style.height = separationDefinition.spacing + "px";
        }
    }
    else {
        if (separationDefinition.lineThickness) {
            separator.style.marginLeft = (separationDefinition.spacing / 2) + "px";
            separator.style.paddingLeft = (separationDefinition.spacing / 2) + "px";
            separator.style.borderLeft = separationDefinition.lineThickness + "px solid " + stringToCssColor(separationDefinition.lineColor);
        }
        else {
            separator.style.width = separationDefinition.spacing + "px";
        }
    }
    return separator;
}
exports.renderSeparation = renderSeparation;
function stringToCssColor(color) {
    var regEx = /#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})?/gi;
    var matches = regEx.exec(color);
    if (matches && matches[4]) {
        var a = parseInt(matches[1], 16) / 255;
        var r = parseInt(matches[2], 16);
        var g = parseInt(matches[3], 16);
        var b = parseInt(matches[4], 16);
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }
    else {
        return color;
    }
}
exports.stringToCssColor = stringToCssColor;
var StringWithSubstitutions = /** @class */ (function () {
    function StringWithSubstitutions() {
        this._isProcessed = false;
        this._original = null;
        this._processed = null;
    }
    StringWithSubstitutions.prototype.substituteInputValues = function (inputs) {
        this._processed = this._original;
        var regEx = /\{{2}([a-z0-9_$@]+).value\}{2}/gi;
        var matches;
        while ((matches = regEx.exec(this._original)) != null) {
            var matchedInput = null;
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].id.toLowerCase() == matches[1].toLowerCase()) {
                    matchedInput = inputs[i];
                    break;
                }
            }
            if (matchedInput) {
                this._processed = this._processed.replace(matches[0], matchedInput.value ? matchedInput.value : "");
            }
        }
        ;
        this._isProcessed = true;
    };
    StringWithSubstitutions.prototype.get = function () {
        if (!this._isProcessed) {
            return this._original;
        }
        else {
            return this._processed;
        }
    };
    StringWithSubstitutions.prototype.set = function (value) {
        this._original = value;
        this._isProcessed = false;
    };
    return StringWithSubstitutions;
}());
exports.StringWithSubstitutions = StringWithSubstitutions;
//# sourceMappingURL=utils.js.map