import { fetcher } from "@/app/fetcher";
import useSWR from "swr";
import Image from "next/image";

export default function StatusTask({ id_status_task }: { id_status_task: number }) {
    var image = ''
    if (id_status_task == 1) {
        image = '/check-box.png'
    }
    else {
        image = '/square.png'
    }
    return (
        <button className="status">
            <Image src={image}
                width={20}
                height={20}
                alt={''}
            />
        </button>
    );
}