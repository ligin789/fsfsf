import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoDark from "../../assets/images/landingPage/logoDark.svg";
import "./login.css";
import { useAppSelector } from "../../store/hooks";

const Login = () => {
  const [name, setName] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="container-fluid m-0 p-0">
      <nav className="navbar p-3 pl-5">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src={LogoDark}
              className="brand-logo pl-5"
              height={28}
              alt="Brand"
            />
          </a>
        </div>
      </nav>

      <div className="d-sm-none d-lg-block">
        <div className="container-fluid mx-3 my-5 pt-4 ">
          <h2 className="mainLogin-text">
            Urban air mobility orchestration platform
          </h2>
          <h4 className="subLogin-text">
            Connect with the ecosystem. Manage operations.
            <br />
            Transform mobility
          </h4>
        </div>
      </div>

      <div className="login-box col-lg-3 col-sm-10">
        <div>
          <h3 className="login-box-text pb-3">Sign in</h3>
        </div>

        {/* Wrap inputs and button in a form so Enter works */}
        <form className="d-flex flex-column" onSubmit={handleSubmit}>
          {/* {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )} */}
          <label htmlFor="username" className="login-box-text2">
            Email
          </label>
          <input
            id="username"
            type="email"
            value={name}
            onChange={(e) => setName(e.target.value)}
            // disabled={loading}
            className="login-box-input mb-4"
            placeholder="Enter your email"
            autoComplete="email"
          />
          <label htmlFor="username" className="login-box-text2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={name}
            onChange={(e) => setName(e.target.value)}
            // disabled={loading}
            className="login-box-input mb-5"
            placeholder="Enter your password"
            autoComplete="password"
          />

          <button
            className="login-box-button border-0"
            type="submit"
            // disabled={loading || !name.trim()}
            // aria-busy={loading}
          >
            <h3 className="loginbox-button-text">Login</h3>
          </button>

          <div className="d-flex justify-content-center mt-3">
            <div className="loginBox-horizontalLine" />
            <h5 className="login-box-or-text">Or</h5>
            <div className="loginBox-horizontalLine" />
          </div>
          <div className="d-flex justify-content-center mt-3">
            <h6 className="loginbox-register-text1">New to Velos?&nbsp; </h6>
            <h6 className="loginbox-register-text2" onClick={() => {}}>
              Register
            </h6>
          </div>
        </form>
      </div>

      <div className="container-fluid login-bottom-wrapper" />
    </div>
  );
};

export default Login;
