import PropTypes from 'prop-types';
import { Leaf, XCircle } from 'lucide-react';
import LoginForm from './LoginForm';

const LoginPage = ({ onSubmit, loginError, clearError }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 px-4 py-10">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <Leaf size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">Treetracker Admin</h1>
          <p className="mt-1 text-sm text-green-100">Blockchain Verification System</p>
        </div>

        <div className="p-8">
          {loginError ? (
            <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <XCircle size={18} className="mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{loginError}</p>
                <button
                  type="button"
                  className="mt-1 text-xs text-red-600 underline"
                  onClick={clearError}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : null}

          <LoginForm onSubmit={onSubmit} />
          <p className="mt-6 text-xs text-gray-500">
            Use your admin credentials from treetracker-auth-service. If you need access, contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

LoginPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loginError: PropTypes.string,
  clearError: PropTypes.func.isRequired
};

LoginPage.defaultProps = {
  loginError: ''
};

export default LoginPage;
