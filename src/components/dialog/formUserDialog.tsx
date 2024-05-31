import CloseIcon from '@mui/icons-material/Close';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { IUser } from '../../interface/user';
import '../../styles/components/dialog/formUserDialog.less';

export default function FormUserDialog(props: {
    open: boolean;
    onClose: () => void;
    onAddUpdateUser: (user: IUser) => void;
    title: string;
    user?: IUser;
    forceOpen: boolean;
    ajout: boolean;
}) {
    const [name, setName] = useState("");
    const [identifiant, setIdentifiant] = useState("");
    const [formValid, setFormValid] = useState(false);
    const [identifiantUpdate, setIdentifiantUpdate] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    //au moins 1 caratère puis un point puis au moins 1 caractère
    const regexIdentifiant = /^[a-z]{1,}\.[a-z]{1,}$/;

    const minLengthName = 3;
    const maxLengthName = 25;
    const maxLengthIdentifiant = 25;

    useEffect(() => {
        //remplacer tous les caractères spéciaux par rien (sauf un point) puis mettre en minuscule et enlever les espaces
        if (name && name.trim().length >= minLengthName && regexIdentifiant.test(identifiant as string) && name.trim().length <= maxLengthName){
            setFormValid(true);
        } else {
            setFormValid(false);
        }
    }, [name, identifiant]);

    useEffect(() => {
        if (props.user) {
            setName(props.user.name);
            setIdentifiant(props.user.identifiant);
            setIdentifiantUpdate(true);
        } else {
            setName("");
            setIdentifiant("");
            setIdentifiantUpdate(false);
        }
    } , [props.user, props.open]);


    const handleDialogClose = () => {
        if (!props.forceOpen) {
            props.onClose();
        }
    }

    useEffect(() => {
        if (!props.open) {
            setIdentifiantUpdate(false);
            setShowAlert(false);
        }
    }, [props.open]);


    const addUpdateUser = () => {
        if (formValid) {
            props.onAddUpdateUser({name, identifiant})
        }
    }

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setName(name.trim());
        if (formValid) {
            addUpdateUser();
        } else {
            setShowAlert(true);
        }
    }

    const formatIdentifiant = (identifiant: string) => {
        while (identifiant.at(0) === ".") {
            identifiant = identifiant.substring(1);
        }
        const firstPoint = identifiant.indexOf(".");
        if (firstPoint !== -1) {
            const firstPart = identifiant.substring(0, firstPoint);
            const secondPart = identifiant.substring(firstPoint + 1).replace(/\./g, "");
            identifiant = `${firstPart}.${secondPart}`;
        }
        return identifiant.trim().toLowerCase().replace(/[^a-z.]/g, "");

    }

    useEffect(() => {
        if (!identifiantUpdate) {
            //si l'identifiant a un point, on remplace les espaces par rien
            let newIdentifiant = "";
            if (name.length === 0) {
                newIdentifiant = "";
            // } else if (name.includes(".")) {
            //     const nameToIdentifiant = name.trim();
            //     const firstPart = nameToIdentifiant.split(".")[0];
            //     const secondPart = nameToIdentifiant.replace(firstPart, "").trim().replace(/\./g, "");
            //     newIdentifiant = `${firstPart}.${secondPart}`.replace(/ /g, "");
            } else if (identifiant.includes(".")) {
                const nameToIdentifiant = name.trim();
                const firstPart = nameToIdentifiant.split(" ")[0];
                const secondPart = nameToIdentifiant.replace(firstPart, "").trim().replace(/ /g, "");
                newIdentifiant = `${firstPart}.${secondPart}`;
            } else {
                newIdentifiant = name.trim().replace(/ /g, ".");
            }
            setIdentifiant(formatIdentifiant(newIdentifiant));
        }
    }, [identifiantUpdate, name]);

    return (
        <Dialog open={props.open} onClose={handleDialogClose} disableEscapeKeyDown={props.forceOpen} className='formUserDialog'>
            <DialogTitle>{props.title}</DialogTitle>
            {!props.forceOpen &&
            <IconButton
                aria-label="close"
                onClick={handleDialogClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}>
          <CloseIcon />
        </IconButton> }
        <form onSubmit={onFormSubmit}>
            <DialogContent dividers>
                <div className='input-group'>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Nom"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => {
                        let value = e.target.value;
                        while (value.at(0) === " ") {
                            value = value.substring(1);
                        }
                        setName(value);}}
                    required
                />
                {showAlert && <Alert severity={name.trim().length < minLengthName || name.trim().length > maxLengthName  ? "error" : "success"} className='alert'>Le nom doit contenir entre {minLengthName} et {maxLengthName} caractères</Alert>}
                </div>
                <div className='input-group'>
                <TextField
                    margin="dense"
                    id="user"
                    label="Identifiant"
                    type="text"
                    fullWidth
                    value={identifiant}
                    required
                    onChange={(e) => {
                        let value = e.target.value;
                        setIdentifiant(formatIdentifiant(value));
                        setIdentifiantUpdate(true);
                    }}
                />

                <Alert severity={showAlert ? regexIdentifiant.test(identifiant) ? "success" : "error" : "info"}
                className='alert'           
                >L'identifiant doit être de la forme "nom.prenom" sans espace et sans caractères spéciaux</Alert>
                {showAlert && 
                <Alert severity={identifiant.length <= maxLengthIdentifiant ? "success" : "error"} className='alert'>L'identifiant doit contenir moins de {maxLengthIdentifiant} caractères</Alert>
                }
                </div>
            </DialogContent>
            <DialogActions>
                {!props.forceOpen && <Button onClick={handleDialogClose}>Annuler</Button>}
                <Button type='submit'>{props.ajout ? "Ajouter" : "Modifier"}</Button>
            </DialogActions>
            </form>
        </Dialog>
    );
}