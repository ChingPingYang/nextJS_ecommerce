import { createContext } from 'react';

export const userContext = createContext({
    user: null,
    authorized: false,
    error: null
});