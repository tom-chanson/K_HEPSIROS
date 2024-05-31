import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { IUserDb } from '../interface/database';
import { IUser } from '../interface/user';
import { addDataDB, addOrUpdateDataDB, deleteDataDB } from '../services/DBManager';
import '../styles/components/userNavbar.less';
// import ContextMenu from './contextMenu';
import UserDialog from './dialog/userDialog';
export default function UserNavbar(props: {
    refNavbar: React.RefObject<HTMLDivElement>;
    listUser: IUserDb[];
    userSelected: string;
    userChange: (user: string) => void;
    userLoading: boolean;
    updateUserList: (userToSelect?: IUser | false) => void;
}) {
    const { listUser, userSelected, userChange } = props;
    const [open, setOpen] = useState(false);
    const [noProfil, setNoProfil] = useState(false);
    // const navigate = useNavigate();

    useEffect(() => {
        if (listUser.length === 0 && !props.userLoading) {
            setOpen(true);
            setNoProfil(true);
        } else {
            setNoProfil(false);
        }
    }, [props.userLoading]);

    const changeUserSelected = (user: string) => {
        if (user === "Add") {
            setOpen(true);
        } else {
            userChange(user);
        }
    }

    const onCloseUserDialog = () => {
        if (listUser.length > 0) {
            setOpen(false);
        }
    }

    const addOrUpdateUser = (user: IUserDb) => {
        addOrUpdateDataDB({table: "user", data: user})
        .then(() => {
            props.updateUserList({identifiant: user.identifiant, name: user.name});
            // userChange(user.identifiant);
        });
    }

    const addUser = (user: IUser) => {
        const userDb: IUserDb = {identifiant: user.identifiant, name: user.name, id: undefined};
        addDataDB({table: "user", data: userDb})
        .then(() => {
            props.updateUserList(user);
            setOpen(false);
            // userChange(user.identifiant);
        });
    }

    const updateUser = (user: IUserDb, userUpdate: IUser) => {
        const userToUpdate: IUserDb = {...user, ...userUpdate};
        addOrUpdateUser(userToUpdate);
    }

    const deleteUser = (user: IUserDb) => {
        if (user.id) {
            deleteDataDB("user", user.id).then(() => {
                if (userSelected === user.identifiant) {
                    if (listUser.length > 1 && listUser[0].identifiant !== user.identifiant) {
                        props.updateUserList({identifiant: listUser[0].identifiant, name: listUser[0].name});
                    } else if (listUser.length > 1) {
                        props.updateUserList({identifiant: listUser[1].identifiant, name: listUser[1].name});
                    } else {
                        props.updateUserList(false);
                    }
                } else {
                    props.updateUserList();
                }
            });
        }
    }

    return (
        // <ContextMenu>
        <div className="userNavbar" ref={props.refNavbar}>
            <Tabs
                value={userSelected ? userSelected : false }
                onChange={(_e, newValue: string) => changeUserSelected(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                className='userNavbarTabs'
            >
                {listUser.map((user) => (
                    <Tab key={crypto.randomUUID()} value={user.identifiant} label={user.name}
                        icon={<Avatar sx={{ width: 35, height: 35 }} alt={user.name} />}
                        iconPosition='start'
                        sx={{ paddingX: 3, fontSize:"0.9rem", minHeight: 0, paddingY: 1}}
                    />
                ))}
            </Tabs>
            <div className="userNavbarSeparator"></div>
            <div className='leftNavbar'>
                <IconButton onClick={() => setOpen(true)} sx={{padding: 0, margin: 0}}>
                    <ManageAccountsIcon sx={{width: 35, height: 35}} />
                </IconButton>
                {/* <IconButton onClick={() => navigate("/settings")} sx={{padding: 0, margin: 0}}>
                    <SettingsIcon sx={{width: 30, height: 30}} />
                </IconButton>    */}
            </div>
            <UserDialog listUser={listUser} open={open} onClose={onCloseUserDialog} onAddUser={addUser} onDeleteUser={deleteUser} onUpdateUser={updateUser} 
            forceOpen={noProfil} />
        </div>
        // </ContextMenu>
    );
}