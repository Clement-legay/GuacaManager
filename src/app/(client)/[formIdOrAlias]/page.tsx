import React from 'react'
import {FillForm} from "@/components/pages/fillForm";
import {FormService} from "@/services/Forms/form.service";
import NotFound from "@/app/not-found";

type Props = {
    params: {
        formIdOrAlias: string
    }
}

export default async function FillFormPage({ params }: Props) {
    const idOrAlias = params.formIdOrAlias;

    const formsService = new FormService();
    const result = await formsService.checkFormValidity(idOrAlias);

    if (!result || result.status !== "published") {
        return NotFound;
    }

    return (
        <FillForm formId={result.id}/>
    )
}
