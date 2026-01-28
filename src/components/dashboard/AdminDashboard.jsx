import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import Header from './Header';
import StatsGrid from './StatsGrid';
import SearchFilter from './SearchFilter';
import MapContainer from '../map/MapContainer';
import TreeTable from './TreeTable';
import BlockchainQuery from './BlockchainQuery';
import TreeDetailsModal from '../modal/TreeDetailsModal';
import PlanterProfilePage from './PlanterProfilePage';
import TreeProfilePage from './TreeProfilePage';
import { useDebounce } from '../../hooks/useDebounce';
import api from '../../services/api';

const AdminDashboard = ({ currentUser, onLogout }) => {
  const [trees, setTrees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [tokenMetrics, setTokenMetrics] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTree, setSelectedTree] = useState(null);
  const [selectedPlanterKey, setSelectedPlanterKey] = useState('');
  const [selectedTreeProfileId, setSelectedTreeProfileId] = useState('');
  const [planterSearch, setPlanterSearch] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const debouncedPlanter = useDebounce(planterSearch, 200);
  const mintedCacheKey = 'adminMintedCaptureIds';
  const planterNameCacheKey = 'adminPlanterNameCache';

  const readMintedCache = () => {
    if (typeof window === 'undefined') return new Set();
    try {
      const raw = window.localStorage.getItem(mintedCacheKey);
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return new Set();
      return new Set(parsed.map(String));
    } catch {
      return new Set();
    }
  };

  const writeMintedCache = (nextSet) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(mintedCacheKey, JSON.stringify(Array.from(nextSet)));
  };

  const readPlanterNameCache = () => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem(planterNameCacheKey);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  };

  const writePlanterNameCache = (cache) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(planterNameCacheKey, JSON.stringify(cache));
  };

  const deriveStatus = (capture) => {
    if (capture.status) {
      return capture.status;
    }
    if (capture.approved === true) {
      return 'verified';
    }
    if (capture.verificationDate) {
      return 'rejected';
    }
    return 'pending';
  };

  const normalizeCapture = (capture) => {
    const lat = typeof capture.latitude === 'number' ? capture.latitude : parseFloat(capture.latitude || '0');
    const lng = typeof capture.longitude === 'number' ? capture.longitude : parseFloat(capture.longitude || '0');
    const status = deriveStatus(capture);
    const heightValue = capture.height || capture.dbh || '';
    const ageMonths = capture.treeAge ? capture.treeAge * 12 : 0;
    const mintedCache = readMintedCache();

    const planterCandidate =
      capture.plantedBy ||
      capture.planterName ||
      capture.planter ||
      capture.planted_by ||
      capture.userName ||
      capture.username;
    const planterLabel = String(planterCandidate || 'Unknown').trim() || 'Unknown';
    const planterKey = planterLabel.toLowerCase();
    const ledgerId = String(
      capture.userId || capture.planterId || capture.planter_id || ''
    ).trim();

    return {
      treeId: String(capture.id),
      ledgerId,
      blockchainHash: capture.blockchainTxId || capture.tx_id || '',
      timestamp: capture.timestamp ? new Date(capture.timestamp).toISOString() : new Date().toISOString(),
      lastModified: capture.verificationDate ? new Date(capture.verificationDate).toISOString() : new Date().toISOString(),
      lat: Number.isFinite(lat) ? lat.toFixed(6) : '0.000000',
      lng: Number.isFinite(lng) ? lng.toFixed(6) : '0.000000',
      species: capture.species || capture.commonName || 'Unknown',
      planter: planterLabel,
      planterKey,
      status,
      height: heightValue ? String(heightValue) : 'N/A',
      age: ageMonths || 0,
      verifiedBy: capture.verifiedBy || null,
      verificationDate: capture.verificationDate ? new Date(capture.verificationDate).toISOString() : null,
      mintedToken: Boolean(capture.tokenId) || mintedCache.has(String(capture.id)),
      photos: [capture.imageUrl, ...(capture.additionalImages || [])].filter(Boolean),
      notes: capture.note || '',
      healthStatus: capture.healthStatus || 'unknown',
      raw: capture
    };
  };

  const applyPlanterNames = (items, nameCache) => {
    return items.map((tree) => {
      if (!tree.ledgerId) return tree;
      const cachedName = nameCache[tree.ledgerId];
      if (!cachedName) return tree;
      if (tree.planter !== 'Unknown' && tree.planter !== tree.ledgerId) return tree;
      return {
        ...tree,
        planter: cachedName,
        planterKey: cachedName.toLowerCase()
      };
    });
  };

  const resolvePlanterNames = async (items, nameCache, isMountedRef) => {
    const missing = Array.from(
      new Set(
        items
          .map((tree) => tree.ledgerId)
          .filter((ledgerId) => ledgerId && !nameCache[ledgerId])
      )
    );

    if (!missing.length) return;

    const results = await Promise.all(
      missing.map(async (ledgerId) => {
        try {
          const response = await api.auth.getUserById(ledgerId);
          if (!response?.success || !response?.data) return null;
          const { firstName, lastName, username, id } = response.data;
          const displayName = [firstName, lastName].filter(Boolean).join(' ') || username || id;
          return { ledgerId, name: displayName };
        } catch {
          return null;
        }
      })
    );

    let updated = false;
    results.forEach((entry) => {
      if (!entry || !entry.name) return;
      nameCache[entry.ledgerId] = entry.name;
      updated = true;
    });

    if (!updated) return;
    writePlanterNameCache(nameCache);
    if (!isMountedRef.current) return;
    setTrees((prevTrees) => applyPlanterNames(prevTrees, nameCache));
  };

  const fetchAllCaptures = async () => {
    const pageSize = 200;
    let page = 1;
    let totalPages = 1;
    const all = [];

    while (page <= totalPages) {
      const response = await api.captures.getAll({ page, limit: pageSize });
      if (!response.success) {
        throw new Error(response.error || 'Failed to load captures');
      }

      const batch = response.data || [];
      all.push(...batch);

      const pagination = response.pagination || {};
      if (pagination.totalPages) {
        totalPages = pagination.totalPages;
      } else if (pagination.total) {
        totalPages = Math.ceil(pagination.total / pageSize);
      } else if (batch.length < pageSize) {
        break;
      }

      page += 1;
    }

    return all;
  };

  const fetchTokenMetrics = async () => {
    try {
      const response = await api.tokens.getDashboardMetrics();
      setTokenMetrics(response?.data || null);
    } catch {
      setTokenMetrics(null);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const isMountedRef = { current: true };

    const loadData = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const [captures, tokenMetricsResponse] = await Promise.all([
          fetchAllCaptures(),
          api.tokens.getDashboardMetrics().catch(() => null)
        ]);

        if (!isMounted) return;
        const normalized = captures.map(normalizeCapture);
        const nameCache = readPlanterNameCache();
        const withNames = applyPlanterNames(normalized, nameCache);
        setTrees(withNames);
        setTokenMetrics(tokenMetricsResponse?.data || null);
        resolvePlanterNames(withNames, nameCache, isMountedRef);
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error.message || 'Failed to load dashboard data');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      isMountedRef.current = false;
    };
  }, []);

  const stats = useMemo(
    () => ({
      totalTrees: trees.length,
      mintedTokens: trees.filter((tree) => tree.mintedToken).length,
      verified: trees.filter((tree) => tree.status === 'verified').length,
      pending: trees.filter((tree) => tree.status === 'pending').length,
      rejected: trees.filter((tree) => tree.status === 'rejected').length
    }),
    [trees]
  );

  const filteredTrees = useMemo(() => {
    return trees.filter((tree) => {
      const query = debouncedQuery.toLowerCase();
      const matchesSearch =
        tree.species.toLowerCase().includes(query) ||
        tree.planter.toLowerCase().includes(query) ||
        tree.treeId.toString().includes(query);

      const matchesFilter = filterStatus === 'all' || tree.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [trees, debouncedQuery, filterStatus]);

  const planterProfiles = useMemo(() => {
    const profilesMap = new Map();

    trees.forEach((tree) => {
      const key = tree.planterKey || String(tree.planter || 'Unknown').toLowerCase();
      if (!profilesMap.has(key)) {
        profilesMap.set(key, {
          planter: tree.planter,
          planterKey: key,
          total: 0,
          verified: 0,
          pending: 0,
          rejected: 0,
          latestActivity: tree.timestamp,
          recentTrees: [],
          trees: []
        });
      }

      const profile = profilesMap.get(key);
      profile.total += 1;
      profile[tree.status] += 1;
      if (new Date(tree.timestamp) > new Date(profile.latestActivity)) {
        profile.latestActivity = tree.timestamp;
      }
      profile.recentTrees.push({ treeId: tree.treeId, status: tree.status, timestamp: tree.timestamp });
      profile.trees.push(tree);
    });

    return Array.from(profilesMap.values())
      .map((profile) => ({
        ...profile,
        recentTrees: profile.recentTrees
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 3)
          .map(({ treeId, status }) => ({ treeId, status }))
      }))
      .map((profile) => ({
        ...profile,
        trees: profile.trees.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      }))
      .sort((a, b) => a.planter.localeCompare(b.planter));
  }, [trees]);

  const planterMatches = useMemo(() => {
    if (!debouncedPlanter.trim()) return planterProfiles;
    const query = debouncedPlanter.trim().toLowerCase();
    return planterProfiles.filter((profile) =>
      profile.planter.toLowerCase().includes(query) || profile.planterKey.includes(query)
    );
  }, [planterProfiles, debouncedPlanter]);

  const activePlanterProfile = useMemo(() => {
    if (!selectedPlanterKey) return null;
    return planterProfiles.find((profile) => profile.planterKey === selectedPlanterKey) || null;
  }, [planterProfiles, selectedPlanterKey]);

  const updateTreeStatus = async (treeId, newStatus) => {
    setActionError('');
    try {
      const approved = newStatus === 'verified';
      const response = await api.captures.approve(treeId, approved);

      if (!response.success) {
        throw new Error(response.error || 'Failed to update capture status');
      }

      setTrees((prevTrees) =>
        prevTrees.map((tree) => {
          if (tree.treeId !== treeId) return tree;
          return {
            ...tree,
            status: newStatus,
            lastModified: new Date().toISOString(),
            verificationDate: new Date().toISOString(),
            verifiedBy: currentUser?.username || tree.verifiedBy || 'system',
            mintedToken: tree.mintedToken
          };
        })
      );
      setSelectedTree(null);
    } catch (error) {
      setActionError(error.message || 'Failed to update capture status');
    }
  };

  const handleMintToken = async (tree) => {
    if (tree.mintedToken) return;
    if (tree.status !== 'verified') {
      setActionError('Verify the capture before minting a token.');
      return;
    }
    setActionError('');
    try {
      await api.tokens.issue({
        captureId: tree.treeId,
        planterId: tree.raw?.userId || tree.planter,
        treeSpecies: tree.species
      });

      setTrees((prevTrees) =>
        prevTrees.map((item) =>
          item.treeId === tree.treeId ? { ...item, mintedToken: true, lastModified: new Date().toISOString() } : item
        )
      );
      const mintedCache = readMintedCache();
      mintedCache.add(String(tree.treeId));
      writeMintedCache(mintedCache);
      fetchTokenMetrics();
    } catch (error) {
      const message = error.message || 'Failed to mint token';
      if (message.includes('Token already exists')) {
        setTrees((prevTrees) =>
          prevTrees.map((item) =>
            item.treeId === tree.treeId ? { ...item, mintedToken: true, lastModified: new Date().toISOString() } : item
          )
        );
        const mintedCache = readMintedCache();
        mintedCache.add(String(tree.treeId));
        writeMintedCache(mintedCache);
        fetchTokenMetrics();
        return;
      }
      setActionError(message);
    }
  };

  const openTreeProfile = (tree) => {
    setSelectedPlanterKey('');
    setSelectedTreeProfileId(tree.treeId);
  };

  const openPlanterProfile = (planter) => {
    setSelectedTreeProfileId('');
    const key = String(planter || '').trim().toLowerCase();
    if (key) {
      setSelectedPlanterKey(key);
    }
  };

  const handlePlanterSearchSubmit = () => {
    const query = planterSearch.trim().toLowerCase();
    if (!query) return;

    const exactMatch = planterProfiles.find(
      (profile) => profile.planter.toLowerCase() === query
    );
    const partialMatch =
      exactMatch ||
      planterProfiles.find((profile) => profile.planter.toLowerCase().includes(query));

    if (partialMatch) {
      openPlanterProfile(partialMatch.planterKey || partialMatch.planter);
    }
  };

  const activeTreeProfile = useMemo(() => {
    if (!selectedTreeProfileId) return null;
    return trees.find((tree) => tree.treeId === selectedTreeProfileId) || null;
  }, [trees, selectedTreeProfileId]);

  if (selectedPlanterKey && activePlanterProfile) {
    return (
      <PlanterProfilePage
        planterName={activePlanterProfile.planter}
        profile={activePlanterProfile}
        onBack={() => {
          setSelectedPlanterKey('');
          setSelectedTreeProfileId('');
        }}
        onOpenTreeProfile={openTreeProfile}
      />
    );
  }

  if (activeTreeProfile) {
    return (
      <TreeProfilePage
        tree={activeTreeProfile}
        onBack={() => setSelectedTreeProfileId('')}
        onMintToken={handleMintToken}
        onOpenPlanterProfile={openPlanterProfile}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
        <Header currentUser={currentUser} onLogout={onLogout} />
        <div className="mt-12 flex items-center justify-center text-sm text-gray-500">
          Loading captures...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <Header currentUser={currentUser} onLogout={onLogout} />
      {loadError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      ) : null}
      {actionError ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {actionError}
        </div>
      ) : null}
      <StatsGrid stats={stats} />
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      <section className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Planter Lookup</h3>
            <p className="text-xs text-gray-500">Search a planter by name to open their profile.</p>
          </div>
          <input
            type="text"
            value={planterSearch}
            onChange={(event) => setPlanterSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handlePlanterSearchSubmit();
              }
            }}
            placeholder="Search planter name..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 md:max-w-sm"
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Geographic Distribution</h3>
          <MapContainer trees={filteredTrees} onSelectTree={setSelectedTree} />
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Latest Trees</h3>
          <TreeTable
            trees={filteredTrees}
            onSelectTree={setSelectedTree}
            onOpenTreeProfile={openTreeProfile}
            onSelectPlanter={openPlanterProfile}
          />
        </div>
      </div>

      <BlockchainQuery trees={trees} onSelectTree={setSelectedTree} />

      <TreeDetailsModal
        tree={selectedTree}
        onClose={() => setSelectedTree(null)}
        onUpdateStatus={updateTreeStatus}
      />
    </div>
  );
};

AdminDashboard.propTypes = {
  currentUser: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string
  }),
  onLogout: PropTypes.func.isRequired
};

AdminDashboard.defaultProps = {
  currentUser: null
};

export default AdminDashboard;
