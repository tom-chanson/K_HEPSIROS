import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import { useEffect, useState } from 'react';
import { IUserDb } from '../../interface/database';
import '../../styles/components/dialog/userDialog.less';
import ConfirmDialog from './confirmDialog';
import FormUserDialog from './formUserDialog';

import DeleteIcon from '@mui/icons-material/Delete';
import { confirmationDialog } from '../../interface/dialog';
import { IUser } from '../../interface/user';

export default function UserDialog(props: {
    open: boolean;
    onClose: () => void;
    onAddUser: (user: IUser) => void;
    onDeleteUser: (user: IUserDb) => void;
    onUpdateUser: (user: IUserDb, userUpdate: IUser) => void;
    listUser: IUserDb[];
    forceOpen: boolean;
}) {

    const [openAddUpdate, setOpenAddUpdate] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUserDb>();
    const [updateUser, setUpdateUser] = useState(false);

    const [propsComfirm, setPropsComfirm] = useState<confirmationDialog>({
        open: false,
        onClose: () => {},
        onConfirm: () => {},
        onCancel: () => {},
        title: "",
        message: "",
        messageYes: "",
        messageNo: ""
    });

    const closeConfirm = () => {
        setPropsComfirm({
            open: false,
            onClose: () => {},
            onConfirm: () => {},
            onCancel: () => {},
            title: "",
            message: "",
            messageYes: "",
            messageNo: ""
        });
    }

    const onAddUpdateUser = (user: IUser) => {
        if (updateUser) {
            const userAlreadyExist = props.listUser.find((u) => u.identifiant === user.identifiant);
            if (userAlreadyExist && userAlreadyExist.id !== selectedUser?.id) {
                setPropsComfirm({
                    open: true,
                    onClose: () => {
                        closeConfirm();
                    },
                    onConfirm: () => {
                        closeConfirm();
                        props.onDeleteUser(userAlreadyExist);
                        props.onUpdateUser(selectedUser as IUserDb, user);
                        setOpenAddUpdate(false);
                    },
                    onCancel: () => {
                        closeConfirm();
                    },
                    title: "Profil déjà existant",
                    message: `Un profil avec l'identifiant ${user.identifiant} existe déjà. Voulez-vous supprimer le profil déjà existant ? (${userAlreadyExist.name})`,
                    messageYes: "Supprimer",
                    messageNo: "Annuler"
                });
            } else {
                props.onUpdateUser(selectedUser as IUserDb, user);
                setOpenAddUpdate(false);
            }
        } else {
            const userAlreadyExist = props.listUser.find((u) => u.identifiant === user.identifiant);
            if (userAlreadyExist) {
                setPropsComfirm({
                    open: true,
                    onClose: () => {
                        closeConfirm();
                    },
                    onConfirm: () => {
                        closeConfirm();
                        props.onUpdateUser(userAlreadyExist, user);
                        setOpenAddUpdate(false);
                    },
                    onCancel: () => {
                        closeConfirm();
                    },
                    title: "Profil déjà existant",
                    message: `Un profil avec l'identifiant ${user.identifiant} existe déjà. Voulez-vous modifier le profil déjà existant avec les nouvelles informations ? (${userAlreadyExist.name} -> ${user.name})`,
                    messageYes: "Mettre à jour",
                    messageNo: "Annuler"
                });
            } else {
                props.onAddUser(user);
                props.onClose();
                setOpenAddUpdate(false);
            }
        }
    }

    const onCancelAddUpdate = () => {
        setOpenAddUpdate(false);
    }

    const handleSelectedUser = (user: IUserDb) => {
        setSelectedUser(user);
        setUpdateUser(true);
        setOpenAddUpdate(true);
    }

    const handleAddUser = () => {
        setSelectedUser(undefined);
        setUpdateUser(false);
        setOpenAddUpdate(true);
    }

    useEffect(() => {
        if (props.forceOpen) {
            handleAddUser();
        }
    }, [props.forceOpen]);

    const openConfirmDeleteDialog = (user: IUserDb) => {
        setPropsComfirm({
            open: true,
            onClose: () => {},
            onConfirm: () => {
                closeConfirm();
                props.onDeleteUser(user);
            },
            onCancel: () => {
                closeConfirm();
            },
            title: "Suppression d'un profil",
            message: `Voulez vraiment supprimer le profil ${user.name} (${user.identifiant}) ?`,
            messageYes: "Valider",
            messageNo: "Annuler"
        });
    }

    return (
        <>
        <Dialog open={props.open} onClose={props.onClose} disableEscapeKeyDown={props.forceOpen} className={props.forceOpen ? "hide" : ""}>
            <DialogTitle>Gestion des profils</DialogTitle>
            {!props.forceOpen && 
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
                </IconButton> }
            <DialogContent dividers>
            <List className="userDialog">
                {props.listUser.map((user) => (
                    <ListItem key={crypto.randomUUID()} disableGutters
                        secondaryAction={<IconButton edge="end" aria-label="delete" onClick={() => {
                            openConfirmDeleteDialog(user);
                        }}><DeleteIcon /></IconButton>}
                        >
                        <ListItemButton key={user.identifiant + "userDialog-select"} onClick={() => handleSelectedUser(user)} className=''>
                            <ListItemAvatar>
                                <Avatar sx={{ width: 35, height: 35 }} alt={user.name} />
                            </ListItemAvatar>
                            <ListItemText primary={user.name} />
                        </ListItemButton>
                        
                    </ListItem>
                ))}
                <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleAddUser() }
            className='AddUpdateUser'>
            <ListItemAvatar>
              <Avatar sx={{ width: 35, height: 35 }}>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Ajouter un profil" />
          </ListItemButton>
        </ListItem>
            </List>
            </DialogContent>
        </Dialog>
        <ConfirmDialog open={propsComfirm.open} onClose={propsComfirm.onClose} onConfirm={propsComfirm.onConfirm} onCancel={propsComfirm.onCancel} title={propsComfirm.title} message={propsComfirm.message} messageYes={propsComfirm.messageYes} messageNo={propsComfirm.messageNo}/>
        <FormUserDialog open={openAddUpdate} onClose={onCancelAddUpdate} onAddUpdateUser={onAddUpdateUser} user={selectedUser} title={updateUser ? "Modifier un profil" : "Ajouter un profil"} forceOpen={props.forceOpen} ajout={!updateUser} />
        </>
    );
}
