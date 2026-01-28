import PropTypes from 'prop-types';
import { AlertCircle, CheckCircle, Leaf, Coins, XCircle } from 'lucide-react';
import StatCard from './StatCard';

const StatsGrid = ({ stats }) => {
  const cards = [
    {
      title: 'Total Trees',
      value: stats.totalTrees,
      icon: Leaf,
      color: '#16a34a'
    },
    {
      title: 'Minted Tokens',
      value: stats.mintedTokens,
      icon: Coins,
      color: '#10b981'
    },
    {
      title: 'Verified Trees',
      value: stats.verified,
      icon: CheckCircle,
      color: '#059669'
    },
    {
      title: 'Pending Verification',
      value: stats.pending,
      icon: AlertCircle,
      color: '#f59e0b'
    },
    {
      title: 'Rejected Trees',
      value: stats.rejected,
      icon: XCircle,
      color: '#dc2626'
    }
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
};

StatsGrid.propTypes = {
  stats: PropTypes.shape({
    totalTrees: PropTypes.number.isRequired,
    mintedTokens: PropTypes.number.isRequired,
    verified: PropTypes.number.isRequired,
    pending: PropTypes.number.isRequired,
    rejected: PropTypes.number.isRequired
  }).isRequired
};

export default StatsGrid;
