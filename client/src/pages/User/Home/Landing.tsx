import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div className="landing-container">
            <h1>Welcome to Our App</h1>
            <Link to="/login">
                <button>Go to Login</button>
            </Link>
        </div>
    );
};

export default Landing;
