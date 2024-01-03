import React from 'react';
import {FormManage} from "@/components/pages/formManage";

type Props = {
    params: { formId : string }
}

export default function FormDataPage({ params }: Props) {
    const formId = params.formId;

    return (
        <FormManage formId={formId} mode={"data"}/>
    )
}