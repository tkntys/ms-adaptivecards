import * as Enums from "./enums";
import * as Utils from "./utils";
import * as HostConfig from "./host-config";
export interface IValidationError {
    error: Enums.ValidationError;
    message: string;
}
export declare abstract class CardElement {
    private _parent;
    private internalGetNonZeroPadding(element, padding);
    protected showBottomSpacer(requestingElement: CardElement): void;
    protected hideBottomSpacer(requestingElement: CardElement): void;
    protected setParent(value: CardElement): void;
    protected readonly useDefaultSizing: boolean;
    protected readonly padding: HostConfig.ISpacingDefinition;
    protected abstract internalRender(): HTMLElement;
    speak: string;
    horizontalAlignment: Enums.HorizontalAlignment;
    separation: Enums.Separation;
    abstract getJsonTypeName(): string;
    abstract getDefaultSeparationDefinition(): HostConfig.ISeparationDefinition;
    abstract renderSpeech(): string;
    getNonZeroPadding(): HostConfig.ISpacingDefinition;
    getForbiddenElementTypes(): Array<string>;
    getForbiddenActionTypes(): Array<any>;
    parse(json: any): void;
    validate(): Array<IValidationError>;
    render(): HTMLElement;
    isLastItem(item: CardElement): boolean;
    getRootElement(): CardElement;
    getAllInputs(): Array<Input>;
    readonly isInteractive: boolean;
    readonly isStandalone: boolean;
    readonly parent: CardElement;
}
export declare class TextBlock extends CardElement {
    size: Enums.TextSize;
    weight: Enums.TextWeight;
    color?: Enums.TextColor;
    text: string;
    isSubtle: boolean;
    wrap: boolean;
    maxLines: number;
    protected internalRender(): HTMLElement;
    parse(json: any): void;
    getJsonTypeName(): string;
    getDefaultSeparationDefinition(): HostConfig.ISeparationDefinition;
    renderSpeech(): string;
}
export declare class Fact {
    name: string;
    value: string;
    speak: string;
    renderSpeech(): string;
}
export declare class FactSet extends CardElement {
    protected readonly useDefaultSizing: boolean;
    protected internalRender(): HTMLElement;
    facts: Array<Fact>;
    getJsonTypeName(): string;
    getDefaultSeparationDefinition(): HostConfig.ISeparationDefinition;
    parse(json: any): void;
    renderSpeech(): string;
}
export declare class Image extends CardElement {
    protected readonly useDefaultSizing: boolean;
    protected internalRender(): HTMLElement;
    style: Enums.ImageStyle;
    url: string;
    size: Enums.Size;
    selectAction: ExternalAction;
    getJsonTypeName(): string;
    getDefaultSeparationDefinition(): HostConfig.ISeparationDefinition;
    parse(json: any): void;
    renderSpeech(): string;
}
export declare class ImageSet extends CardElement {
    private _images;
    protected internalRender(): HTMLElement;
    imageSize: Enums.Size;
    getJsonTypeName(): string;
    getDefaultSeparationDefinition(): HostConfig.ISeparationDefinition;
    parse(json: any): void;
    addImage(image: Image): void;
    renderSpeech(): string;
}
export declare abstract class Input extends CardElement implements Utils.IInput {
    id: string;
    title: string;
    defaultValue: string;
    readonly abstract value: string;
    getDefaultSeparationDefinition(): HostConfig.ISeparationDefinition;
    validate(): Array<IValidationError>;
    parse(json: any): void;
    renderSpeech(): string;
    getAllInputs(): Array<Input>;
    readonly isInteractive: boolean;
}
export declare class TextInput extends Input {
    private _textareaElement;
    private _inputElement;
    protected internalRender(): HTMLElement;
    maxLength: number;
    isMultiline: boolean;
    placeholder: string;
    getJsonTypeName(): string;
    parse(json: any): void;
    readonly value: string;
}
export declare class ToggleInput extends Input {
    private _checkboxInputElement;
    protected internalRender(): HTMLElement;
    title: string;
    valueOn: string;
    valueOff: string;
    getJsonTypeName(): string;
    parse(json: any): void;
    readonly value: string;
}
export declare class Choice {
    title: string;
    value: string;
}
export declare class ChoiceSetInput extends Input {
    private _selectElement;
    private _toggleInputs;
    protected internalRender(): HTMLElement;
    choices: Array<Choice>;
    isCompact: boolean;
    isMultiSelect: boolean;
    placeholder: string;
    getJsonTypeName(): string;
    validate(): Array<IValidationError>;
    parse(json: any): void;
    readonly value: string;
}
export declare class NumberInput extends Input {
    private _numberInputElement;
    protected internalRender(): HTMLElement;
    min: string;
    max: string;
    getJsonTypeName(): string;
    parse(json: any): void;
    readonly value: string;
}
export declare class DateInput extends Input {
    private _dateInputElement;
    protected internalRender(): HTMLElement;
    getJsonTypeName(): string;
    readonly value: string;
}
export declare class TimeInput extends Input {
    private _timeInputElement;
    protected internalRender(): HTMLElement;
    getJsonTypeName(): string;
    readonly value: string;
}
export declare abstract class Action {
    static createAction(json: any): Action;
    private _parent;
    protected setParent(value: CardElement): void;
    abstract getJsonTypeName(): string;
    abstract execute(): any;
    validate(): Array<IValidationError>;
    prepare(inputs: Array<Input>): void;
    parse(json: any): void;
    getAllInputs(): Array<Input>;
    title: string;
    readonly parent: CardElement;
}
export declare abstract class ExternalAction extends Action {
    execute(): void;
}
export declare class SubmitAction extends ExternalAction {
    private _isPrepared;
    private _originalData;
    private _processedData;
    getJsonTypeName(): string;
    prepare(inputs: Array<Input>): void;
    parse(json: any): void;
    data: Object;
}
export declare class OpenUrlAction extends ExternalAction {
    url: string;
    getJsonTypeName(): string;
    validate(): Array<IValidationError>;
    parse(json: any): void;
}
export declare class HttpHeader {
    private _value;
    name: string;
    prepare(inputs: Array<Input>): void;
    value: string;
}
export declare class HttpAction extends ExternalAction {
    private _url;
    private _body;
    private _headers;
    method: string;
    getJsonTypeName(): string;
    validate(): Array<IValidationError>;
    prepare(inputs: Array<Input>): void;
    parse(json: any): void;
    url: string;
    body: string;
    readonly headers: Array<HttpHeader>;
}
export declare class ShowCardAction extends Action {
    protected setParent(value: CardElement): void;
    readonly card: AdaptiveCard;
    title: string;
    execute(): void;
    getJsonTypeName(): string;
    validate(): Array<IValidationError>;
    parse(json: any): void;
    getAllInputs(): Array<Input>;
}
export declare class ActionSet extends CardElement {
    private _actionCollection;
    protected internalRender(): HTMLElement;
    actionStyle: Enums.ActionStyle;
    constructor();
    getJsonTypeName(): string;
    getDefaultSeparationDefinition(): HostConfig.ISeparationDefinition;
    validate(): Array<IValidationError>;
    parse(json: any, itemsCollectionPropertyName?: string): void;
    addAction(action: Action): void;
    getAllInputs(): Array<Input>;
    renderSpeech(): string;
    readonly isInteractive: boolean;
}
export declare abstract class ContainerBase extends CardElement {
    private _items;
    protected showBottomSpacer(requestingElement: CardElement): void;
    protected hideBottomSpacer(requestingElement: CardElement): void;
    protected internalRender(): HTMLElement;
    protected getBackgroundColor(): string;
    protected _element: HTMLDivElement;
    protected readonly padding: HostConfig.ISpacingDefinition;
    selectAction: ExternalAction;
    backgroundImage: string;
    isLastItem(item: CardElement): boolean;
    getDefaultSeparationDefinition(): HostConfig.ISeparationDefinition;
    validate(): Array<IValidationError>;
    parse(json: any, itemsCollectionPropertyName?: string): void;
    addItem(item: CardElement): void;
    clear(): void;
    getAllInputs(): Array<Input>;
    renderSpeech(): string;
}
export declare class Container extends ContainerBase {
    protected getBackgroundColor(): string;
    protected internalRender(): HTMLElement;
    protected readonly padding: HostConfig.ISpacingDefinition;
    style: Enums.ContainerStyle;
    getJsonTypeName(): string;
    parse(json: any): void;
}
export declare class Column extends Container {
    private _computedWeight;
    protected readonly padding: HostConfig.ISpacingDefinition;
    protected internalRender(): HTMLElement;
    size: number | "auto" | "stretch";
    getJsonTypeName(): string;
    getDefaultSeparationDefinition(): HostConfig.ISeparationDefinition;
    parse(json: any): void;
    readonly isStandalone: boolean;
}
export declare class ColumnSet extends CardElement {
    private _columns;
    protected internalRender(): HTMLElement;
    getJsonTypeName(): string;
    getDefaultSeparationDefinition(): HostConfig.ISeparationDefinition;
    parse(json: any): void;
    addColumn(column: Column): void;
    getAllInputs(): Array<Input>;
    renderSpeech(): string;
}
export interface IVersion {
    major: number;
    minor: number;
}
export declare class TypeRegistry<T> {
    private _items;
    private findTypeRegistration(typeName);
    clear(): void;
    registerType(typeName: string, createInstance: () => T): void;
    unregisterType(typeName: string): void;
    createInstance(typeName: string): T;
}
export declare abstract class ContainerWithActions extends ContainerBase {
    private _actionCollection;
    protected internalRender(): HTMLElement;
    actionStyle: Enums.ActionStyle;
    constructor();
    parse(json: any, itemsCollectionPropertyName?: string): void;
    isLastItem(item: CardElement): boolean;
    addAction(action: Action): void;
    clear(): void;
    getAllInputs(): Array<Input>;
    readonly isStandalone: boolean;
}
export declare class AdaptiveCard extends ContainerWithActions {
    private static currentVersion;
    static elementTypeRegistry: TypeRegistry<CardElement>;
    static actionTypeRegistry: TypeRegistry<Action>;
    static onExecuteAction: (action: ExternalAction) => void;
    static onShowPopupCard: (action: ShowCardAction) => void;
    static onInlineCardExpanded: (action: ShowCardAction, isExpanded: boolean) => void;
    static onParseError: (error: IValidationError) => void;
    static initialize(): void;
    private isVersionSupported();
    private _cardTypeName;
    protected getBackgroundColor(): string;
    protected readonly padding: HostConfig.ISpacingDefinition;
    minVersion: IVersion;
    fallbackText: string;
    getJsonTypeName(): string;
    validate(): Array<IValidationError>;
    parse(json: any): void;
    render(): HTMLElement;
}
export declare function setHostConfig(configuration: HostConfig.IHostConfig): void;
export declare function resetHostConfig(): void;
