import '@/styles/globals.css'
import React from "react";
import {Metadata} from "next";
import {notFound} from "next/navigation";
import {Forms} from ".prisma/client";
import {FormService} from "@/services/Forms/form.service";

type Props = {
    params:
        {
            formIdOrAlias: string
        }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const idOrAlias = params.formIdOrAlias;

    const formsService = new FormService();
    const result = await formsService.checkFormValidity(idOrAlias);

    if (!result || result.status !== "published") {
        notFound();
    }

    return {
        title: result.name,
        description: `Page de complétion du formulaire ${result.name}. ${result.description}`,
    }
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {children}
        </div>
    )
}