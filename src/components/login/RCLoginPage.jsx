import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import users from '../../data/user';

export default function RCLoginPage(props) {
  const { setIsLoggedIn, setLoggedInUser } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    const foundUser = users.find(function(user) {
      return user.email === email && user.password === password;
    });

    if (foundUser) {
      setLoggedInUser(foundUser);
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid Email or Password');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <img
            src="https://royalchaingroup.com/wp-content/uploads/2026/02/Royal-Chain-Limited-3-2048x1413.webp"
            alt="Royal Chain"
            className="h-14 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold">Login</h2>
          <p className="text-gray-500 mt-2">Enter Your Email Below To Login To Your Account.</p>
        </div>

        <div className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={function(e) { setEmail(e.target.value); }}
              className="w-full border rounded-2xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              value={password}
              onChange={function(e) { setPassword(e.target.value); }}
              className="w-full border rounded-2xl pl-10 pr-10 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={function() { setShowPassword(!showPassword); }}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-2xl text-lg font-semibold shadow-lg"
          >
            Sign In
          </button>
        </div>
      </motion.div>
    </div>
  );
}
