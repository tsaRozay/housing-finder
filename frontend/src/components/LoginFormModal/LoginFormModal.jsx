import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const resetForm = () => {
    setCredential("");
    setPassword("");
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(() => {
        resetForm();
        closeModal()
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors?.credential) {
          setErrors({ credential: data.errors.credential });
        } else {
          setErrors({ credential: "The provided credentials were invalid." });
        }
      });
  };

  // Reset the form on unmount
  useEffect(() => {
    return () => resetForm();
  }, []);

  return (
    <div className="login-modal-container">
      <h1>Log In</h1>

      {errors.credential && (
        <div className="error-container">
          <p>{errors.credential}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} id="login-form">
        <div className="email">
          <input
            type="text"
            value={credential}
            placeholder="Username or Email"
            onChange={(e) => setCredential(e.target.value)}
          />
        </div>

        <div className="password">
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="log-in-button-div">
          <button
            disabled={credential.length < 4 || password.length < 6}
            className="login-button"
            type="submit"
          >
            Log In
          </button>
        </div>
      </form>

      <div className="demo-user-div">
        <button
          type="button"
          className="demo-user-button"
          onClick={() => {
            setCredential("Demo-lition");
            setPassword("password");
            setTimeout(() => {
              document.getElementById("login-form").requestSubmit();
            }, 0);
          }}
        >
          Demo User
        </button>
      </div>
    </div>
  );
}

export default LoginFormModal;