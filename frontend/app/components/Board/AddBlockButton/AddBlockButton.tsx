import { useState } from 'react';
import './AddBlockButton.css';
import Image from 'next/image';
import { apiRequests } from '@/app/apiRequests';
import { fetcher } from '@/app/fetcher';
import useSWR from 'swr';

export default function AddBlockButton({ boardId }: { boardId: number }) {
    const [isOpen, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const { data: role, isLoading } = useSWR("/api/user_roles/" + boardId + "/get_by_id_board_user/", fetcher)

    if (isLoading) {
        return <></>
    }
    if (!role.creating_block) {
        return <></>
    }
    function addBlock() {
        if (value) {
            apiRequests._post('/api/blocks/',
                {
                    "name": value,
                    "id_board": boardId
                });
            window.location.reload()
        }
    }

    return (
        <div className='add-button__main'>
            <button onClick={() => setOpen(!isOpen)}>
                <Image
                    src='/plus-icon.png'
                    width={15}
                    height={15}
                    alt='add block'
                />
            </button>

            <nav className={`add-block__input-box ${isOpen ? "active" : ""}`}>
                <input value={value} className='add-block__input_field' onChange={(e) => setValue(e.target.value)} />
                <button className='add-block__input-box__close' onClick={() => { setOpen(!isOpen); setValue(''); }}>
                    <Image
                        src='/close.png'
                        width={15}
                        height={15}
                        alt='close'
                    />
                </button>
                <button className='add-block__input-box__accept' onClick={() => addBlock()}>
                    <Image
                        src='/check.png'
                        width={15}
                        height={15}
                        alt='accept'
                    />
                </button>
            </nav>
        </div>
    )
}