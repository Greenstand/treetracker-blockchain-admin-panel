import PropTypes from 'prop-types';
import TreeRow from './TreeRow';

const TreeTable = ({ trees, onSelectTree, onOpenTreeProfile, onSelectPlanter }) => {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 border-b bg-gray-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th className="px-4 py-3">Planter</th>
              <th className="px-4 py-3">Species</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Token</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {trees.slice(0, 20).map((tree) => (
              <TreeRow
                key={tree.treeId}
                tree={tree}
                onSelect={onSelectTree}
                onOpenTreeProfile={onOpenTreeProfile}
                onSelectPlanter={onSelectPlanter}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

TreeTable.propTypes = {
  trees: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectTree: PropTypes.func.isRequired,
  onOpenTreeProfile: PropTypes.func.isRequired,
  onSelectPlanter: PropTypes.func.isRequired
};

export default TreeTable;
