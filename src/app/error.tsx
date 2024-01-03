"use client";

import React, {useEffect} from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void; }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <Box sx={{
            flexGrow: 1,
            height: "90vh",
            width: "100vw",
            padding: "8px 40px 8px 40px"
        }}>
            <Box style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                textAlign: "center"
            }}>
                <Image src={"/images/illustrations/500.svg"} alt={"404"} width={400} height={400}/>
                <a style={{fontSize: "0.5em"}} href="https://storyset.com/internet">Internet illustrations by
                    Storyset</a>
                <Button onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                >Réeessayer
                </Button>
                <Link href={"/"}>Retourner à l'accueil</Link>
            </Box>
        </Box>
    );
}