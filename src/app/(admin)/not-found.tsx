import Image from "next/image";
import Link from "next/link";

export default async function NotFound() {
    return (
        <div style={{
            height: "90vh",
            width: "100vw",
            padding: "8px 40px 8px 40px"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                textAlign: "center"
            }}>
                <Image src={"/images/illustrations/404.svg"} alt={"404"} width={300} height={300}/>
                <a style={{fontSize: "0.5em"}} href="https://storyset.com/internet">Internet illustrations by Storyset</a>
                <Link href={"/"}>Retourner à l'accueil</Link>
            </div>
        </div>
    )
}