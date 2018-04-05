"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = require("./utils");
function parseSpacingDefinition(obj) {
    return obj ? {
        top: obj["top"],
        right: obj["right"],
        bottom: obj["bottom"],
        left: obj["left"]
    } : null;
}
function parseColorDefinition(obj) {
    return obj ? {
        normal: obj["normal"],
        subtle: obj["subtle"]
    } : null;
}
function parseSeparationDefinition(obj) {
    return obj ? {
        spacing: obj["spacing"],
        lineThickness: obj["lineThickness"],
        lineColor: obj["lineColor"]
    } : null;
}
function parseAdaptiveCardConfiguration(obj) {
    return obj ? {
        backgroundColor: obj["backgroundColor"],
        padding: parseSpacingDefinition(obj["padding"])
    } : null;
}
function parseTextBlockConfiguration(obj) {
    return obj ? {
        color: obj["color"],
        separations: {
            small: parseSeparationDefinition(obj["separations"]["small"]),
            normal: parseSeparationDefinition(obj["separations"]["normal"]),
            medium: parseSeparationDefinition(obj["separations"]["medium"]),
            large: parseSeparationDefinition(obj["separations"]["large"]),
            extraLarge: parseSeparationDefinition(obj["separations"]["extraLarge"])
        }
    } : null;
}
function parseContainerStyleDefinition(obj) {
    return obj ? {
        backgroundColor: obj["backgroundColor"],
        padding: parseSpacingDefinition(obj["padding"]),
        borderColor: obj["borderColor"],
        borderThickness: parseSpacingDefinition(obj["borderThickness"])
    } : null;
}
function parseContainerConfiguration(obj) {
    return obj ? {
        separation: parseSeparationDefinition(obj["separation"]),
        normal: parseContainerStyleDefinition(obj["normal"]),
        emphasis: parseContainerStyleDefinition(obj["emphasis"])
    } : null;
}
function parseImageConfiguration(obj) {
    return obj ? {
        separation: parseSeparationDefinition(obj["separation"]),
        size: obj["size"]
    } : null;
}
function parseImageSetConfiguration(obj) {
    return obj ? {
        separation: parseSeparationDefinition(obj["separation"]),
        imageSize: obj["imageSize"]
    } : null;
}
function parseFactTextDefinition(obj) {
    return obj ? {
        size: Utils.getValueOrDefault(obj["size"], "normal"),
        color: Utils.getValueOrDefault(obj["color"], "dark"),
        isSubtle: obj["isSubtle"],
        weight: Utils.getValueOrDefault(obj["weight"], "normal"),
        wrap: obj["wrap"]
    } : null;
}
function parseFactTitleDefinition(obj) {
    var result = parseFactTextDefinition(obj);
    if (result) {
        result.maxWidth = obj["maxWidth"];
    }
    return result;
}
function parseFactSetConfiguration(obj) {
    return obj ? {
        separation: parseSeparationDefinition(obj["separation"]),
        title: parseFactTitleDefinition(obj["title"]),
        value: parseFactTextDefinition(obj["value"]),
        spacing: obj["spacing"]
    } : null;
}
function parseColumnSetConfiguration(obj) {
    return obj ? {
        separation: parseSeparationDefinition(obj["separation"])
    } : null;
}
function parseColumnConfiguration(obj) {
    return obj ? {
        separation: parseSeparationDefinition(obj["separation"])
    } : null;
}
function parseShowCardActionConfiguration(obj) {
    return obj ? {
        actionMode: Utils.getValueOrDefault(obj["actionMode"], "inlineEdgeToEdge"),
        inlineTopMargin: obj["inlineTopMargin"],
        backgroundColor: obj["backgroundColor"],
        padding: parseSpacingDefinition(obj["padding"])
    } : null;
}
function parseActionsConfiguration(obj) {
    return obj ? {
        maxActions: obj["maxActions"],
        separation: parseSeparationDefinition(obj["separation"]),
        buttonSpacing: obj["buttonSpacing"],
        showCard: parseShowCardActionConfiguration(obj["showCard"]),
        preExpandSingleShowCardAction: Utils.getValueOrDefault(obj["preExpandSingleShowCardAction"], false),
        actionsOrientation: Utils.getValueOrDefault(obj["actionsOrientation"], "horizontal"),
        actionAlignment: Utils.getValueOrDefault(obj["actionAlignment"], "left"),
    } : null;
}
function parseInputConfiguration(obj) {
    return obj ? {
        separation: parseSeparationDefinition(obj["separation"])
    } : null;
}
function parseHostConfig(serializedConfiguration) {
    var obj = JSON.parse(serializedConfiguration);
    return obj ? {
        supportsInteractivity: obj["supportsInteractivity"],
        fontFamily: obj["fontFamily"],
        fontSizes: {
            small: obj["fontSizes"]["small"],
            normal: obj["fontSizes"]["normal"],
            medium: obj["fontSizes"]["medium"],
            large: obj["fontSizes"]["large"],
            extraLarge: obj["fontSizes"]["extraLarge"]
        },
        fontWeights: {
            lighter: obj["fontWeights"]["lighter"],
            normal: obj["fontWeights"]["normal"],
            bolder: obj["fontWeights"]["bolder"]
        },
        imageSizes: {
            small: obj["imageSizes"]["small"],
            medium: obj["imageSizes"]["medium"],
            large: obj["imageSizes"]["large"],
        },
        colors: {
            dark: parseColorDefinition(obj["colors"]["dark"]),
            light: parseColorDefinition(obj["colors"]["light"]),
            accent: parseColorDefinition(obj["colors"]["accent"]),
            good: parseColorDefinition(obj["colors"]["good"]),
            warning: parseColorDefinition(obj["colors"]["warning"]),
            attention: parseColorDefinition(obj["colors"]["attention"])
        },
        strongSeparation: parseSeparationDefinition(obj["strongSeparation"]),
        actions: parseActionsConfiguration(obj["actions"]),
        adaptiveCard: parseAdaptiveCardConfiguration(obj["adaptiveCard"]),
        container: parseContainerConfiguration(obj["container"]),
        textBlock: parseTextBlockConfiguration(obj["textBlock"]),
        image: parseImageConfiguration(obj["image"]),
        imageSet: parseImageSetConfiguration(obj["imageSet"]),
        factSet: parseFactSetConfiguration(obj["factSet"]),
        column: parseColumnConfiguration(obj["column"]),
        columnSet: parseColumnSetConfiguration(obj["columnSet"]),
        input: parseInputConfiguration(obj["input"])
    } : null;
}
exports.parseHostConfig = parseHostConfig;
//# sourceMappingURL=host-config.js.map