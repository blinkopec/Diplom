import Image from "next/image";
import "@/app/homepage.css";
import Link from "next/link";

export default function LoginButton({ name, handleClick, logged }: { name: string, handleClick: () => void, logged: boolean }) {
    if (logged) {
        return (
            <div className="user-logo ">
                <h2 className="">{name}</h2>
                <Image className="image-cursor" onClick={() => handleClick()} src={'/logout-icon.png'} width={25} height={25} alt="exit" />
            </div>
        )
    }
    else {
        return (
            <div className="user-logo ">
                <Link href='/auth' className="user-logo ">
                    <Image
                        src={'/user-icon.png'}
                        width={25}
                        height={25}
                        alt="user"
                    />
                </Link>
                <Image className="image-cursor" onClick={() => handleClick()} src={'/logout-icon.png'} width={25} height={25} alt="exit" />
            </div>
        )
    }
}