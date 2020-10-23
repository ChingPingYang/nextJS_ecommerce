import { createContext } from 'react';

const UserContext = createContext({
    user: null,
    authorized: false,
    error: null
});

export default UserContext;