import '@/styles/globals.css'
import MiniDrawer from "@/components/sidebar";
import React from "react";
import {Toaster} from "react-hot-toast";

export const generateMetadata = () => {
    return {
        title: 'GuacaTables',
        description: 'Page d\'accueil de GuacaTables',
    }
}

type Props = {
    children: React.ReactNode
}

export default function Layout({ children }: Props) {
    return (
        <MiniDrawer>
            {children}
            <Toaster
                position="bottom-right"
                reverseOrder={false}
                toastOptions={{
                    duration: 5000
                }}
            />
        </MiniDrawer>
    )
}