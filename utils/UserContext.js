import { createContext } from 'react';

export const UserContext = createContext({
    user: null,
    authorized: false,
    error: null
});