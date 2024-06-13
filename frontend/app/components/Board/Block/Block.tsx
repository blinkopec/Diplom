import { fetcher } from "@/app/fetcher";
import useSWR from "swr";
import "./Block.css";
import Task from "./Task/Task";
import Image from "next/image";
import MenuActionsBlock from "./MenuActionsBlock/MenuActionsBlock";
import AddTaskButton from "./AddTaskButton/AddTaskButton";
import { apiRequests } from "@/app/apiRequests";

export default function Block({ block }: { block: Block }) {
    const { data: tasks, isLoading } = useSWR("/api/tasks/" + block.id + "/get_by_id_block", fetcher);
    if (isLoading) {
        return <></>
    }

    const taskDisplay = tasks.map((task: Task) => { 
        return (
            <Task task={task} block={block} />
        );
    })

    function handleDragDrop(e: any) {
        var b = JSON.parse(e.dataTransfer.getData("block"));
        var t = JSON.parse(e.dataTransfer.getData("task"));

        if (b.id != block.id) {
            var lastPos = 0
            lastPos = Number(apiRequests._get('/api/tasks/' + block.id + "/get_last_task/").then(result => {
                apiRequests._patch("/api/tasks/" + t.id + "/", { position: result.position + 1, id_block: block.id })
            }))

            window.location.reload()
        }
        else {
            e.preventDefault()
        }
    }
//TODO: не выводить AddTask если роль не позволяет
    return (
        <div className="block">
            <div className="block__header">
                <div className="block__tittle">
                    <h3>{block?.name}</h3>

                    <MenuActionsBlock block={block} />
                </div>
                <div className="block__tittle--line" />

            </div>
            <div className="block__addTaskButton" >
                <AddTaskButton blockId={block.id} />
            </div>
            <div className="tasks--list" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDragDrop(e)} >
                {taskDisplay}
            </div>
        </div>
    );
}