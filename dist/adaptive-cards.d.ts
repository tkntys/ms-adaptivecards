declare module 'adaptive-cards/enums' {
	export type Size = "auto" | "stretch" | "small" | "medium" | "large";
	export type TextSize = "small" | "normal" | "medium" | "large" | "extraLarge";
	export type TextWeight = "lighter" | "normal" | "bolder";
	export type TextColor = "dark" | "light" | "accent" | "good" | "warning" | "attention";
	export type HorizontalAlignment = "left" | "center" | "right";
	export type ActionAlignment = "left" | "center" | "right" | "stretch";
	export type ActionStyle = "button" | "link";
	export type ContainerStyle = "normal" | "emphasis";
	export type ImageStyle = "normal" | "person";
	export type Separation = "none" | "default" | "strong";
	export type ShowCardActionMode = "inline" | "inlineEdgeToEdge" | "popup";
	export type Orientation = "horizontal" | "vertical";
	export enum ValidationError {
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

}
declare module 'adaptive-cards/host-config' {
	import * as Enums from 'adaptive-cards/enums';
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
	export function parseHostConfig(serializedConfiguration: string): IHostConfig;

}
declare module 'adaptive-cards/utils' {
	import * as Enums from 'adaptive-cards/enums';
	import * as HostConfig from 'adaptive-cards/host-config';
	export function processMarkdown(text: string): any;
	export function getValueOrDefault<T>(obj: any, defaultValue: T): T;
	export function isNullOrEmpty(value: string): boolean;
	export function appendChild(node: Node, child: Node): void;
	export function renderSeparation(separationDefinition: HostConfig.ISeparationDefinition, orientation: Enums.Orientation): HTMLElement;
	export function stringToCssColor(color: string): string;
	export interface IInput {
	    id: string;
	    value: string;
	}
	export class StringWithSubstitutions {
	    private _isProcessed;
	    private _original;
	    private _processed;
	    substituteInputValues(inputs: Array<IInput>): void;
	    get(): string;
	    set(value: string): void;
	}

}
declare module 'adaptive-cards/text-formatters' {
	export function formatText(text: string): string;

}
declare module 'adaptive-cards/card-elements' {
	import * as Enums from 'adaptive-cards/enums';
	import * as Utils from 'adaptive-cards/utils';
	import * as HostConfig from 'adaptive-cards/host-config';
	export interface IValidationError {
	    error: Enums.ValidationError;
	    message: string;
	}
	export abstract class CardElement {
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
	export class TextBlock extends CardElement {
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
	export class Fact {
	    name: string;
	    value: string;
	    speak: string;
	    renderSpeech(): string;
	}
	export class FactSet extends CardElement {
	    protected readonly useDefaultSizing: boolean;
	    protected internalRender(): HTMLElement;
	    facts: Array<Fact>;
	    getJsonTypeName(): string;
	    getDefaultSeparationDefinition(): HostConfig.ISeparationDefinition;
	    parse(json: any): void;
	    renderSpeech(): string;
	}
	export class Image extends CardElement {
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
	export class ImageSet extends CardElement {
	    private _images;
	    protected internalRender(): HTMLElement;
	    imageSize: Enums.Size;
	    getJsonTypeName(): string;
	    getDefaultSeparationDefinition(): HostConfig.ISeparationDefinition;
	    parse(json: any): void;
	    addImage(image: Image): void;
	    renderSpeech(): string;
	}
	export abstract class Input extends CardElement implements Utils.IInput {
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
	export class TextInput extends Input {
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
	export class ToggleInput extends Input {
	    private _checkboxInputElement;
	    protected internalRender(): HTMLElement;
	    title: string;
	    valueOn: string;
	    valueOff: string;
	    getJsonTypeName(): string;
	    parse(json: any): void;
	    readonly value: string;
	}
	export class Choice {
	    title: string;
	    value: string;
	}
	export class ChoiceSetInput extends Input {
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
	export class NumberInput extends Input {
	    private _numberInputElement;
	    protected internalRender(): HTMLElement;
	    min: string;
	    max: string;
	    getJsonTypeName(): string;
	    parse(json: any): void;
	    readonly value: string;
	}
	export class DateInput extends Input {
	    private _dateInputElement;
	    protected internalRender(): HTMLElement;
	    getJsonTypeName(): string;
	    readonly value: string;
	}
	export class TimeInput extends Input {
	    private _timeInputElement;
	    protected internalRender(): HTMLElement;
	    getJsonTypeName(): string;
	    readonly value: string;
	}
	export abstract class Action {
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
	export abstract class ExternalAction extends Action {
	    execute(): void;
	}
	export class SubmitAction extends ExternalAction {
	    private _isPrepared;
	    private _originalData;
	    private _processedData;
	    getJsonTypeName(): string;
	    prepare(inputs: Array<Input>): void;
	    parse(json: any): void;
	    data: Object;
	}
	export class OpenUrlAction extends ExternalAction {
	    url: string;
	    getJsonTypeName(): string;
	    validate(): Array<IValidationError>;
	    parse(json: any): void;
	}
	export class HttpHeader {
	    private _value;
	    name: string;
	    prepare(inputs: Array<Input>): void;
	    value: string;
	}
	export class HttpAction extends ExternalAction {
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
	export class ShowCardAction extends Action {
	    protected setParent(value: CardElement): void;
	    readonly card: AdaptiveCard;
	    title: string;
	    execute(): void;
	    getJsonTypeName(): string;
	    validate(): Array<IValidationError>;
	    parse(json: any): void;
	    getAllInputs(): Array<Input>;
	}
	export class ActionSet extends CardElement {
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
	export abstract class ContainerBase extends CardElement {
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
	export class Container extends ContainerBase {
	    protected getBackgroundColor(): string;
	    protected internalRender(): HTMLElement;
	    protected readonly padding: HostConfig.ISpacingDefinition;
	    style: Enums.ContainerStyle;
	    getJsonTypeName(): string;
	    parse(json: any): void;
	}
	export class Column extends Container {
	    private _computedWeight;
	    protected readonly padding: HostConfig.ISpacingDefinition;
	    protected internalRender(): HTMLElement;
	    size: number | "auto" | "stretch";
	    getJsonTypeName(): string;
	    getDefaultSeparationDefinition(): HostConfig.ISeparationDefinition;
	    parse(json: any): void;
	    readonly isStandalone: boolean;
	}
	export class ColumnSet extends CardElement {
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
	export class TypeRegistry<T> {
	    private _items;
	    private findTypeRegistration(typeName);
	    clear(): void;
	    registerType(typeName: string, createInstance: () => T): void;
	    unregisterType(typeName: string): void;
	    createInstance(typeName: string): T;
	}
	export abstract class ContainerWithActions extends ContainerBase {
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
	export class AdaptiveCard extends ContainerWithActions {
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
	export function setHostConfig(configuration: HostConfig.IHostConfig): void;
	export function resetHostConfig(): void;

}
declare module 'adaptive-cards/adaptive-cards' {
	export * from 'adaptive-cards/card-elements';
	export * from 'adaptive-cards/enums';
	export * from 'adaptive-cards/host-config';

}
declare module 'adaptive-cards/schema' {
	export interface IActionBase extends ITypedElement {
	    speak?: string;
	    title: string;
	}
	export interface IActionHttp extends IActionBase {
	    body?: string;
	    headers?: any;
	    method?: string;
	    url: string;
	}
	export interface IActionOpenUrl extends IActionBase {
	    url: string;
	}
	export interface IActionShowCard extends IActionBase {
	    card: ICard;
	}
	export interface IActionSubmit extends IActionBase {
	    data?: any;
	}
	export interface ICard extends ITypedElement {
	    actions?: (IActionHttp | IActionOpenUrl | IActionShowCard | IActionSubmit)[];
	    backgroundImage?: string;
	    body?: (ITextBlock | IImage | IImageSet | IFactSet | IContainer | IColumnSet | IInputDate | IInputNumber | IInputText | IInputTime | IInputToggle)[];
	    speak?: string;
	    title?: string;
	}
	export interface ICardElement extends ITypedElement {
	    speak?: string;
	    horizontalAlignment?: HorizontalAlignment;
	    separation?: Separation;
	}
	export interface IColumn extends IContainer {
	    size?: string;
	}
	export interface IColumnSet extends ICardElement {
	    columns: IColumn[];
	}
	export interface IContainerBase extends ICardElement {
	    actions?: (IActionHttp | IActionOpenUrl | IActionShowCard | IActionSubmit)[];
	    items?: (ITextBlock | IImage | IImageSet | IFactSet | IContainer | IColumnSet | IInputDate | IInputNumber | IInputText | IInputTime | IInputToggle)[];
	    selectAction?: (IActionHttp | IActionOpenUrl | IActionShowCard | IActionSubmit);
	    startGroup?: boolean;
	}
	export interface IContainer extends IContainerBase {
	}
	export interface IFact {
	    title: string;
	    speak?: string;
	    value: string;
	}
	export interface IFactSet extends ICardElement {
	    facts: IFact[];
	}
	export interface IImage extends ICardElement {
	    altText?: string;
	    selectAction?: IActionBase;
	    size?: ImageSize;
	    style?: ImageStyle;
	    url: string;
	}
	export interface IImageSet extends ICardElement {
	    images: IImage[];
	    size?: ImageSize;
	}
	export interface IInput extends ICardElement {
	    id: string;
	}
	export interface IInputDate extends IInput {
	    max?: string;
	    min?: string;
	    placeholder?: string;
	    value?: string;
	}
	export interface IInputNumber extends IInput {
	    max?: string;
	    min?: string;
	    placeholder?: string;
	    value?: string;
	}
	export interface IInputText extends IInput {
	    isMultiline?: boolean;
	    maxLength?: number;
	    style?: TextInputStyle;
	    placeholder?: string;
	    value?: string;
	}
	export interface IInputTime extends IInput {
	    max?: string;
	    min?: string;
	    placeholder?: string;
	    value?: string;
	}
	export interface IInputToggle extends IInput {
	    title: string;
	    value?: string;
	    valueOn?: string;
	    valueOff?: string;
	}
	export interface ITextBlock extends ICardElement {
	    color?: TextColor;
	    isSubtle?: boolean;
	    maxLines?: number;
	    size?: TextSize;
	    text: string;
	    weight?: TextWeight;
	    wrap?: boolean;
	}
	export interface ITypedElement {
	    type: string;
	}
	export type HorizontalAlignment = "left" | "center" | "right";
	export type ImageSize = "auto" | "stretch" | "small" | "medium" | "large";
	export type ImageStyle = "normal" | "person";
	export type TextColor = "default" | "dark" | "light" | "accent" | "good" | "warning" | "attention";
	export type TextInputStyle = "text" | "tel" | "url" | "email";
	export type TextSize = "small" | "normal" | "medium" | "large" | "extraLarge";
	export type TextWeight = "lighter" | "normal" | "bolder";
	export type Separation = "none" | "default" | "strong";
	export class TypedElement implements ITypedElement {
	    constructor(type: string);
	    type: string;
	}
	export class Card extends TypedElement implements ICard {
	    constructor(init?: Partial<ICard>);
	    actions?: (IActionHttp | IActionOpenUrl | IActionShowCard | IActionSubmit)[];
	    backgroundImage?: string;
	    body?: (ITextBlock | IImage | IImageSet | IFactSet | IContainer | IColumnSet | IInputDate | IInputNumber | IInputText | IInputTime | IInputToggle)[];
	    speak?: string;
	    title?: string;
	}
	export class ActionBase extends TypedElement implements IActionBase {
	    constructor(type: string, init?: Partial<IActionBase>);
	    speak?: string;
	    title: string;
	}
	export class ActionHttp extends ActionBase implements IActionHttp {
	    constructor(init?: Partial<IActionHttp>);
	    body?: string;
	    headers?: any;
	    method?: string;
	    url: string;
	}
	export class ActionOpenUrl extends ActionBase implements IActionOpenUrl {
	    constructor(init?: Partial<IActionOpenUrl>);
	    url: string;
	}
	export class ActionShowCard extends ActionBase implements IActionShowCard {
	    constructor(init?: Partial<IActionShowCard>);
	    card: ICard;
	}
	export class ActionSubmit extends ActionBase implements IActionSubmit {
	    constructor(init?: Partial<IActionSubmit>);
	    data?: any;
	}
	export class CardElement extends TypedElement implements ICardElement {
	    constructor(type: string, init?: Partial<ICardElement>);
	    speak?: string;
	}
	export class ColumnSet extends CardElement implements IColumnSet {
	    constructor(init?: Partial<IColumnSet>);
	    columns: IColumn[];
	}
	export class ContainerBase extends CardElement implements IContainerBase {
	    constructor(type: string, init?: Partial<IContainerBase>);
	    actions?: (IActionHttp | IActionOpenUrl | IActionShowCard | IActionSubmit)[];
	    items?: (ITextBlock | IImage | IImageSet | IFactSet | IContainer | IColumnSet | IInputDate | IInputNumber | IInputText | IInputTime | IInputToggle)[];
	    selectAction?: (IActionHttp | IActionOpenUrl | IActionShowCard | IActionSubmit);
	    startGroup?: boolean;
	}
	export class Container extends ContainerBase implements IContainer {
	    constructor(init?: Partial<IContainer>);
	}
	export class Column extends ContainerBase implements IColumn {
	    constructor(init?: Partial<IColumn>);
	    size?: string;
	}
	export class Fact implements IFact {
	    constructor(init?: Partial<IFact>);
	    title: string;
	    speak?: string;
	    value: string;
	}
	export class FactSet extends CardElement implements IFactSet {
	    constructor(init?: Partial<IFactSet>);
	    facts: IFact[];
	}
	export class Image extends CardElement implements IImage {
	    constructor(init?: Partial<IImage>);
	    altText?: string;
	    horizontalAlignment?: HorizontalAlignment;
	    selectAction?: IActionBase;
	    size?: ImageSize;
	    style?: ImageStyle;
	    url: string;
	}
	export class ImageSet extends CardElement implements IImageSet {
	    constructor(init?: Partial<IImageSet>);
	    images: IImage[];
	    size?: ImageSize;
	}
	export class Input extends CardElement implements IInput {
	    constructor(type: string, init?: Partial<IInput>);
	    id: string;
	}
	export class InputDate extends Input implements IInputDate {
	    constructor(init?: Partial<IInputDate>);
	    max?: string;
	    min?: string;
	    placeholder?: string;
	    value?: string;
	}
	export class InputNumber extends Input implements IInputNumber {
	    constructor(init?: Partial<IInputNumber>);
	    max?: string;
	    min?: string;
	    placeholder?: string;
	    value?: string;
	}
	export class InputText extends Input implements IInputText {
	    constructor(init?: Partial<IInputText>);
	    isMultiline?: boolean;
	    maxLength?: number;
	    style?: TextInputStyle;
	    placeholder?: string;
	    value?: string;
	}
	export class InputTime extends Input implements IInputTime {
	    constructor(init?: Partial<IInputTime>);
	    max?: string;
	    min?: string;
	    placeholder?: string;
	    value?: string;
	}
	export class InputToggle extends Input implements IInputToggle {
	    constructor(init?: Partial<IInputToggle>);
	    title: string;
	    value?: string;
	    valueOn?: string;
	    valueOff?: string;
	}
	export class TextBlock extends TypedElement implements ITextBlock {
	    constructor(init?: Partial<ITextBlock>);
	    color?: TextColor;
	    horizontalAlignment?: HorizontalAlignment;
	    isSubtle?: boolean;
	    maxLines?: number;
	    size?: TextSize;
	    text: string;
	    weight?: TextWeight;
	    wrap?: boolean;
	}

}
