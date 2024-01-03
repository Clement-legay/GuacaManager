import toast from "react-hot-toast";
import {FormEntitySpec} from "@/app/context/entity/FormEntity";
import {TemplateFileEntitySpec} from "@/app/context/entity/TemplateFileEntity";
import {MainContext} from "@/app/context/contextProvider";
import {useContext} from "react";
import {ToastMessages, defaultMessages} from "@/app/context/config/toastMessages";
import {UnwrapPromise} from "next/dist/lib/coalesced-function";

type EntitiesSpec = FormEntitySpec & TemplateFileEntitySpec;

export const useMainContext = () => {
    return useContext(MainContext);
};

export const useToastedContext = () => {
    const context = useMainContext();
    return async <T extends keyof EntitiesSpec>(
        methodName: T,
        parameters: Parameters<EntitiesSpec[T]>[0],
        messages: ToastMessages = defaultMessages
    ): Promise<UnwrapPromise<ReturnType<EntitiesSpec[T]>> | null> => {
        const {[methodName]: operation} = context;

        const toastSimple: boolean = !!(!messages.loading && messages.error);

        try {
            if (!toastSimple) {
                // @ts-ignore
                return await toast.promise(operation(parameters), {
                    loading: messages.loading,
                    success: messages.success,
                    error: messages.error
                });
            } else {
                // @ts-ignore
                return await operation(parameters)
            }
        } catch (e: any) {
            if (toastSimple && messages.error) {
                toast.error(messages.error(e));
            }
            return null;
        }
    };
}