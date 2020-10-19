import { useState, useEffect } from "react";
import { Button, Form, Icon, Message, Segment } from "semantic-ui-react";
import Link from "next/link";
import axios from "axios";
import { ACTION } from '../utils/UserReducer';
import { useRouter } from 'next/router';
import catchErrors from "../utils/catchErrors";

const INITIAL_USER = {
  email: "",
  password: ""
};

function Login({state, dispatch}) {
  
  const [user, setUser] = useState(INITIAL_USER);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  

  useEffect(() => {
    const isUser = Object.values(user).every(el => Boolean(el));
    isUser ? setDisabled(false) : setDisabled(true);
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setUser(prevState => ({ ...prevState, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      const body = { ...user };
      const response = await axios.post(`/api/login`, body);

      // Dispatch user to global context
      dispatch({ type: ACTION.SET_USER, payload: response.data});
      router.push('/');
    } catch (error) {
      catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  }

  if(state.authorized) router.push('/');

  return (
    <>{ !state.authorized &&
      <>
        <Message
          attached
          icon="privacy"
          header="Welcome Back!"
          content="Log in with email and password"
          color="blue"
        />
        <Form error={Boolean(error)} loading={loading} onSubmit={handleSubmit}>
          <Message error header="Oops!" content={error} />
          <Segment>
            <Form.Input
              fluid
              icon="envelope"
              iconPosition="left"
              label="Email"
              placeholder="Email"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              label="Password"
              placeholder="Password"
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
            />
            <Button
              disabled={disabled || loading}
              icon="sign in"
              type="submit"
              color="orange"
              content="Login"
            />
          </Segment>
        </Form>
        <Message attached="bottom" warning>
          <Icon name="help" />
          New user?{" "}
          <Link href="/signup">
            <a>Sign up here</a>
          </Link>{" "}
          instead.
        </Message>
      </>
    }</>
  );
}

export default Login;
