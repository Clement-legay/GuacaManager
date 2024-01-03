import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import React from "react";
import {ContextProvider} from "@/app/context/contextProvider";


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'GuacaTables',
    description: 'GuacaTables est un outil de gestion de formulaires dynamiques.',
    viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr">
            <body className={inter.className}>
                <ContextProvider>
                    {children}
                </ContextProvider>
            </body>
        </html>
    )
}
