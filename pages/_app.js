import { useEffect, useReducer } from 'react';
import { UserContext } from '../utils/UserContext';
import { userReducer, initState, ACTION } from '../utils/UserReducer';
import Layout from "../components/_App/Layout";
import axios from 'axios';
import Router from 'next/router';

const MyApp = ({Component, pageProps}) => {
  const [ state, dispatch ] = useReducer(userReducer, initState);

  /* Send request to backend. if the request has cookie, log */
  /* user into global state. */
  useEffect(() => {
    getUser();
  },[]);

  const getUser = async () => {
    try {
      const res = await axios.get('/api/login');
      dispatch({ type: ACTION.SET_USER, payload: res.data});
    }catch(err) {
      console.log('front  err')
      dispatch({ type: ACTION.CLEAR_USER, payload: err.response.data.errmsg});
    }
  }

  // For synchronously log out pages on different tags.
  useEffect(() => {
    window.addEventListener('storage', syncLogout);
    return () => {
      window.removeEventListener('storage', syncLogout);
    }
  },[])
  const syncLogout = (e) => {
    if(e.key === "logout") {
      dispatch({ type: ACTION.CLEAR_USER });
      Router.push('/login');
    }
  }

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Layout>
        {!state.loading && <Component {...pageProps} state={state} dispatch={dispatch}/>}
      </Layout>
    </UserContext.Provider>
  )
}


export default MyApp;
