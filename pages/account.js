import { useEffect, useState } from 'react';
import axios from 'axios';
import AccountHeader from '../components/Account/AccountHeader';
import AccountOrders from '../components/Account/AccountOrders';
import AccountPermissions from '../components/Account/AccountPermissions';

function Account({ state }) {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    async function getOrders() {
      try {
        const res = await axios.get('/api/orders');
        setOrders(res.data);
      } catch(err){
        // console.log(err);
      }
    }
    getOrders();
  },[]);
  return (
    <>{state.user &&
      <>
        <AccountHeader user={state.user} />
        <AccountOrders orders={orders}/>
        {state.user.role === 'root' && <AccountPermissions />}
      </>}
    </>
  );
}

export default Account;
