import { fetcher } from "@/app/fetcher";
import useSWR from "swr";
import "./Block.css";
import Task from "./Task/Task";
import Image from "next/image";
import MenuActionsBlock from "./MenuActionsBlock/MenuActionsBlock";
import AddTaskButton from "./AddTaskButton/AddTaskButton";

export default function Block({ block }: { block: Block }) {
    const { data: tasks, isLoading } = useSWR("/api/tasks/" + block.id + "/get_by_id_block", fetcher);
    if (isLoading) {
        return <></>
    }

    const taskDisplay = tasks.map((task: Task) => { // TODO: positioning task form db
        return (
            <Task task={task} />
        );
    })

    function handleDragDrop({ e, block }: { e: any, block: Block }) {
        console.log('asd')
    }

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
            <div className="tasks--list" onDrop={(e) => console.log("isus")} onDragOver={(e) => e.preventDefault()} >
                {taskDisplay}
            </div>
        </div>
    );
}