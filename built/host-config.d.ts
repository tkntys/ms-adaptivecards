import * as Enums from "./enums";
export interface ISpacingDefinition {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
export interface IColorDefinition {
    normal: string;
    subtle: string;
}
export interface ISeparationDefinition {
    spacing: number;
    lineThickness?: number;
    lineColor?: string;
}
export interface IAdaptiveCardConfig {
    backgroundColor: string;
    padding: ISpacingDefinition;
}
export interface ITextBlockConfig {
    color: Enums.TextColor;
    separations: {
        small: ISeparationDefinition;
        normal: ISeparationDefinition;
        medium: ISeparationDefinition;
        large: ISeparationDefinition;
        extraLarge: ISeparationDefinition;
    };
}
export interface IContainerStyleDefinition {
    backgroundColor?: string;
    padding?: ISpacingDefinition;
    borderColor?: string;
    borderThickness?: ISpacingDefinition;
}
export interface IContainerConfig {
    separation: ISeparationDefinition;
    normal: IContainerStyleDefinition;
    emphasis: IContainerStyleDefinition;
}
export interface IImageConfig {
    separation: ISeparationDefinition;
    size: Enums.Size;
}
export interface IImageSetConfig {
    separation: ISeparationDefinition;
    imageSize: Enums.Size;
}
export interface IFactTextDefinition {
    size: Enums.TextSize;
    color: Enums.TextColor;
    isSubtle: boolean;
    weight: Enums.TextWeight;
    wrap: boolean;
}
export interface IFactTitleDefinition extends IFactTextDefinition {
    maxWidth?: number;
}
export interface IFactSetConfig {
    separation: ISeparationDefinition;
    title: IFactTitleDefinition;
    value: IFactTextDefinition;
    spacing: number;
}
export interface IColumnSetConfig {
    separation: ISeparationDefinition;
}
export interface IColumnConfig {
    separation: ISeparationDefinition;
}
export interface IShowCardActionConfig {
    actionMode: Enums.ShowCardActionMode;
    inlineTopMargin: number;
    backgroundColor: string;
    padding: ISpacingDefinition;
}
export interface IActionsConfig {
    maxActions: number;
    separation: ISeparationDefinition;
    buttonSpacing: number;
    showCard: IShowCardActionConfig;
    preExpandSingleShowCardAction?: boolean;
    actionsOrientation: Enums.Orientation;
    actionAlignment: Enums.ActionAlignment;
}
export interface IInputConfig {
    separation: ISeparationDefinition;
}
export interface IHostConfig {
    supportsInteractivity: boolean;
    fontFamily?: string;
    fontSizes: {
        small: number;
        normal: number;
        medium: number;
        large: number;
        extraLarge: number;
    };
    fontWeights: {
        lighter: number;
        normal: number;
        bolder: number;
    };
    imageSizes: {
        small: number;
        medium: number;
        large: number;
    };
    colors: {
        dark: IColorDefinition;
        light: IColorDefinition;
        accent: IColorDefinition;
        good: IColorDefinition;
        warning: IColorDefinition;
        attention: IColorDefinition;
    };
    strongSeparation: ISeparationDefinition;
    actions: IActionsConfig;
    adaptiveCard: IAdaptiveCardConfig;
    container: IContainerConfig;
    textBlock: ITextBlockConfig;
    image: IImageConfig;
    imageSet: IImageSetConfig;
    factSet: IFactSetConfig;
    column: IColumnConfig;
    columnSet: IColumnSetConfig;
    input: IInputConfig;
}
export declare function parseHostConfig(serializedConfiguration: string): IHostConfig;
