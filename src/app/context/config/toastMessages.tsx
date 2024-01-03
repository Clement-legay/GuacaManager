export type ToastMessages = {
    loading: string | null;
    success: string | null;
    error: ((error: Error) => string) | null;
}

export const defaultMessages: ToastMessages = {
    loading: 'Opération en cours...',
    success: 'Opération réussie',
    error: (error: Error) => error.message,
}

export const defaultError: ToastMessages = {
    loading: null,
    success: null,
    error: (error: Error) => error.message,
}