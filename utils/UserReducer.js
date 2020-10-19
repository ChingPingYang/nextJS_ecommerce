
export const initState = {
    user: null,
    authorized: false,
    loading: true,
    error: null
}

export const ACTION = {
    SET_USER: 'SET_USER',
    CLEAR_USER: 'CLEAR_USER'
}

export const userReducer = (state, action) => {
    const { type, payload } = action;
    console.log('Reducer:', type, payload)
    switch(type) {
        case ACTION.SET_USER:
            return {
                user: payload,
                authorized: true,
                loading: false,
                error: null
            }
        case ACTION.CLEAR_USER:            
            return {
                user: null,
                authorized: false,
                loading: false,
                error: payload
            }   
        default:
            return state;
    }
}