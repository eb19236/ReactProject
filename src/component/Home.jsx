import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div>{/* <img src="" alt="צילום מסך" /> */}</div>
      <Link to="/ProjectsList">פרויקטים שלי</Link>
      <br />
      <Link to="/Login">Login-להרשמה ולהתחברות</Link>
    </>
  );
};

export default Home;
