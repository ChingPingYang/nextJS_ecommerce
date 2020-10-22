import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Header, Checkbox, Table, Icon } from 'semantic-ui-react';
import formatDate from '../../utils/formatDate';

function AccountPermissions() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function getUsers() {
      try {
        const res = await axios.get('/api/users');
        setUsers(res.data);
      } catch(err){
        console.log(err);
      }
    }
    getUsers();
  },[]);
  return (
    <div style={{margin: '2em 0'}}>
      <Header as="h2">
        <Icon name="settings"/>
        User Permissions
      </Header>
      <Table compact celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Joined</Table.HeaderCell>
            <Table.HeaderCell>Updated</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map(user => (
            <UserPermission key={user._id} user={user}/>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

function UserPermission({ user }) {
  const [admin, setAdmin] = useState(user.role === 'admin');
  const isFirstLoad = useRef(true);
  useEffect(() => {
    if(isFirstLoad.current) {
      isFirstLoad.current = false;
      return
    }
    changePermission(user._id);
  }, [admin]);
  
  const changePermission = async (userId) => {
    const body = { userId, role: admin? 'admin' : 'user' };
    try {
      await axios.put('/api/users' ,body);
    } catch(err) {
      console.log(err)
    }
  }

  const handleChangePermission = () => {
    setAdmin(prevState => !prevState);
  }
  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox checked={admin} toggle onChange={handleChangePermission}/>
      </Table.Cell>
      <Table.Cell>{user.name}</Table.Cell>
      <Table.Cell>{user.email}</Table.Cell>
      <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
      <Table.Cell>{formatDate(user.updatedAt)}</Table.Cell>
      <Table.Cell>{admin ? 'admin' : 'user'}</Table.Cell>
    </Table.Row>
  )
}

export default AccountPermissions;
