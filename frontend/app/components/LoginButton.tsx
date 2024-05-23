import Image from "next/image";
import "@/app/styles.css";
import Link from "next/link";

export default function LoginButton({ name,handleClick}: { name: string ,handleClick: () => void}) {
    return (
        <div className="user-logo ">
            <Link href='/auth' className="user-logo ">
                <h2 className="">{name}</h2>
                <Image
                    src={'/user-icon.png'}
                    width={25}
                    height={25}
                    alt="user"
                />
            </Link>
            <Image className="image-cursor" onClick={() => handleClick()} src={'/logout-icon.png'} width={25} height={25} alt="exit"/>
        </div>
    )
}