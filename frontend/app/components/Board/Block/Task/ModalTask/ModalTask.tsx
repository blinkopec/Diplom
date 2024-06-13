import { Box, Modal, Typography } from "@mui/material";
import { useState } from "react";
import './ModalTask.css'

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const date = {
    margin: '0px 0px 0px 230px',
}
export default function ModalTask({ task,open,setOpen,editing }: { task: Task, open:boolean, setOpen: (open:boolean, edit:boolean) => void , editing:boolean }) {
    return (
        <Modal open={open} aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description" 
            onClose={() => setOpen(false, false)}>
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {task.text}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <b>Описание: </b>
                    {task.description}
                </Typography>
                <Typography id="modal-modal-description" sx={ date}>
                    {typeof task.date === 'object'
                        && task.date instanceof Date
                        ? task.date.toLocaleDateString() : task.date}
                </Typography>
                <button onClick={() => setOpen(false, true)} className={`modal__edit ${editing ? 'active' : ''}`}>
                    Редактировать
                </button>
            </Box>
        </Modal>
    );
}