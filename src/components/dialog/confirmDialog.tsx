import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import "../../styles/components/dialog/confirmDialog.less";

export default function ConfirmDialog(props: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    message: string;
    messageYes?: string;
    messageNo?: string;
}) {
    let messageYes = props.messageYes ? props.messageYes : "Confirmer";
    let messageNo = props.messageNo ? props.messageNo : "Annuler";
    return (
        <Dialog open={props.open} onClose={props.onClose} className="confirmDialog">
            <DialogTitle>{props.title}</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={props.onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}>
                    <CloseIcon />   
                </IconButton>
            <DialogContent dividers>
            <List>
                <ListItem>
                    <ListItemText primary={props.message} className="message" />
                </ListItem>
                <ListItem className="buttons">
                    <ListItemButton onClick={props.onConfirm} className="button confirm">
                        <ListItemText primary={messageYes} />
                    </ListItemButton>
                    <ListItemButton onClick={props.onCancel} className="button cancel">
                        <ListItemText primary={messageNo} />
                    </ListItemButton>
                </ListItem>
            </List>
            </DialogContent>
        </Dialog>
    );
}
