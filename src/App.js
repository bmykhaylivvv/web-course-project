import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/feed" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/:userName" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
