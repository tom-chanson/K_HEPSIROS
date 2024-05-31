export interface confirmationDialog {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    message: string;
    messageYes?: string;
    messageNo?: string;
} 