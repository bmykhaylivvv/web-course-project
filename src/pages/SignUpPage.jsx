import React from 'react'
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {
  const navigate = useNavigate();
  return (
    <div>
      <input type="text" />
      <input type="text" />
      <button>Sign Up</button>
      <button onClick={() => navigate('/signin')}>I have account!)</button>
    </div>
  )
}

export default SignUp