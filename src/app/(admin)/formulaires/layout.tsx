import '@/styles/globals.css'
import React from "react";

export const generateMetadata = () => {
    return {
        title: 'Formulaires',
        description: 'Liste des formulaires créés',
    }
}

type Props = {
    children: React.ReactNode
}

export default function Layout({children}: Props) {
      return (
          <div>
            {children}
          </div>
      )
}
