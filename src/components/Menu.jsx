import { Link } from "react-router-dom";

const Menu = () => {
  /*
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  */
  const logout = async () => {
    // if used in more components, this should be in context
    // axios to /logout endpoint
    //setAuth({});
    //navigate("/linkpage");
  };

  return (
    <section>
      <h1>Home</h1>
      <br />
      <p>You are logged in!</p>
      <br />

      <Link to="/users">Go to Link Page - Only Admin</Link>

      <br />
      <div className="flexGrow">
        <button onClick={logout}>Sign Out</button>
      </div>
    </section>
  );
};

export default Menu;
