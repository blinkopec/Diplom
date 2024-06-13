import { Box, Modal, Typography } from "@mui/material";
import { useState } from "react";
import './ModalTask.css'
import { apiRequests } from "@/app/apiRequests";

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
    margin: '0px 0px 0px 222px',
}

export default function ModalEdit({ task, open, setOpen }: { task: Task, open: boolean, setOpen: (open: boolean, edit: boolean) => void }) {
    const [text, setText] = useState(task.text)
    const [description, setDescription] = useState(task.description)
    const [dateTask, setDate] = useState(task.date)

    function handleSave() {
        apiRequests._patch("/api/tasks/" + task.id + "/", { text: text, description: description, date: dateTask })
        window.location.reload()        
    }

    return (
        <Modal open={open} aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            onClose={() => setOpen(false, false)}>
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    <input value={text} onChange={e => setText(e.target.value)} />
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <b>Описание: </b>
                    <textarea rows={4} cols={34} value={description} onChange={e => setDescription(e.target.value)} />
                </Typography>
                <Typography id="modal-modal-description" sx={date}>
                    <input type='date' value={typeof dateTask === 'object'
                        && dateTask instanceof Date
                        ? dateTask.toLocaleDateString() : dateTask} className="modal__date" onChange={e => setDate(e.target.value)}/>
                </Typography>
                <button onClick={() => handleSave()} className="modal__edit">
                    Сохранить
                </button>
            </Box>
        </Modal>
    );
}