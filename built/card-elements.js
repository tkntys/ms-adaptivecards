"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Enums = require("./enums");
var Utils = require("./utils");
var TextFormatters = require("./text-formatters");
function invokeSetParent(obj, parent) {
    // This is not super pretty, but it the closest emulation of
    // "internal" in TypeScript.
    obj["setParent"](parent);
}
function isActionAllowed(action, forbiddenActionTypes) {
    if (forbiddenActionTypes) {
        for (var i = 0; i < forbiddenActionTypes.length; i++) {
            if (action.getJsonTypeName() === forbiddenActionTypes[i]) {
                return false;
            }
        }
    }
    return true;
}
function isElementAllowed(element, forbiddenElementTypes) {
    if (!hostConfig.supportsInteractivity && element.isInteractive) {
        return false;
    }
    if (forbiddenElementTypes) {
        for (var i = 0; i < forbiddenElementTypes.length; i++) {
            if (element.getJsonTypeName() === forbiddenElementTypes[i]) {
                return false;
            }
        }
    }
    return true;
}
var CardElement = /** @class */ (function () {
    function CardElement() {
        this._parent = null;
        this.horizontalAlignment = "left";
        this.separation = "default";
    }
    CardElement.prototype.internalGetNonZeroPadding = function (element, padding) {
        if (padding.top == 0) {
            padding.top = element.padding.top;
        }
        if (padding.right == 0) {
            padding.right = element.padding.right;
        }
        if (padding.bottom == 0) {
            padding.bottom = element.padding.bottom;
        }
        if (padding.left == 0) {
            padding.left = element.padding.left;
        }
        if (element.parent) {
            this.internalGetNonZeroPadding(element.parent, padding);
        }
    };
    CardElement.prototype.showBottomSpacer = function (requestingElement) {
        if (this.parent) {
            this.parent.showBottomSpacer(this);
        }
    };
    CardElement.prototype.hideBottomSpacer = function (requestingElement) {
        if (this.parent) {
            this.parent.hideBottomSpacer(this);
        }
    };
    CardElement.prototype.setParent = function (value) {
        this._parent = value;
    };
    Object.defineProperty(CardElement.prototype, "useDefaultSizing", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardElement.prototype, "padding", {
        get: function () {
            return { top: 0, right: 0, bottom: 0, left: 0 };
        },
        enumerable: true,
        configurable: true
    });
    CardElement.prototype.getNonZeroPadding = function () {
        var padding = { top: 0, right: 0, bottom: 0, left: 0 };
        this.internalGetNonZeroPadding(this, padding);
        return padding;
    };
    CardElement.prototype.getForbiddenElementTypes = function () {
        return null;
    };
    CardElement.prototype.getForbiddenActionTypes = function () {
        return null;
    };
    CardElement.prototype.parse = function (json) {
        this.speak = json["speak"];
        this.horizontalAlignment = Utils.getValueOrDefault(json["horizontalAlignment"], "left");
        this.separation = Utils.getValueOrDefault(json["separation"], "default");
    };
    CardElement.prototype.validate = function () {
        return [];
    };
    CardElement.prototype.render = function () {
        var renderedElement = this.internalRender();
        if (renderedElement != null) {
            renderedElement.style.boxSizing = "border-box";
        }
        return renderedElement;
    };
    CardElement.prototype.isLastItem = function (item) {
        return this.parent ? this.parent.isLastItem(item) : true;
    };
    CardElement.prototype.getRootElement = function () {
        var rootElement = this;
        while (rootElement.parent) {
            rootElement = rootElement.parent;
        }
        return rootElement;
    };
    CardElement.prototype.getAllInputs = function () {
        return [];
    };
    Object.defineProperty(CardElement.prototype, "isInteractive", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardElement.prototype, "isStandalone", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardElement.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    return CardElement;
}());
exports.CardElement = CardElement;
var TextBlock = /** @class */ (function (_super) {
    __extends(TextBlock, _super);
    function TextBlock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.size = "normal";
        _this.weight = "normal";
        _this.isSubtle = false;
        _this.wrap = false;
        return _this;
    }
    TextBlock.prototype.internalRender = function () {
        if (!Utils.isNullOrEmpty(this.text)) {
            var element = document.createElement("div");
            if (hostConfig.fontFamily) {
                element.style.fontFamily = hostConfig.fontFamily;
            }
            switch (this.horizontalAlignment) {
                case "center":
                    element.style.textAlign = "center";
                    break;
                case "right":
                    element.style.textAlign = "right";
                    break;
                default:
                    element.style.textAlign = "left";
                    break;
            }
            var cssStyle = "text ";
            var fontSize;
            switch (this.size) {
                case "small":
                    fontSize = hostConfig.fontSizes.small;
                    break;
                case "medium":
                    fontSize = hostConfig.fontSizes.medium;
                    break;
                case "large":
                    fontSize = hostConfig.fontSizes.large;
                    break;
                case "extraLarge":
                    fontSize = hostConfig.fontSizes.extraLarge;
                    break;
                default:
                    fontSize = hostConfig.fontSizes.normal;
                    break;
            }
            // Looks like 1.33 is the magic number to compute line-height
            // from font size.
            var computedLineHeight = fontSize * 1.33;
            element.style.fontSize = fontSize + "px";
            element.style.lineHeight = computedLineHeight + "px";
            var actualTextColor = this.color ? this.color : hostConfig.textBlock.color;
            var colorDefinition;
            switch (actualTextColor) {
                case "dark":
                    colorDefinition = hostConfig.colors.dark;
                    break;
                case "light":
                    colorDefinition = hostConfig.colors.light;
                    break;
                case "accent":
                    colorDefinition = hostConfig.colors.accent;
                    break;
                case "good":
                    colorDefinition = hostConfig.colors.good;
                    break;
                case "warning":
                    colorDefinition = hostConfig.colors.warning;
                    break;
                case "attention":
                    colorDefinition = hostConfig.colors.attention;
                    break;
                default:
                    colorDefinition = hostConfig.colors.dark;
                    break;
            }
            element.style.color = Utils.stringToCssColor(this.isSubtle ? colorDefinition.subtle : colorDefinition.normal);
            var fontWeight;
            switch (this.weight) {
                case "lighter":
                    fontWeight = hostConfig.fontWeights.lighter;
                    break;
                case "bolder":
                    fontWeight = hostConfig.fontWeights.bolder;
                    break;
                default:
                    fontWeight = hostConfig.fontWeights.normal;
                    break;
            }
            element.style.fontWeight = fontWeight.toString();
            var formattedText = TextFormatters.formatText(this.text);
            element.innerHTML = Utils.processMarkdown(formattedText);
            if (element.firstElementChild instanceof HTMLElement) {
                var firstElementChild = element.firstElementChild;
                firstElementChild.style.marginTop = "0px";
                firstElementChild.style.width = "100%";
                if (!this.wrap) {
                    firstElementChild.style.overflow = "hidden";
                    firstElementChild.style.textOverflow = "ellipsis";
                }
            }
            if (element.lastElementChild instanceof HTMLElement) {
                element.lastElementChild.style.marginBottom = "0px";
            }
            var anchors = element.getElementsByTagName("a");
            for (var i = 0; i < anchors.length; i++) {
                anchors[i].target = "_blank";
            }
            if (this.wrap) {
                element.style.wordWrap = "break-word";
                if (this.maxLines > 0) {
                    element.style.maxHeight = (computedLineHeight * this.maxLines) + "px";
                    element.style.overflow = "hidden";
                }
            }
            else {
                element.style.whiteSpace = "nowrap";
            }
            return element;
        }
        else {
            return null;
        }
    };
    TextBlock.prototype.parse = function (json) {
        _super.prototype.parse.call(this, json);
        this.text = json["text"];
        this.size = Utils.getValueOrDefault(json["size"], "normal");
        this.weight = Utils.getValueOrDefault(json["weight"], "normal");
        this.color = Utils.getValueOrDefault(json["color"], hostConfig.textBlock.color);
        this.isSubtle = json["isSubtle"];
        this.wrap = json["wrap"] === undefined ? false : json["wrap"];
        this.maxLines = json["maxLines"];
    };
    TextBlock.prototype.getJsonTypeName = function () {
        return "TextBlock";
    };
    TextBlock.prototype.getDefaultSeparationDefinition = function () {
        switch (this.size) {
            case "small":
                return hostConfig.textBlock.separations.small;
            case "medium":
                return hostConfig.textBlock.separations.medium;
            case "large":
                return hostConfig.textBlock.separations.large;
            case "extraLarge":
                return hostConfig.textBlock.separations.extraLarge;
            default:
                return hostConfig.textBlock.separations.normal;
        }
    };
    TextBlock.prototype.renderSpeech = function () {
        if (this.speak != null)
            return this.speak + '\n';
        if (this.text)
            return '<s>' + this.text + '</s>\n';
        return null;
    };
    return TextBlock;
}(CardElement));
exports.TextBlock = TextBlock;
var Fact = /** @class */ (function () {
    function Fact() {
    }
    Fact.prototype.renderSpeech = function () {
        if (this.speak != null) {
            return this.speak + '\n';
        }
        return '<s>' + this.name + ' ' + this.value + '</s>\n';
    };
    return Fact;
}());
exports.Fact = Fact;
var FactSet = /** @class */ (function (_super) {
    __extends(FactSet, _super);
    function FactSet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.facts = [];
        return _this;
    }
    Object.defineProperty(FactSet.prototype, "useDefaultSizing", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    FactSet.prototype.internalRender = function () {
        var element = null;
        if (this.facts.length > 0) {
            element = document.createElement("table");
            element.style.borderWidth = "0px";
            element.style.borderSpacing = "0px";
            element.style.borderStyle = "none";
            element.style.borderCollapse = "collapse";
            element.style.display = "block";
            element.style.overflow = "hidden";
            for (var i = 0; i < this.facts.length; i++) {
                var trElement = document.createElement("tr");
                if (i > 0) {
                    trElement.style.marginTop = hostConfig.factSet.spacing + "px";
                }
                var tdElement = document.createElement("td");
                tdElement.style.padding = "0";
                if (hostConfig.factSet.title.maxWidth) {
                    tdElement.style.maxWidth = hostConfig.factSet.title.maxWidth + "px";
                }
                tdElement.style.verticalAlign = "top";
                var textBlock = new TextBlock();
                textBlock.text = this.facts[i].name;
                textBlock.size = hostConfig.factSet.title.size;
                textBlock.color = hostConfig.factSet.title.color;
                textBlock.isSubtle = hostConfig.factSet.title.isSubtle;
                textBlock.weight = hostConfig.factSet.title.weight;
                textBlock.wrap = hostConfig.factSet.title.wrap;
                textBlock.separation = "none";
                Utils.appendChild(tdElement, textBlock.render());
                Utils.appendChild(trElement, tdElement);
                tdElement = document.createElement("td");
                tdElement.style.padding = "0px 0px 0px 10px";
                tdElement.style.verticalAlign = "top";
                textBlock = new TextBlock();
                textBlock.text = this.facts[i].value;
                textBlock.size = hostConfig.factSet.value.size;
                textBlock.color = hostConfig.factSet.value.color;
                textBlock.isSubtle = hostConfig.factSet.value.isSubtle;
                textBlock.weight = hostConfig.factSet.value.weight;
                textBlock.wrap = hostConfig.factSet.value.wrap;
                textBlock.separation = "none";
                Utils.appendChild(tdElement, textBlock.render());
                Utils.appendChild(trElement, tdElement);
                Utils.appendChild(element, trElement);
            }
        }
        return element;
    };
    FactSet.prototype.getJsonTypeName = function () {
        return "FactSet";
    };
    FactSet.prototype.getDefaultSeparationDefinition = function () {
        return hostConfig.factSet.separation;
    };
    FactSet.prototype.parse = function (json) {
        _super.prototype.parse.call(this, json);
        if (json["facts"] != null) {
            var jsonFacts = json["facts"];
            for (var i = 0; i < jsonFacts.length; i++) {
                var fact = new Fact();
                fact.name = jsonFacts[i]["title"];
                fact.value = jsonFacts[i]["value"];
                fact.speak = jsonFacts[i]["speak"];
                this.facts.push(fact);
            }
        }
    };
    FactSet.prototype.renderSpeech = function () {
        if (this.speak != null) {
            return this.speak + '\n';
        }
        // render each fact
        var speak = null;
        if (this.facts.length > 0) {
            speak = '';
            for (var i = 0; i < this.facts.length; i++) {
                var speech = this.facts[i].renderSpeech();
                if (speech) {
                    speak += speech;
                }
            }
        }
        return '<p>' + speak + '\n</p>\n';
    };
    return FactSet;
}(CardElement));
exports.FactSet = FactSet;
var Image = /** @class */ (function (_super) {
    __extends(Image, _super);
    function Image() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.style = "normal";
        _this.size = "medium";
        return _this;
    }
    Object.defineProperty(Image.prototype, "useDefaultSizing", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Image.prototype.internalRender = function () {
        var _this = this;
        var element = null;
        if (!Utils.isNullOrEmpty(this.url)) {
            element = document.createElement("div");
            element.classList.add("ac-image");
            element.style.display = "flex";
            element.style.alignItems = "flex-start";
            if (this.selectAction != null) {
                element.classList.add("ac-selectable");
            }
            element.onclick = function (e) {
                if (_this.selectAction) {
                    _this.selectAction.execute();
                    e.cancelBubble = true;
                }
            };
            switch (this.horizontalAlignment) {
                case "center":
                    element.style.justifyContent = "center";
                    break;
                case "right":
                    element.style.justifyContent = "flex-end";
                    break;
                default:
                    element.style.justifyContent = "flex-start";
                    break;
            }
            var imageElement = document.createElement("img");
            imageElement.style.maxHeight = "100%";
            switch (this.size) {
                case "stretch":
                    imageElement.style.width = "100%";
                    break;
                case "auto":
                    imageElement.style.maxWidth = "100%";
                    imageElement.style.maxHeight = "500px";
                    break;
                case "small":
                    imageElement.style.maxWidth = hostConfig.imageSizes.small + "px";
                    break;
                case "large":
                    imageElement.style.maxWidth = hostConfig.imageSizes.large + "px";
                    break;
                case "medium":
                    imageElement.style.maxWidth = hostConfig.imageSizes.medium + "px";
                    break;
            }
            if (this.style == "person") {
                imageElement.style.borderRadius = "50%";
                imageElement.style.backgroundPosition = "50% 50%";
                imageElement.style.backgroundRepeat = "no-repeat";
            }
            imageElement.src = this.url;
            element.appendChild(imageElement);
        }
        return element;
    };
    Image.prototype.getJsonTypeName = function () {
        return "Image";
    };
    Image.prototype.getDefaultSeparationDefinition = function () {
        return hostConfig.image.separation;
    };
    Image.prototype.parse = function (json) {
        _super.prototype.parse.call(this, json);
        this.url = json["url"];
        this.style = Utils.getValueOrDefault(json["style"], "normal");
        this.size = Utils.getValueOrDefault(json["size"], "medium");
        var selectActionJson = json["selectAction"];
        if (selectActionJson != undefined) {
            this.selectAction = Action.createAction(selectActionJson);
            invokeSetParent(this.selectAction, this);
        }
    };
    Image.prototype.renderSpeech = function () {
        if (this.speak != null) {
            return this.speak + '\n';
        }
        return null;
    };
    return Image;
}(CardElement));
exports.Image = Image;
var ImageSet = /** @class */ (function (_super) {
    __extends(ImageSet, _super);
    function ImageSet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._images = [];
        _this.imageSize = "medium";
        return _this;
    }
    ImageSet.prototype.internalRender = function () {
        var element = null;
        if (this._images.length > 0) {
            element = document.createElement("div");
            element.style.display = "flex";
            element.style.flexWrap = "wrap";
            for (var i = 0; i < this._images.length; i++) {
                var renderedImage = this._images[i].render();
                renderedImage.style.display = "inline-flex";
                renderedImage.style.margin = "0px";
                renderedImage.style.marginRight = "10px";
                renderedImage.style.height = "100px";
                Utils.appendChild(element, renderedImage);
            }
        }
        return element;
    };
    ImageSet.prototype.getJsonTypeName = function () {
        return "ImageSet";
    };
    ImageSet.prototype.getDefaultSeparationDefinition = function () {
        return hostConfig.imageSet.separation;
    };
    ImageSet.prototype.parse = function (json) {
        _super.prototype.parse.call(this, json);
        this.imageSize = Utils.getValueOrDefault(json["imageSize"], "medium");
        if (json["images"] != null) {
            var jsonImages = json["images"];
            for (var i = 0; i < jsonImages.length; i++) {
                var image = new Image();
                image.parse(jsonImages[i]);
                image.size = this.imageSize;
                this.addImage(image);
            }
        }
    };
    ImageSet.prototype.addImage = function (image) {
        if (!image.parent) {
            this._images.push(image);
            invokeSetParent(image, this);
        }
        else {
            throw new Error("This image already belongs to another ImageSet");
        }
    };
    ImageSet.prototype.renderSpeech = function () {
        if (this.speak != null) {
            return this.speak;
        }
        var speak = null;
        if (this._images.length > 0) {
            speak = '';
            for (var i = 0; i < this._images.length; i++) {
                speak += this._images[i].renderSpeech();
            }
        }
        return speak;
    };
    return ImageSet;
}(CardElement));
exports.ImageSet = ImageSet;
var Input = /** @class */ (function (_super) {
    __extends(Input, _super);
    function Input() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Input.prototype.getDefaultSeparationDefinition = function () {
        return hostConfig.input.separation;
    };
    Input.prototype.validate = function () {
        if (!this.id) {
            return [{ error: Enums.ValidationError.PropertyCantBeNull, message: "All inputs must have a unique Id" }];
        }
        else {
            return [];
        }
    };
    Input.prototype.parse = function (json) {
        _super.prototype.parse.call(this, json);
        this.id = json["id"];
        this.defaultValue = json["value"];
    };
    Input.prototype.renderSpeech = function () {
        if (this.speak != null) {
            return this.speak;
        }
        if (this.title) {
            return '<s>' + this.title + '</s>\n';
        }
        return null;
    };
    Input.prototype.getAllInputs = function () {
        return [this];
    };
    Object.defineProperty(Input.prototype, "isInteractive", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return Input;
}(CardElement));
exports.Input = Input;
var TextInput = /** @class */ (function (_super) {
    __extends(TextInput, _super);
    function TextInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextInput.prototype.internalRender = function () {
        if (this.isMultiline) {
            this._textareaElement = document.createElement("textarea");
            this._textareaElement.className = "ac-input ac-textInput ac-multiline";
            this._textareaElement.style.width = "100%";
            if (!Utils.isNullOrEmpty(this.placeholder)) {
                this._textareaElement.placeholder = this.placeholder;
            }
            if (!Utils.isNullOrEmpty(this.defaultValue)) {
                this._textareaElement.value = this.defaultValue;
            }
            if (this.maxLength > 0) {
                this._textareaElement.maxLength = this.maxLength;
            }
            return this._textareaElement;
        }
        else {
            this._inputElement = document.createElement("input");
            this._inputElement.type = "text";
            this._inputElement.className = "ac-input ac-textInput";
            this._inputElement.style.width = "100%";
            if (!Utils.isNullOrEmpty(this.placeholder)) {
                this._inputElement.placeholder = this.placeholder;
            }
            if (!Utils.isNullOrEmpty(this.defaultValue)) {
                this._inputElement.value = this.defaultValue;
            }
            if (this.maxLength > 0) {
                this._inputElement.maxLength = this.maxLength;
            }
            return this._inputElement;
        }
    };
    TextInput.prototype.getJsonTypeName = function () {
        return "Input.Text";
    };
    TextInput.prototype.parse = function (json) {
        _super.prototype.parse.call(this, json);
        this.maxLength = json["maxLength"];
        this.isMultiline = json["isMultiline"];
        this.placeholder = json["placeholder"];
    };
    Object.defineProperty(TextInput.prototype, "value", {
        get: function () {
            if (this.isMultiline) {
                return this._textareaElement ? this._textareaElement.value : null;
            }
            else {
                return this._inputElement ? this._inputElement.value : null;
            }
        },
        enumerable: true,
        configurable: true
    });
    return TextInput;
}(Input));
exports.TextInput = TextInput;
var ToggleInput = /** @class */ (function (_super) {
    __extends(ToggleInput, _super);
    function ToggleInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ToggleInput.prototype.internalRender = function () {
        var element = document.createElement("div");
        element.className = "ac-input";
        element.style.width = "100%";
        this._checkboxInputElement = document.createElement("input");
        this._checkboxInputElement.type = "checkbox";
        this._checkboxInputElement.style.display = "inline-block";
        this._checkboxInputElement.style.verticalAlign = "middle";
        this._checkboxInputElement.style.margin = "0";
        if (this.defaultValue == this.valueOn) {
            this._checkboxInputElement.checked = true;
        }
        var label = new TextBlock();
        label.text = this.title;
        var labelElement = label.render();
        labelElement.style.display = "inline-block";
        labelElement.style.marginLeft = "6px";
        labelElement.style.verticalAlign = "middle";
        var compoundInput = document.createElement("div");
        Utils.appendChild(element, this._checkboxInputElement);
        Utils.appendChild(element, labelElement);
        return element;
    };
    ToggleInput.prototype.getJsonTypeName = function () {
        return "Input.Toggle";
    };
    ToggleInput.prototype.parse = function (json) {
        _super.prototype.parse.call(this, json);
        this.title = json["title"];
        this.valueOn = json["valueOn"];
        this.valueOff = json["valueOff"];
    };
    Object.defineProperty(ToggleInput.prototype, "value", {
        get: function () {
            if (this._checkboxInputElement) {
                return this._checkboxInputElement.checked ? this.valueOn : this.valueOff;
            }
            else {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    return ToggleInput;
}(Input));
exports.ToggleInput = ToggleInput;
var Choice = /** @class */ (function () {
    function Choice() {
    }
    return Choice;
}());
exports.Choice = Choice;
var ChoiceSetInput = /** @class */ (function (_super) {
    __extends(ChoiceSetInput, _super);
    function ChoiceSetInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.choices = [];
        return _this;
    }
    ChoiceSetInput.prototype.internalRender = function () {
        if (!this.isMultiSelect) {
            if (this.isCompact) {
                // Render as a combo box
                this._selectElement = document.createElement("select");
                this._selectElement.className = "ac-input ac-multichoiceInput";
                this._selectElement.style.width = "100%";
                var option = document.createElement("option");
                option.selected = true;
                option.disabled = true;
                option.hidden = true;
                if (this.placeholder) {
                    option.text = this.placeholder;
                }
                Utils.appendChild(this._selectElement, option);
                for (var i = 0; i < this.choices.length; i++) {
                    var option = document.createElement("option");
                    option.value = this.choices[i].value;
                    option.text = this.choices[i].title;
                    if (this.choices[i].value == this.defaultValue) {
                        option.selected = true;
                    }
                    Utils.appendChild(this._selectElement, option);
                }
                return this._selectElement;
            }
            else {
                // Render as a series of radio buttons
                var element = document.createElement("div");
                element.className = "ac-input";
                element.style.width = "100%";
                this._toggleInputs = [];
                for (var i = 0; i < this.choices.length; i++) {
                    var radioInput = document.createElement("input");
                    radioInput.type = "radio";
                    radioInput.style.margin = "0";
                    radioInput.style.display = "inline-block";
                    radioInput.style.verticalAlign = "middle";
                    radioInput.name = this.id;
                    radioInput.value = this.choices[i].value;
                    if (this.choices[i].value == this.defaultValue) {
                        radioInput.checked = true;
                    }
                    this._toggleInputs.push(radioInput);
                    var label = new TextBlock();
                    label.text = this.choices[i].title;
                    var labelElement = label.render();
                    labelElement.style.display = "inline-block";
                    labelElement.style.marginLeft = "6px";
                    labelElement.style.verticalAlign = "middle";
                    var compoundInput = document.createElement("div");
                    Utils.appendChild(compoundInput, radioInput);
                    Utils.appendChild(compoundInput, labelElement);
                    Utils.appendChild(element, compoundInput);
                }
                return element;
            }
        }
        else {
            // Render as a list of toggle inputs
            var defaultValues = this.defaultValue ? this.defaultValue.split(",") : null;
            var element = document.createElement("div");
            element.className = "ac-input";
            element.style.width = "100%";
            this._toggleInputs = [];
            for (var i = 0; i < this.choices.length; i++) {
                var checkboxInput = document.createElement("input");
                checkboxInput.type = "checkbox";
                checkboxInput.style.margin = "0";
                checkboxInput.style.display = "inline-block";
                checkboxInput.style.verticalAlign = "middle";
                checkboxInput.value = this.choices[i].value;
                if (defaultValues) {
                    if (defaultValues.indexOf(this.choices[i].value) >= 0) {
                        checkboxInput.checked = true;
                    }
                }
                this._toggleInputs.push(checkboxInput);
                var label = new TextBlock();
                label.text = this.choices[i].title;
                var labelElement = label.render();
                labelElement.style.display = "inline-block";
                labelElement.style.marginLeft = "6px";
                labelElement.style.verticalAlign = "middle";
                var compoundInput = document.createElement("div");
                Utils.appendChild(compoundInput, checkboxInput);
                Utils.appendChild(compoundInput, labelElement);
                Utils.appendChild(element, compoundInput);
            }
            return element;
        }
    };
    ChoiceSetInput.prototype.getJsonTypeName = function () {
        return "Input.ChoiceSet";
    };
    ChoiceSetInput.prototype.validate = function () {
        var result = [];
        if (this.choices.length == 0) {
            result = [{ error: Enums.ValidationError.CollectionCantBeEmpty, message: "An Input.ChoiceSet must have at least one choice defined." }];
        }
        for (var i = 0; i < this.choices.length; i++) {
            if (!this.choices[i].title || !this.choices[i].value) {
                result = result.concat([{ error: Enums.ValidationError.PropertyCantBeNull, message: "All choices in an Input.ChoiceSet must have their title and value properties set." }]);
                break;
            }
        }
        return result;
    };
    ChoiceSetInput.prototype.parse = function (json) {
        _super.prototype.parse.call(this, json);
        this.isCompact = !(json["style"] === "expanded");
        this.isMultiSelect = json["isMultiSelect"];
        this.placeholder = json["placeholder"];
        if (json["choices"] != undefined) {
            var choiceArray = json["choices"];
            for (var i = 0; i < choiceArray.length; i++) {
                var choice = new Choice();
                choice.title = choiceArray[i]["title"];
                choice.value = choiceArray[i]["value"];
                this.choices.push(choice);
            }
        }
    };
    Object.defineProperty(ChoiceSetInput.prototype, "value", {
        get: function () {
            if (!this.isMultiSelect) {
                if (this.isCompact) {
                    return this._selectElement ? this._selectElement.value : null;
                }
                else {
                    if (!this._toggleInputs || this._toggleInputs.length == 0) {
                        return null;
                    }
                    for (var i = 0; i < this._toggleInputs.length; i++) {
                        if (this._toggleInputs[i].checked) {
                            return this._toggleInputs[i].value;
                        }
                    }
                    return null;
                }
            }
            else {
                if (!this._toggleInputs || this._toggleInputs.length == 0) {
                    return null;
                }
                var result = "";
                for (var i = 0; i < this._toggleInputs.length; i++) {
                    if (this._toggleInputs[i].checked) {
                        if (result != "") {
                            result += ";";
                        }
                        result += this._toggleInputs[i].value;
                    }
                }
                return result == "" ? null : result;
            }
        },
        enumerable: true,
        configurable: true
    });
    return ChoiceSetInput;
}(Input));
exports.ChoiceSetInput = ChoiceSetInput;
var NumberInput = /** @class */ (function (_super) {
    __extends(NumberInput, _super);
    function NumberInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumberInput.prototype.internalRender = function () {
        this._numberInputElement = document.createElement("input");
        this._numberInputElement.type = "number";
        this._numberInputElement.className = "ac-input ac-numberInput";
        this._numberInputElement.min = this.min;
        this._numberInputElement.max = this.max;
        this._numberInputElement.style.width = "100%";
        if (!Utils.isNullOrEmpty(this.defaultValue)) {
            this._numberInputElement.value = this.defaultValue;
        }
        return this._numberInputElement;
    };
    NumberInput.prototype.getJsonTypeName = function () {
        return "Input.Number";
    };
    NumberInput.prototype.parse = function (json) {
        _super.prototype.parse.call(this, json);
        this.min = json["min"];
        this.max = json["max"];
    };
    Object.defineProperty(NumberInput.prototype, "value", {
        get: function () {
            return this._numberInputElement ? this._numberInputElement.value : null;
        },
        enumerable: true,
        configurable: true
    });
    return NumberInput;
}(Input));
exports.NumberInput = NumberInput;
var DateInput = /** @class */ (function (_super) {
    __extends(DateInput, _super);
    function DateInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateInput.prototype.internalRender = function () {
        this._dateInputElement = document.createElement("input");
        this._dateInputElement.type = "date";
        this._dateInputElement.className = "ac-input ac-dateInput";
        this._dateInputElement.style.width = "100%";
        if (!Utils.isNullOrEmpty(this.defaultValue)) {
            this._dateInputElement.value = this.defaultValue;
        }
        return this._dateInputElement;
    };
    DateInput.prototype.getJsonTypeName = function () {
        return "Input.Date";
    };
    Object.defineProperty(DateInput.prototype, "value", {
        get: function () {
            return this._dateInputElement ? this._dateInputElement.value : null;
        },
        enumerable: true,
        configurable: true
    });
    return DateInput;
}(Input));
exports.DateInput = DateInput;
var TimeInput = /** @class */ (function (_super) {
    __extends(TimeInput, _super);
    function TimeInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeInput.prototype.internalRender = function () {
        this._timeInputElement = document.createElement("input");
        this._timeInputElement.type = "time";
        this._timeInputElement.className = "ac-input ac-timeInput";
        this._timeInputElement.style.width = "100%";
        if (!Utils.isNullOrEmpty(this.defaultValue)) {
            this._timeInputElement.value = this.defaultValue;
        }
        return this._timeInputElement;
    };
    TimeInput.prototype.getJsonTypeName = function () {
        return "Input.Time";
    };
    Object.defineProperty(TimeInput.prototype, "value", {
        get: function () {
            return this._timeInputElement ? this._timeInputElement.value : null;
        },
        enumerable: true,
        configurable: true
    });
    return TimeInput;
}(Input));
exports.TimeInput = TimeInput;
var ActionButtonState;
(function (ActionButtonState) {
    ActionButtonState[ActionButtonState["Normal"] = 0] = "Normal";
    ActionButtonState[ActionButtonState["Expanded"] = 1] = "Expanded";
    ActionButtonState[ActionButtonState["Subdued"] = 2] = "Subdued";
})(ActionButtonState || (ActionButtonState = {}));
var ActionButton = /** @class */ (function () {
    function ActionButton(action, style) {
        var _this = this;
        this._style = "button";
        this._element = null;
        this._state = ActionButtonState.Normal;
        this.onClick = null;
        this._action = action;
        this._style = style;
        this._element = document.createElement("button");
        this._element.type = "button";
        this._element.style.overflow = "hidden";
        this._element.style.whiteSpace = "nowrap";
        this._element.style.textOverflow = "ellipsis";
        this._element.onclick = function (e) { _this.click(); };
        this.updateCssStyle();
    }
    ActionButton.prototype.click = function () {
        if (this.onClick != null) {
            this.onClick(this);
        }
    };
    ActionButton.prototype.updateCssStyle = function () {
        this._element.className = this._style == "link" ? "ac-linkButton" : "ac-pushButton";
        if (this._action instanceof ShowCardAction) {
            this._element.classList.add("expandable");
        }
        switch (this._state) {
            case ActionButtonState.Expanded:
                this._element.classList.add("expanded");
                break;
            case ActionButtonState.Subdued:
                this._element.classList.add("subdued");
                break;
        }
    };
    Object.defineProperty(ActionButton.prototype, "action", {
        get: function () {
            return this._action;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionButton.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            this._text = value;
            this._element.innerText = this._text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionButton.prototype, "element", {
        get: function () {
            return this._element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionButton.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (value) {
            this._state = value;
            this.updateCssStyle();
        },
        enumerable: true,
        configurable: true
    });
    return ActionButton;
}());
var Action = /** @class */ (function () {
    function Action() {
        this._parent = null;
    }
    Action.createAction = function (json) {
        var actionType = json["type"];
        var result = AdaptiveCard.actionTypeRegistry.createInstance(actionType);
        if (result) {
            result.parse(json);
        }
        else {
            raiseParseError({
                error: Enums.ValidationError.UnknownActionType,
                message: "Unknown action type: " + actionType
            });
        }
        return result;
    };
    Action.prototype.setParent = function (value) {
        this._parent = value;
    };
    Action.prototype.validate = function () {
        return [];
    };
    Action.prototype.prepare = function (inputs) {
        // Do nothing in base implementation
    };
    ;
    Action.prototype.parse = function (json) {
        this.title = json["title"];
    };
    Action.prototype.getAllInputs = function () {
        return [];
    };
    Object.defineProperty(Action.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    return Action;
}());
exports.Action = Action;
var ExternalAction = /** @class */ (function (_super) {
    __extends(ExternalAction, _super);
    function ExternalAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExternalAction.prototype.execute = function () {
        raiseExecuteActionEvent(this);
    };
    return ExternalAction;
}(Action));
exports.ExternalAction = ExternalAction;
var SubmitAction = /** @class */ (function (_super) {
    __extends(SubmitAction, _super);
    function SubmitAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._isPrepared = false;
        return _this;
    }
    SubmitAction.prototype.getJsonTypeName = function () {
        return "Action.Submit";
    };
    SubmitAction.prototype.prepare = function (inputs) {
        if (this._originalData) {
            this._processedData = JSON.parse(JSON.stringify(this._originalData));
        }
        else {
            this._processedData = {};
        }
        for (var i = 0; i < inputs.length; i++) {
            var inputValue = inputs[i].value;
            if (inputValue != null) {
                this._processedData[inputs[i].id] = inputs[i].value;
            }
        }
        this._isPrepared = true;
    };
    SubmitAction.prototype.parse = function (json) {
        _super.prototype.parse.call(this, json);
        this.data = json["data"];
    };
    Object.defineProperty(SubmitAction.prototype, "data", {
        get: function () {
            return this._isPrepared ? this._processedData : this._originalData;
        },
        set: function (value) {
            this._originalData = value;
            this._isPrepared = false;
        },
        enumerable: true,
        configurable: true
    });
    return SubmitAction;
}(ExternalAction));
exports.SubmitAction = SubmitAction;
var OpenUrlAction = /** @class */ (function (_super) {
    __extends(OpenUrlAction, _super);
    function OpenUrlAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OpenUrlAction.prototype.getJsonTypeName = function () {
        return "Action.OpenUrl";
    };
    OpenUrlAction.prototype.validate = function () {
        if (!this.url) {
            return [{ error: Enums.ValidationError.PropertyCantBeNull, message: "An Action.OpenUrl must have its url property set." }];
        }
        else {
            return [];
        }
    };
    OpenUrlAction.prototype.parse = function (json) {
        _super.prototype.parse.call(this, json);
        this.url = json["url"];
    };
    return OpenUrlAction;
}(ExternalAction));
exports.OpenUrlAction = OpenUrlAction;
var HttpHeader = /** @class */ (function () {
    function HttpHeader() {
        this._value = new Utils.StringWithSubstitutions();
    }
    HttpHeader.prototype.prepare = function (inputs) {
        this._value.substituteInputValues(inputs);
    };
    Object.defineProperty(HttpHeader.prototype, "value", {
        get: function () {
            return this._value.get();
        },
        set: function (newValue) {
            this._value.set(newValue);
        },
        enumerable: true,
        configurable: true
    });
    return HttpHeader;
}());
exports.HttpHeader = HttpHeader;
var HttpAction = /** @class */ (function (_super) {
    __extends(HttpAction, _super);
    function HttpAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._url = new Utils.StringWithSubstitutions();
        _this._body = new Utils.StringWithSubstitutions();
        _this._headers = [];
        return _this;
    }
    HttpAction.prototype.getJsonTypeName = function () {
        return "Action.Http";
    };
    HttpAction.prototype.validate = function () {
        var result = [];
        if (!this.url) {
            result = [{ error: Enums.ValidationError.PropertyCantBeNull, message: "An Action.Http must have its url property set." }];
        }
        if (this.headers.length > 0) {
            for (var i = 0; i < this.headers.length; i++) {
                if (!this.headers[i].name || !this.headers[i].value) {
                    result = result.concat([{ error: Enums.ValidationError.PropertyCantBeNull, message: "All headers of an Action.Http must have their name and value properties set." }]);
                    break;
                }
            }
        }
        return result;
    };
    HttpAction.prototype.prepare = function (inputs) {
        this._url.substituteInputValues(inputs);
        this._body.substituteInputValues(inputs);
        for (var i = 0; i < this._headers.length; i++) {
            this._headers[i].prepare(inputs);
        }
    };
    ;
    HttpAction.prototype.parse = function (json) {
        _super.prototype.parse.call(this, json);
        this.url = json["url"];
        this.method = json["method"];
        this.body = json["body"];
        if (json["headers"] != null) {
            var jsonHeaders = json["headers"];
            for (var i = 0; i < jsonHeaders.length; i++) {
                var httpHeader = new HttpHeader();
                httpHeader.name = jsonHeaders[i]["name"];
                httpHeader.value = jsonHeaders[i]["value"];
                this.headers.push(httpHeader);
            }
        }
    };
    Object.defineProperty(HttpAction.prototype, "url", {
        get: function () {
            return this._url.get();
        },
        set: function (value) {
            this._url.set(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpAction.prototype, "body", {
        get: function () {
            return this._body.get();
        },
        set: function (value) {
            this._body.set(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpAction.prototype, "headers", {
        get: function () {
            return this._headers;
        },
        enumerable: true,
        configurable: true
    });
    return HttpAction;
}(ExternalAction));
exports.HttpAction = HttpAction;
var ShowCardAction = /** @class */ (function (_super) {
    __extends(ShowCardAction, _super);
    function ShowCardAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.card = new InlineAdaptiveCard();
        return _this;
    }
    ShowCardAction.prototype.setParent = function (value) {
        _super.prototype.setParent.call(this, value);
        invokeSetParent(this.card, value);
    };
    ShowCardAction.prototype.execute = function () {
        raiseShowPopupCardEvent(this);
    };
    ShowCardAction.prototype.getJsonTypeName = function () {
        return "Action.ShowCard";
    };
    ShowCardAction.prototype.validate = function () {
        return this.card.validate();
    };
    ShowCardAction.prototype.parse = function (json) {
        _super.prototype.parse.call(this, json);
        this.card.parse(json["card"]);
    };
    ShowCardAction.prototype.getAllInputs = function () {
        return this.card.getAllInputs();
    };
    return ShowCardAction;
}(Action));
exports.ShowCardAction = ShowCardAction;
var ActionCollection = /** @class */ (function () {
    function ActionCollection(owner) {
        this._actionButtons = [];
        this._expandedAction = null;
        this._renderedActionCount = 0;
        this.items = [];
        this.actionStyle = "button";
        this.onHideActionCardPane = null;
        this.onShowActionCardPane = null;
        this._owner = owner;
    }
    ActionCollection.prototype.hideActionCardPane = function () {
        this._actionCardContainer.innerHTML = '';
        this._actionCardContainer.style.padding = "0px";
        this._actionCardContainer.style.marginTop = "0px";
        if (this.onHideActionCardPane) {
            this.onHideActionCardPane();
        }
        if (this._expandedAction) {
            raiseInlineCardExpandedEvent(this._expandedAction, false);
        }
        this._expandedAction = null;
    };
    ActionCollection.prototype.showActionCardPane = function (action) {
        if (this.onShowActionCardPane) {
            this.onShowActionCardPane(action);
        }
        var renderedCard = action.card.render();
        this._actionCardContainer.innerHTML = '';
        this._actionCardContainer.style.marginTop = this._renderedActionCount > 0 ? hostConfig.actions.showCard.inlineTopMargin + "px" : "0px";
        if (hostConfig.actions.showCard.actionMode == "inlineEdgeToEdge") {
            var padding = this._owner.getNonZeroPadding();
            this._actionCardContainer.style.paddingLeft = padding.left + "px";
            this._actionCardContainer.style.paddingRight = padding.right + "px";
            this._actionCardContainer.style.marginLeft = "-" + padding.left + "px";
            this._actionCardContainer.style.marginRight = "-" + padding.right + "px";
            renderedCard.style.paddingLeft = "0px";
            renderedCard.style.paddingRight = "0px";
        }
        Utils.appendChild(this._actionCardContainer, renderedCard);
        raiseInlineCardExpandedEvent(action, true);
        this._expandedAction = action;
    };
    ActionCollection.prototype.actionClicked = function (actionButton) {
        if (!(actionButton.action instanceof ShowCardAction)) {
            for (var i = 0; i < this._actionButtons.length; i++) {
                this._actionButtons[i].state = ActionButtonState.Normal;
            }
            this.hideActionCardPane();
            actionButton.action.execute();
        }
        else {
            if (hostConfig.actions.showCard.actionMode == "popup") {
                actionButton.action.execute();
            }
            else if (actionButton.action === this._expandedAction) {
                for (var i = 0; i < this._actionButtons.length; i++) {
                    this._actionButtons[i].state = ActionButtonState.Normal;
                }
                this.hideActionCardPane();
            }
            else {
                for (var i = 0; i < this._actionButtons.length; i++) {
                    if (this._actionButtons[i] !== actionButton) {
                        this._actionButtons[i].state = ActionButtonState.Subdued;
                    }
                }
                actionButton.state = ActionButtonState.Expanded;
                this.showActionCardPane(actionButton.action);
            }
        }
    };
    ActionCollection.prototype.validate = function () {
        var result = [];
        if (hostConfig.actions.maxActions && this.items.length > hostConfig.actions.maxActions) {
            result.push({
                error: Enums.ValidationError.TooManyActions,
                message: "A maximum of " + hostConfig.actions.maxActions + " actions are allowed."
            });
        }
        if (this.items.length > 0 && !hostConfig.supportsInteractivity) {
            result.push({
                error: Enums.ValidationError.InteractivityNotAllowed,
                message: "Interactivity is not allowed."
            });
        }
        for (var i = 0; i < this.items.length; i++) {
            if (!isActionAllowed(this.items[i], this._owner.getForbiddenActionTypes())) {
                result.push({
                    error: Enums.ValidationError.ActionTypeNotAllowed,
                    message: "Actions of type " + this.items[i].getJsonTypeName() + " are not allowe."
                });
            }
        }
        for (var i = 0; i < this.items.length; i++) {
            result = result.concat(this.items[i].validate());
        }
        return result;
    };
    ActionCollection.prototype.render = function () {
        var _this = this;
        if (!hostConfig.supportsInteractivity) {
            return null;
        }
        var element = document.createElement("div");
        this._actionCardContainer = document.createElement("div");
        this._actionCardContainer.style.backgroundColor = Utils.stringToCssColor(hostConfig.actions.showCard.backgroundColor);
        this._renderedActionCount = 0;
        var maxActions = hostConfig.actions.maxActions ? Math.min(hostConfig.actions.maxActions, this.items.length) : this.items.length;
        var forbiddenActionTypes = this._owner.getForbiddenActionTypes();
        if (hostConfig.actions.preExpandSingleShowCardAction && maxActions == 1 && this.items[0] instanceof ShowCardAction && isActionAllowed(this.items[i], forbiddenActionTypes)) {
            this.showActionCardPane(this.items[0]);
            this._renderedActionCount = 1;
        }
        else {
            var buttonStrip = document.createElement("div");
            buttonStrip.style.display = "flex";
            if (hostConfig.actions.actionsOrientation == "horizontal") {
                buttonStrip.style.flexDirection = "row";
                switch (hostConfig.actions.actionAlignment) {
                    case "center":
                        buttonStrip.style.justifyContent = "center";
                        break;
                    case "right":
                        buttonStrip.style.justifyContent = "flex-end";
                        break;
                    default:
                        buttonStrip.style.justifyContent = "flex-start";
                        break;
                }
            }
            else {
                buttonStrip.style.flexDirection = "column";
                switch (hostConfig.actions.actionAlignment) {
                    case "center":
                        buttonStrip.style.alignItems = "center";
                        break;
                    case "right":
                        buttonStrip.style.alignItems = "flex-end";
                        break;
                    case "stretch":
                        buttonStrip.style.alignItems = "stretch";
                        break;
                    default:
                        buttonStrip.style.alignItems = "flex-start";
                        break;
                }
            }
            for (var i = 0; i < maxActions; i++) {
                if (isActionAllowed(this.items[i], forbiddenActionTypes)) {
                    var actionButton = new ActionButton(this.items[i], this.actionStyle);
                    actionButton.element.style.overflow = "hidden";
                    actionButton.element.style.overflow = "table-cell";
                    actionButton.element.style.flex = hostConfig.actions.actionAlignment == "stretch" ? "0 1 100%" : "0 1 auto";
                    actionButton.text = this.items[i].title;
                    actionButton.onClick = function (ab) { _this.actionClicked(ab); };
                    this._actionButtons.push(actionButton);
                    buttonStrip.appendChild(actionButton.element);
                    if (i < this.items.length - 1 && hostConfig.actions.buttonSpacing > 0) {
                        var spacer = document.createElement("div");
                        if (hostConfig.actions.actionsOrientation == "horizontal") {
                            spacer.style.flex = "0 0 auto";
                            spacer.style.width = hostConfig.actions.buttonSpacing + "px";
                        }
                        else {
                            spacer.style.height = hostConfig.actions.buttonSpacing + "px";
                        }
                        Utils.appendChild(buttonStrip, spacer);
                    }
                    this._renderedActionCount++;
                }
            }
            var buttonStripContainer = document.createElement("div");
            buttonStripContainer.style.overflow = "hidden";
            buttonStripContainer.appendChild(buttonStrip);
            Utils.appendChild(element, buttonStripContainer);
        }
        Utils.appendChild(element, this._actionCardContainer);
        return this._renderedActionCount > 0 ? element : null;
    };
    ActionCollection.prototype.addAction = function (action) {
        if (!action.parent) {
            this.items.push(action);
            invokeSetParent(action, this._owner);
        }
        else {
            throw new Error("The action already belongs to another element.");
        }
    };
    ActionCollection.prototype.clear = function () {
        this.items = [];
    };
    ActionCollection.prototype.getAllInputs = function () {
        var result = [];
        for (var i = 0; i < this.items.length; i++) {
            var action = this.items[i];
            result = result.concat(action.getAllInputs());
        }
        return result;
    };
    return ActionCollection;
}());
var ActionSet = /** @class */ (function (_super) {
    __extends(ActionSet, _super);
    function ActionSet() {
        var _this = _super.call(this) || this;
        _this.actionStyle = "button";
        _this._actionCollection = new ActionCollection(_this);
        _this._actionCollection.onHideActionCardPane = function () { _this.showBottomSpacer(_this); };
        _this._actionCollection.onShowActionCardPane = function (action) { _this.hideBottomSpacer(_this); };
        return _this;
    }
    ActionSet.prototype.internalRender = function () {
        this._actionCollection.actionStyle = this.actionStyle;
        return this._actionCollection.render();
    };
    ActionSet.prototype.getJsonTypeName = function () {
        return "ActionSet";
    };
    ActionSet.prototype.getDefaultSeparationDefinition = function () {
        return hostConfig.actions.separation;
    };
    ActionSet.prototype.validate = function () {
        return this._actionCollection.validate();
    };
    ActionSet.prototype.parse = function (json, itemsCollectionPropertyName) {
        if (itemsCollectionPropertyName === void 0) { itemsCollectionPropertyName = "items"; }
        _super.prototype.parse.call(this, json);
        this.actionStyle = Utils.getValueOrDefault(json["actionStyle"], "button");
        if (json["actions"] != undefined) {
            var jsonActions = json["actions"];
            for (var i = 0; i < jsonActions.length; i++) {
                this.addAction(Action.createAction(jsonActions[i]));
            }
        }
    };
    ActionSet.prototype.addAction = function (action) {
        if (action != null) {
            this._actionCollection.addAction(action);
        }
    };
    ActionSet.prototype.getAllInputs = function () {
        return this._actionCollection.getAllInputs();
    };
    ActionSet.prototype.renderSpeech = function () {
        // TODO: What's the right thing to do here?
        return "";
    };
    Object.defineProperty(ActionSet.prototype, "isInteractive", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return ActionSet;
}(CardElement));
exports.ActionSet = ActionSet;
var ContainerBase = /** @class */ (function (_super) {
    __extends(ContainerBase, _super);
    function ContainerBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._items = [];
        return _this;
    }
    ContainerBase.prototype.showBottomSpacer = function (requestingElement) {
        if ((!requestingElement || this.isLastItem(requestingElement)) && hostConfig.actions.showCard.actionMode == "inlineEdgeToEdge") {
            this._element.style.paddingBottom = this.padding.bottom + "px";
            _super.prototype.showBottomSpacer.call(this, this);
        }
    };
    ContainerBase.prototype.hideBottomSpacer = function (requestingElement) {
        if ((!requestingElement || this.isLastItem(requestingElement)) && hostConfig.actions.showCard.actionMode == "inlineEdgeToEdge") {
            this._element.style.paddingBottom = "0px";
            _super.prototype.hideBottomSpacer.call(this, this);
        }
    };
    ContainerBase.prototype.internalRender = function () {
        var _this = this;
        this._element = document.createElement("div");
        this._element.className = "ac-container";
        if (this.backgroundImage) {
            this._element.style.backgroundImage = "url('" + this.backgroundImage + "')";
            this._element.style.backgroundRepeat = "no-repeat";
            this._element.style.backgroundSize = "cover";
        }
        var backgroundColor = this.getBackgroundColor();
        if (backgroundColor) {
            this._element.style.backgroundColor = Utils.stringToCssColor(backgroundColor);
        }
        if (this.selectAction) {
            this._element.classList.add("ac-selectable");
        }
        this._element.style.paddingTop = this.padding.top + "px";
        this._element.style.paddingRight = this.padding.right + "px";
        this._element.style.paddingBottom = this.padding.bottom + "px";
        this._element.style.paddingLeft = this.padding.left + "px";
        this._element.onclick = function (e) {
            if (_this.selectAction != null) {
                _this.selectAction.execute();
                e.cancelBubble = true;
            }
        };
        if (this._items.length > 0) {
            var renderedElementCount = 0;
            for (var i = 0; i < this._items.length; i++) {
                var renderedElement = isElementAllowed(this._items[i], this.getForbiddenElementTypes()) ? this._items[i].render() : null;
                if (renderedElement != null) {
                    if (renderedElementCount > 0 && this._items[i].separation != "none") {
                        var separationDefinition = this._items[i].separation == "default" ? this._items[i].getDefaultSeparationDefinition() : hostConfig.strongSeparation;
                        Utils.appendChild(this._element, Utils.renderSeparation(separationDefinition, "vertical"));
                    }
                    Utils.appendChild(this._element, renderedElement);
                    renderedElementCount++;
                }
            }
        }
        return this._element;
    };
    ContainerBase.prototype.getBackgroundColor = function () {
        return null;
    };
    Object.defineProperty(ContainerBase.prototype, "padding", {
        get: function () {
            return { left: 0, top: 0, right: 0, bottom: 0 };
        },
        enumerable: true,
        configurable: true
    });
    ContainerBase.prototype.isLastItem = function (item) {
        return this._items.indexOf(item) == (this._items.length - 1);
    };
    ContainerBase.prototype.getDefaultSeparationDefinition = function () {
        return hostConfig.container.separation;
    };
    ContainerBase.prototype.validate = function () {
        var result = [];
        for (var i = 0; i < this._items.length; i++) {
            if (!hostConfig.supportsInteractivity && this._items[i].isInteractive) {
                result.push({
                    error: Enums.ValidationError.InteractivityNotAllowed,
                    message: "Interactivity is not allowed."
                });
            }
            if (!isElementAllowed(this._items[i], this.getForbiddenElementTypes())) {
                result.push({
                    error: Enums.ValidationError.InteractivityNotAllowed,
                    message: "Elements of type " + this._items[i].getJsonTypeName() + " are not allowed in this container."
                });
            }
            result = result.concat(this._items[i].validate());
        }
        return result;
    };
    ContainerBase.prototype.parse = function (json, itemsCollectionPropertyName) {
        if (itemsCollectionPropertyName === void 0) { itemsCollectionPropertyName = "items"; }
        _super.prototype.parse.call(this, json);
        this.backgroundImage = json["backgroundImage"];
        if (json[itemsCollectionPropertyName] != null) {
            var items = json[itemsCollectionPropertyName];
            for (var i = 0; i < items.length; i++) {
                var elementType = items[i]["type"];
                var element = AdaptiveCard.elementTypeRegistry.createInstance(elementType);
                if (!element) {
                    raiseParseError({
                        error: Enums.ValidationError.UnknownElementType,
                        message: "Unknown element type: " + elementType
                    });
                }
                else {
                    this.addItem(element);
                    element.parse(items[i]);
                }
            }
        }
        var selectActionJson = json["selectAction"];
        if (selectActionJson != undefined) {
            this.selectAction = Action.createAction(selectActionJson);
            invokeSetParent(this.selectAction, this);
        }
    };
    ContainerBase.prototype.addItem = function (item) {
        if (!item.parent) {
            if (item.isStandalone) {
                this._items.push(item);
                invokeSetParent(item, this);
            }
            else {
                throw new Error("Elements of type " + item.getJsonTypeName() + " cannot be used as standalone elements.");
            }
        }
        else {
            throw new Error("The element already belongs to another container.");
        }
    };
    ContainerBase.prototype.clear = function () {
        this._items = [];
    };
    ContainerBase.prototype.getAllInputs = function () {
        var result = [];
        for (var i = 0; i < this._items.length; i++) {
            var item = this._items[i];
            result = result.concat(item.getAllInputs());
        }
        return result;
    };
    ContainerBase.prototype.renderSpeech = function () {
        if (this.speak != null) {
            return this.speak;
        }
        // render each item
        var speak = null;
        if (this._items.length > 0) {
            speak = '';
            for (var i = 0; i < this._items.length; i++) {
                var result = this._items[i].renderSpeech();
                if (result) {
                    speak += result;
                }
            }
        }
        return speak;
    };
    return ContainerBase;
}(CardElement));
exports.ContainerBase = ContainerBase;
var Container = /** @class */ (function (_super) {
    __extends(Container, _super);
    function Container() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.style = "normal";
        return _this;
    }
    Container.prototype.getBackgroundColor = function () {
        return this.style == "normal" ? hostConfig.container.normal.backgroundColor : hostConfig.container.emphasis.backgroundColor;
    };
    Container.prototype.internalRender = function () {
        var renderedContainer = _super.prototype.internalRender.call(this);
        if (renderedContainer) {
            var styleDefinition = this.style == "normal" ? hostConfig.container.normal : hostConfig.container.emphasis;
            if (styleDefinition.borderThickness) {
                renderedContainer.style.borderTop = styleDefinition.borderThickness.top + "px solid";
                renderedContainer.style.borderRight = styleDefinition.borderThickness.right + "px solid";
                renderedContainer.style.borderBottom = styleDefinition.borderThickness.bottom + "px solid";
                renderedContainer.style.borderLeft = styleDefinition.borderThickness.left + "px solid";
            }
            if (styleDefinition.borderColor) {
                renderedContainer.style.borderColor = Utils.stringToCssColor(styleDefinition.borderColor);
            }
        }
        return renderedContainer;
    };
    Object.defineProperty(Container.prototype, "padding", {
        get: function () {
            var styleDefinition = this.style == "normal" ? hostConfig.container.normal : hostConfig.container.emphasis;
            return styleDefinition.padding ? styleDefinition.padding : { top: 0, right: 0, bottom: 0, left: 0 };
        },
        enumerable: true,
        configurable: true
    });
    Container.prototype.getJsonTypeName = function () {
        return "Container";
    };
    Container.prototype.parse = function (json) {
        _super.prototype.parse.call(this, json);
        this.style = Utils.getValueOrDefault(json["style"], "normal");
    };
    return Container;
}(ContainerBase));
exports.Container = Container;
var Column = /** @class */ (function (_super) {
    __extends(Column, _super);
    function Column() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._computedWeight = 0;
        _this.size = "auto";
        return _this;
    }
    Object.defineProperty(Column.prototype, "padding", {
        get: function () {
            return { left: 0, top: 0, right: 0, bottom: 0 };
        },
        enumerable: true,
        configurable: true
    });
    Column.prototype.internalRender = function () {
        var element = _super.prototype.internalRender.call(this);
        if (element) {
            element.style.minWidth = "0";
            if (typeof this.size === "number") {
                element.style.flex = "1 1 " + (this._computedWeight > 0 ? this._computedWeight : this.size) + "%";
            }
            else if (this.size === "auto") {
                element.style.flex = "0 1 auto";
            }
            else {
                element.style.flex = "1 1 auto";
            }
        }
        return element;
    };
    Column.prototype.getJsonTypeName = function () {
        return "Column";
    };
    Column.prototype.getDefaultSeparationDefinition = function () {
        return hostConfig.column.separation;
    };
    Column.prototype.parse = function (json) {
        _super.prototype.parse.call(this, json);
        var parsedSize = json["size"];
        var invalidSize = false;
        if (typeof parsedSize === "number") {
            if (parsedSize <= 0) {
                invalidSize = true;
            }
        }
        else if (typeof parsedSize === "string") {
            if (parsedSize != "auto" && parsedSize != "stretch") {
                var sizeAsNumber = parseInt(parsedSize);
                if (!isNaN(sizeAsNumber)) {
                    parsedSize = sizeAsNumber;
                }
                else {
                    invalidSize = true;
                }
            }
        }
        else if (parsedSize) {
            invalidSize = true;
        }
        if (invalidSize) {
            raiseParseError({
                error: Enums.ValidationError.InvalidPropertyValue,
                message: "Invalid column size: " + parsedSize
            });
        }
        else {
            this.size = parsedSize;
        }
    };
    Object.defineProperty(Column.prototype, "isStandalone", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return Column;
}(Container));
exports.Column = Column;
var ColumnSet = /** @class */ (function (_super) {
    __extends(ColumnSet, _super);
    function ColumnSet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._columns = [];
        return _this;
    }
    ColumnSet.prototype.internalRender = function () {
        if (this._columns.length > 0) {
            var element = document.createElement("div");
            element.style.display = "flex";
            element.style.overflow = "hidden";
            switch (this.horizontalAlignment) {
                case "center":
                    element.style.justifyContent = "center";
                    break;
                case "right":
                    element.style.justifyContent = "flex-end";
                    break;
                default:
                    element.style.justifyContent = "flex-start";
                    break;
            }
            var totalWeight = 0;
            for (var i = 0; i < this._columns.length; i++) {
                if (typeof this._columns[i].size === "number") {
                    totalWeight += this._columns[i].size;
                }
            }
            var renderedColumnCount = 0;
            for (var i = 0; i < this._columns.length; i++) {
                if (typeof this._columns[i].size === "number" && totalWeight > 0) {
                    var computedWeight = 100 / totalWeight * this._columns[i].size;
                    // Best way to emulate "internal" access I know of
                    this._columns[i]["_computedWeight"] = computedWeight;
                }
                var renderedColumn = this._columns[i].render();
                if (renderedColumn != null) {
                    Utils.appendChild(element, renderedColumn);
                    if (this._columns.length > 1 && i < this._columns.length - 1 && this._columns[i + 1].separation != "none") {
                        var separationDefinition = this._columns[i + 1].separation == "default" ? this._columns[i + 1].getDefaultSeparationDefinition() : hostConfig.strongSeparation;
                        if (separationDefinition) {
                            var separator = Utils.renderSeparation(separationDefinition, "horizontal");
                            separator.style.flex = "0 0 auto";
                            Utils.appendChild(element, separator);
                        }
                    }
                    renderedColumnCount++;
                }
            }
            return renderedColumnCount > 0 ? element : null;
        }
        else {
            return null;
        }
    };
    ColumnSet.prototype.getJsonTypeName = function () {
        return "ColumnSet";
    };
    ColumnSet.prototype.getDefaultSeparationDefinition = function () {
        return hostConfig.columnSet.separation;
    };
    ColumnSet.prototype.parse = function (json) {
        _super.prototype.parse.call(this, json);
        if (json["columns"] != null) {
            var jsonColumns = json["columns"];
            for (var i = 0; i < jsonColumns.length; i++) {
                var column = new Column();
                column.parse(jsonColumns[i]);
                this.addColumn(column);
            }
        }
    };
    ColumnSet.prototype.addColumn = function (column) {
        if (!column.parent) {
            this._columns.push(column);
            invokeSetParent(column, this);
        }
        else {
            throw new Error("This column already belongs to another ColumnSet.");
        }
    };
    ColumnSet.prototype.getAllInputs = function () {
        var result = [];
        for (var i = 0; i < this._columns.length; i++) {
            result = result.concat(this._columns[i].getAllInputs());
        }
        return result;
    };
    ColumnSet.prototype.renderSpeech = function () {
        if (this.speak != null) {
            return this.speak;
        }
        // render each item
        var speak = '';
        if (this._columns.length > 0) {
            for (var i = 0; i < this._columns.length; i++) {
                speak += this._columns[i].renderSpeech();
            }
        }
        return speak;
    };
    return ColumnSet;
}(CardElement));
exports.ColumnSet = ColumnSet;
function raiseExecuteActionEvent(action) {
    if (AdaptiveCard.onExecuteAction != null) {
        action.prepare(action.parent.getRootElement().getAllInputs());
        AdaptiveCard.onExecuteAction(action);
    }
}
function raiseInlineCardExpandedEvent(action, isExpanded) {
    if (AdaptiveCard.onInlineCardExpanded != null) {
        AdaptiveCard.onInlineCardExpanded(action, isExpanded);
    }
}
function raiseShowPopupCardEvent(action) {
    if (AdaptiveCard.onShowPopupCard != null) {
        AdaptiveCard.onShowPopupCard(action);
    }
}
function raiseParseError(error) {
    if (AdaptiveCard.onParseError != null) {
        AdaptiveCard.onParseError(error);
    }
}
var TypeRegistry = /** @class */ (function () {
    function TypeRegistry() {
        this._items = [];
    }
    TypeRegistry.prototype.findTypeRegistration = function (typeName) {
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i].typeName === typeName) {
                return this._items[i];
            }
        }
        return null;
    };
    TypeRegistry.prototype.clear = function () {
        this._items = [];
    };
    TypeRegistry.prototype.registerType = function (typeName, createInstance) {
        var registrationInfo = this.findTypeRegistration(typeName);
        if (registrationInfo != null) {
            registrationInfo.createInstance = createInstance;
        }
        else {
            registrationInfo = {
                typeName: typeName,
                createInstance: createInstance
            };
            this._items.push(registrationInfo);
        }
    };
    TypeRegistry.prototype.unregisterType = function (typeName) {
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i].typeName === typeName) {
                this._items = this._items.splice(i, 1);
                return;
            }
        }
    };
    TypeRegistry.prototype.createInstance = function (typeName) {
        var registrationInfo = this.findTypeRegistration(typeName);
        return registrationInfo ? registrationInfo.createInstance() : null;
    };
    return TypeRegistry;
}());
exports.TypeRegistry = TypeRegistry;
var ContainerWithActions = /** @class */ (function (_super) {
    __extends(ContainerWithActions, _super);
    function ContainerWithActions() {
        var _this = _super.call(this) || this;
        _this.actionStyle = "button";
        _this._actionCollection = new ActionCollection(_this);
        _this._actionCollection.onHideActionCardPane = function () { _this.showBottomSpacer(null); };
        _this._actionCollection.onShowActionCardPane = function (action) { _this.hideBottomSpacer(null); };
        return _this;
    }
    ContainerWithActions.prototype.internalRender = function () {
        _super.prototype.internalRender.call(this);
        this._actionCollection.actionStyle = this.actionStyle;
        var renderedActions = this._actionCollection.render();
        if (renderedActions) {
            Utils.appendChild(this._element, Utils.renderSeparation(hostConfig.actions.separation, "vertical"));
            Utils.appendChild(this._element, renderedActions);
        }
        return this._element.children.length > 0 ? this._element : null;
    };
    ContainerWithActions.prototype.parse = function (json, itemsCollectionPropertyName) {
        if (itemsCollectionPropertyName === void 0) { itemsCollectionPropertyName = "items"; }
        _super.prototype.parse.call(this, json, itemsCollectionPropertyName);
        this.actionStyle = Utils.getValueOrDefault(json["actionStyle"], "button");
        if (json["actions"] != undefined) {
            var jsonActions = json["actions"];
            for (var i = 0; i < jsonActions.length; i++) {
                var action = Action.createAction(jsonActions[i]);
                if (action != null) {
                    this.addAction(action);
                }
            }
        }
    };
    ContainerWithActions.prototype.isLastItem = function (item) {
        return _super.prototype.isLastItem.call(this, item) && this._actionCollection.items.length == 0;
    };
    ContainerWithActions.prototype.addAction = function (action) {
        this._actionCollection.addAction(action);
    };
    ContainerWithActions.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this._actionCollection.clear();
    };
    ContainerWithActions.prototype.getAllInputs = function () {
        return _super.prototype.getAllInputs.call(this).concat(this._actionCollection.getAllInputs());
    };
    Object.defineProperty(ContainerWithActions.prototype, "isStandalone", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return ContainerWithActions;
}(ContainerBase));
exports.ContainerWithActions = ContainerWithActions;
var AdaptiveCard = /** @class */ (function (_super) {
    __extends(AdaptiveCard, _super);
    function AdaptiveCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.minVersion = { major: 1, minor: 0 };
        return _this;
    }
    AdaptiveCard.initialize = function () {
        AdaptiveCard.elementTypeRegistry.clear();
        AdaptiveCard.elementTypeRegistry.registerType("Container", function () { return new Container(); });
        AdaptiveCard.elementTypeRegistry.registerType("TextBlock", function () { return new TextBlock(); });
        AdaptiveCard.elementTypeRegistry.registerType("Image", function () { return new Image(); });
        AdaptiveCard.elementTypeRegistry.registerType("ImageSet", function () { return new ImageSet(); });
        AdaptiveCard.elementTypeRegistry.registerType("FactSet", function () { return new FactSet(); });
        AdaptiveCard.elementTypeRegistry.registerType("ColumnSet", function () { return new ColumnSet(); });
        AdaptiveCard.elementTypeRegistry.registerType("ActionSet", function () { return new ActionSet(); });
        AdaptiveCard.elementTypeRegistry.registerType("Input.Text", function () { return new TextInput(); });
        AdaptiveCard.elementTypeRegistry.registerType("Input.Date", function () { return new DateInput(); });
        AdaptiveCard.elementTypeRegistry.registerType("Input.Time", function () { return new TimeInput(); });
        AdaptiveCard.elementTypeRegistry.registerType("Input.Number", function () { return new NumberInput(); });
        AdaptiveCard.elementTypeRegistry.registerType("Input.ChoiceSet", function () { return new ChoiceSetInput(); });
        AdaptiveCard.elementTypeRegistry.registerType("Input.Toggle", function () { return new ToggleInput(); });
        AdaptiveCard.actionTypeRegistry.clear();
        AdaptiveCard.actionTypeRegistry.registerType("Action.Http", function () { return new HttpAction(); });
        AdaptiveCard.actionTypeRegistry.registerType("Action.OpenUrl", function () { return new OpenUrlAction(); });
        AdaptiveCard.actionTypeRegistry.registerType("Action.Submit", function () { return new SubmitAction(); });
        AdaptiveCard.actionTypeRegistry.registerType("Action.ShowCard", function () { return new ShowCardAction(); });
    };
    AdaptiveCard.prototype.isVersionSupported = function () {
        var unsupportedVersion = (AdaptiveCard.currentVersion.major < this.minVersion.major) ||
            (AdaptiveCard.currentVersion.major == this.minVersion.major && AdaptiveCard.currentVersion.minor < this.minVersion.minor);
        return !unsupportedVersion;
    };
    AdaptiveCard.prototype.getBackgroundColor = function () {
        return hostConfig.adaptiveCard.backgroundColor;
    };
    Object.defineProperty(AdaptiveCard.prototype, "padding", {
        get: function () {
            return hostConfig.adaptiveCard.padding;
        },
        enumerable: true,
        configurable: true
    });
    AdaptiveCard.prototype.getJsonTypeName = function () {
        return "AdaptiveCard";
    };
    AdaptiveCard.prototype.validate = function () {
        var result = [];
        if (this._cardTypeName != "AdaptiveCard") {
            result.push({
                error: Enums.ValidationError.MissingCardType,
                message: "Invalid or missing card type. Make sure the card's type property is set to \"AdaptiveCard\"."
            });
        }
        if (!this.isVersionSupported()) {
            result.push({
                error: Enums.ValidationError.UnsupportedCardVersion,
                message: "The specified card version is not supported."
            });
        }
        return result.concat(_super.prototype.validate.call(this));
    };
    AdaptiveCard.prototype.parse = function (json) {
        this._cardTypeName = json["type"];
        var minVersion = json["minVersion"];
        var regEx = /(\d+).(\d+)/gi;
        var matches = regEx.exec(minVersion);
        if (matches != null && matches.length == 3) {
            this.minVersion.major = parseInt(matches[1]);
            this.minVersion.minor = parseInt(matches[2]);
        }
        this.fallbackText = json["fallbackText"];
        _super.prototype.parse.call(this, json, "body");
    };
    AdaptiveCard.prototype.render = function () {
        var renderedCard;
        if (!this.isVersionSupported()) {
            renderedCard = document.createElement("div");
            renderedCard.innerHTML = this.fallbackText ? this.fallbackText : "The specified card version is not supported.";
            return renderedCard;
        }
        else {
            return _super.prototype.render.call(this);
        }
    };
    AdaptiveCard.currentVersion = { major: 1, minor: 0 };
    AdaptiveCard.elementTypeRegistry = new TypeRegistry();
    AdaptiveCard.actionTypeRegistry = new TypeRegistry();
    AdaptiveCard.onExecuteAction = null;
    AdaptiveCard.onShowPopupCard = null;
    AdaptiveCard.onInlineCardExpanded = null;
    AdaptiveCard.onParseError = null;
    return AdaptiveCard;
}(ContainerWithActions));
exports.AdaptiveCard = AdaptiveCard;
// This calls acts as a static constructor (see https://github.com/Microsoft/TypeScript/issues/265)
AdaptiveCard.initialize();
var InlineAdaptiveCard = /** @class */ (function (_super) {
    __extends(InlineAdaptiveCard, _super);
    function InlineAdaptiveCard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(InlineAdaptiveCard.prototype, "padding", {
        get: function () {
            return hostConfig.actions.showCard.padding;
        },
        enumerable: true,
        configurable: true
    });
    InlineAdaptiveCard.prototype.getBackgroundColor = function () {
        return null;
    };
    InlineAdaptiveCard.prototype.getForbiddenActionTypes = function () {
        return [ShowCardAction];
    };
    return InlineAdaptiveCard;
}(AdaptiveCard));
var defaultHostConfig = {
    supportsInteractivity: true,
    strongSeparation: {
        spacing: 40,
        lineThickness: 1,
        lineColor: "#EEEEEE"
    },
    fontFamily: "Segoe UI",
    fontSizes: {
        small: 8,
        normal: 10,
        medium: 12,
        large: 14,
        extraLarge: 16
    },
    fontWeights: {
        lighter: 200,
        normal: 400,
        bolder: 600
    },
    colors: {
        dark: {
            normal: "#0000FF",
            subtle: "#222222"
        },
        light: {
            normal: "#FFFFFF",
            subtle: "#DDDDDD"
        },
        accent: {
            normal: "#0000FF",
            subtle: "#0000DD"
        },
        attention: {
            normal: "#FF6600",
            subtle: "#DD4400"
        },
        good: {
            normal: "#00FF00",
            subtle: "#00DD00"
        },
        warning: {
            normal: "#FF0000",
            subtle: "#DD0000"
        }
    },
    imageSizes: {
        small: 40,
        medium: 80,
        large: 160
    },
    actions: {
        maxActions: 5,
        separation: {
            spacing: 20
        },
        buttonSpacing: 20,
        showCard: {
            actionMode: "inlineEdgeToEdge",
            inlineTopMargin: 16,
            backgroundColor: "#22000000",
            padding: {
                top: 16,
                right: 16,
                bottom: 16,
                left: 16
            }
        },
        actionsOrientation: "horizontal",
        actionAlignment: "left"
    },
    adaptiveCard: {
        backgroundColor: "#00000000",
        padding: {
            left: 20,
            top: 20,
            right: 20,
            bottom: 20
        }
    },
    container: {
        separation: {
            spacing: 20
        },
        normal: {},
        emphasis: {
            backgroundColor: "#EEEEEE",
            borderColor: "#AAAAAA",
            borderThickness: {
                top: 1,
                right: 1,
                bottom: 1,
                left: 1
            },
            padding: {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            }
        }
    },
    textBlock: {
        color: "dark",
        separations: {
            small: {
                spacing: 20,
            },
            normal: {
                spacing: 20
            },
            medium: {
                spacing: 20
            },
            large: {
                spacing: 20
            },
            extraLarge: {
                spacing: 20
            }
        }
    },
    image: {
        size: "medium",
        separation: {
            spacing: 20
        }
    },
    imageSet: {
        imageSize: "medium",
        separation: {
            spacing: 20
        }
    },
    factSet: {
        separation: {
            spacing: 20
        },
        title: {
            color: "dark",
            size: "normal",
            isSubtle: false,
            weight: "bolder",
            wrap: true,
            maxWidth: 150
        },
        value: {
            color: "dark",
            size: "normal",
            isSubtle: false,
            weight: "normal",
            wrap: true
        },
        spacing: 10
    },
    input: {
        separation: {
            spacing: 20
        }
    },
    columnSet: {
        separation: {
            spacing: 20
        }
    },
    column: {
        separation: {
            spacing: 20
        }
    }
};
var hostConfig = defaultHostConfig;
function setHostConfig(configuration) {
    hostConfig = configuration;
}
exports.setHostConfig = setHostConfig;
function resetHostConfig() {
    hostConfig = defaultHostConfig;
}
exports.resetHostConfig = resetHostConfig;
//# sourceMappingURL=card-elements.js.map