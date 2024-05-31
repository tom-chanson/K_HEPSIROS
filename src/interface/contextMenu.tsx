export interface IContextMenu {
    children: React.ReactNode;
    menuItems: string[];
    menuActions: (() => void)[];
}