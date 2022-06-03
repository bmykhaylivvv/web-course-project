import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import Profile from "./pages/Profile";
import MyProfilePage from "./pages/MyProfilePage";
import AddPostPage from "./pages/AddPostPage"
import { Navigate } from "react-router-dom";


const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/feed" replace={true} />} />
          <Route path="/feed" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/profile" element={<MyProfilePage />} />
          <Route path="/:userId" element={<Profile />} />
          <Route path="/addpost" element={<AddPostPage />} />

        </Routes>
      </Router>
    </div>
  );
};

export default App;
