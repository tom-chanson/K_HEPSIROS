
export interface ISettingsCategory {
    name: string;
    settings: Settings[];
  }
  
  export type Settings =
    | ISettingsChoice
    | ISettingsNumber
    | ISettingsBoolean
    | ISettingsColor
    | ISettingsPopin
    | ISettingsListButton;
  
  interface ISettings {
    name: string;
    label: string;
    description: string;
    anchor: string;
  }
  
  export interface ISettingsChoice extends ISettings {
    type: "choice";
    choices: { value: string; label: string }[];
    default: string;
  }
  
  export interface ISettingsNumber extends ISettings {
    type: "number";
    default: number;
    min?: number;
    max?: number;
  }
  
  export interface ISettingsBoolean extends ISettings {
    type: "boolean";
    default: boolean;
  }
  
  export interface ISettingsColor extends ISettings {
    type: "color";
    default: string;
  }
  
  type ButtonType = "close";
  
  interface IButton {
    text: string;
    color: string;
    role?: ButtonType;
    onClick?: () => void;
  }
  
  export interface ISettingsPopin extends ISettings {
    type: "popin";
    buttonText: string;
    popinTitle: string;
    popinText: string;
    popinButtons: IButton[];
  }
  
  export interface ISettingsListButton extends ISettings {
    type: "list-button";
    buttons: IButton[];
  }