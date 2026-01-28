import PropTypes from 'prop-types';
import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginForm = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ username, password, rememberMe }, () => setPassword(''));
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Input
        id="username"
        label="Username"
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        required
      />

      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600" htmlFor="rememberMe">
          <input
            id="rememberMe"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          Remember me
        </label>
        <button type="button" className="text-sm text-emerald-600 hover:text-emerald-700">
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 py-3 text-sm font-bold text-white shadow-md hover:from-emerald-700 hover:to-green-700 hover:shadow-lg"
      >
        Sign In
      </Button>
    </form>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default LoginForm;
