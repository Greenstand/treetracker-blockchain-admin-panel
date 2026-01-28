import PropTypes from 'prop-types';
import { Leaf, LogOut } from 'lucide-react';
import Button from '../common/Button';

const Header = ({ currentUser, onLogout }) => {
  const initial = currentUser?.name ? currentUser.name.charAt(0) : 'U';

  return (
    <header className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5 text-white shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white/20 p-2">
            <Leaf size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Treetracker Admin Dashboard</h2>
            <p className="text-xs text-green-100">Blockchain-enabled tree verification</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-sm font-bold">
              {initial}
            </div>
            <div className="hidden flex-col text-xs md:flex">
              <span className="font-semibold">{currentUser?.name}</span>
              <span className="text-green-100">{currentUser?.role}</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 rounded-lg bg-red-500/90 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string
  }).isRequired,
  onLogout: PropTypes.func.isRequired
};

export default Header;
