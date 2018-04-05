"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationError;
(function (ValidationError) {
    ValidationError[ValidationError["ActionTypeNotAllowed"] = 0] = "ActionTypeNotAllowed";
    ValidationError[ValidationError["CollectionCantBeEmpty"] = 1] = "CollectionCantBeEmpty";
    ValidationError[ValidationError["ElementTypeNotAllowed"] = 2] = "ElementTypeNotAllowed";
    ValidationError[ValidationError["InteractivityNotAllowed"] = 3] = "InteractivityNotAllowed";
    ValidationError[ValidationError["InvalidPropertyValue"] = 4] = "InvalidPropertyValue";
    ValidationError[ValidationError["MissingCardType"] = 5] = "MissingCardType";
    ValidationError[ValidationError["PropertyCantBeNull"] = 6] = "PropertyCantBeNull";
    ValidationError[ValidationError["TooManyActions"] = 7] = "TooManyActions";
    ValidationError[ValidationError["UnknownActionType"] = 8] = "UnknownActionType";
    ValidationError[ValidationError["UnknownElementType"] = 9] = "UnknownElementType";
    ValidationError[ValidationError["UnsupportedCardVersion"] = 10] = "UnsupportedCardVersion";
})(ValidationError = exports.ValidationError || (exports.ValidationError = {}));
//# sourceMappingURL=enums.js.map