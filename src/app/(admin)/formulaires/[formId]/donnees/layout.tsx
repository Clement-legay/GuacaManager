import '@/styles/globals.css'
import React from "react";
import { Metadata } from "next";
import {notFound} from "next/navigation";
import {FormService} from "@/services/Forms/form.service";

export async function generateMetadata({ params }: { params: { formId: string } }): Promise<Metadata> {
    const id = params.formId;

    const formsService = new FormService();
    const result = await formsService.checkFormValidity(id);

    if (!result) {
        notFound();
    }

    return {
        title: `${result.name} données`,
        description: `Tableau des données du formulaire ${result.name}`,
    }
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {children}
        </div>
    )
}
