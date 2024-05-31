import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export default function ModalSettings(props: any) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#313338',
        boxShadow: 24,
        borderRadius: '10px',
        p: 4,
      };

      const onClickButton = (role: string, onClick: any) => {
            if (role && role === "close") {
                handleClose();
            }
            onClick();
        }
    return (
        <>
        <Button onClick={handleOpen}>{props.label}</Button>
        <Modal
            open={open}
            className='modal'
            >
            <Box sx={style}>

            <div className='popin'>
                <Typography variant="h6" component="h2">
                    {props.popinTitle}
                </Typography>
                <Typography sx={{ mt: 2, mb: 4 }}>
                    {props.popinText}
                </Typography>
                {props.popinButtons.map((button: any) => (
                    <Button key={crypto.randomUUID()} onClick={() => {onClickButton(button.role, button.onClick)}} sx={{ mr: 1 }} variant="contained">{button.text}</Button>
                ))}
            </div>
            </Box>
        </Modal>
        </>
    )

}