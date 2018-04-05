export declare type Size = "auto" | "stretch" | "small" | "medium" | "large";
export declare type TextSize = "small" | "normal" | "medium" | "large" | "extraLarge";
export declare type TextWeight = "lighter" | "normal" | "bolder";
export declare type TextColor = "dark" | "light" | "accent" | "good" | "warning" | "attention";
export declare type HorizontalAlignment = "left" | "center" | "right";
export declare type ActionAlignment = "left" | "center" | "right" | "stretch";
export declare type ActionStyle = "button" | "link";
export declare type ContainerStyle = "normal" | "emphasis";
export declare type ImageStyle = "normal" | "person";
export declare type Separation = "none" | "default" | "strong";
export declare type ShowCardActionMode = "inline" | "inlineEdgeToEdge" | "popup";
export declare type Orientation = "horizontal" | "vertical";
export declare enum ValidationError {
    ActionTypeNotAllowed = 0,
    CollectionCantBeEmpty = 1,
    ElementTypeNotAllowed = 2,
    InteractivityNotAllowed = 3,
    InvalidPropertyValue = 4,
    MissingCardType = 5,
    PropertyCantBeNull = 6,
    TooManyActions = 7,
    UnknownActionType = 8,
    UnknownElementType = 9,
    UnsupportedCardVersion = 10,
}
