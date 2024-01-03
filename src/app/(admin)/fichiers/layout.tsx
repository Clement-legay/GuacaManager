import '@/styles/globals.css'
import React from "react";

export const metadata = {
  title: 'Fichiers',
  description: 'Liste des fichiers créés',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div>
          {children}
      </div>
  )
}
