'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import { formatDate } from '@/lib/utils';
import { Users, CreditCard, User, Building, ChevronLeft, Eye, Trash2, X } from 'lucide-react';

/*   TYPES   */
type UserItem = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

type CardItem = {
  slug: string;
  ownerEmail: string;
  fullName?: string;
  businessName?: string;
  template?: string;
  cardType?: 'personal' | 'business';
  createdAt: string;
  phone?: string;
  email?: string;
  website?: string;
  profileImage?: string;
  logo?: string;
  role?: string;
  tagline?: string;
  company?: string;
};

/*   PAGE   */
export default function AdminDashboardPage() {
  const router = useRouter();
  const { token, admin, initialized } = useAdminAuthStore();

  const [tab, setTab] = useState<'users' | 'cards'>('users');
  const [users, setUsers] = useState<UserItem[]>([]);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [userCards, setUserCards] = useState<CardItem[]>([]);
  const [userCardsLoading, setUserCardsLoading] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCards: 0,
    personalCards: 0,
    businessCards: 0
  });

  // Confirmation modal states
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [cardToDelete, setCardToDelete] = useState<CardItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  /*   FETCH   */
  const fetchUsers = async () => {
    const res = await fetch('/api/admin/dashboard?type=users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUsers(data.users || []);
  };

  const fetchCards = async () => {
    const res = await fetch('/api/admin/dashboard?type=cards', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setCards(data.cards || []);
  };

  /*   AUTH + LOAD   */
  useEffect(() => {
    if (!initialized) return;
    if (!admin || !token) return router.replace('/admin');

    setLoading(true);
    Promise.all([fetchUsers(), fetchCards()]).finally(() =>
      setLoading(false)
    );
  }, [initialized]);

  useEffect(() => {
    setSelectedUser(null);
  }, [tab]);

  /*   STATS   */
  useEffect(() => {
    setStats({
      totalUsers: users.length,
      totalCards: cards.length,
      personalCards: cards.filter(c => c.cardType === 'personal').length,
      businessCards: cards.filter(c => c.cardType === 'business').length
    });
  }, [users, cards]);

  /*   VIEW USER   */
  const handleViewUser = async (user: UserItem) => {
    setSelectedUser(user);
    setUserCards([]);
    setUserCardsLoading(true);

    const res = await fetch(
      `/api/admin/dashboard?userEmail=${encodeURIComponent(user.email)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();
    setUserCards(data.cards || []);
    setUserCardsLoading(false);
  };

  /*   DELETE USER   */
  const confirmDeleteUser = (user: UserItem) => {
    setUserToDelete(user);
    setShowDeleteUserModal(true);
  };

  const deleteUser = async () => {
    if (!userToDelete || !token) return;

    setDeleting(true);
    try {
      await fetch(`/api/admin/dashboard?userEmail=${userToDelete.email}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      setSelectedUser(null);
      fetchUsers();
      fetchCards();
      setShowDeleteUserModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setDeleting(false);
    }
  };

  /*   DELETE CARD   */
  const confirmDeleteCard = (card: CardItem) => {
    setCardToDelete(card);
    setShowDeleteCardModal(true);
  };

  const deleteCard = async () => {
    if (!cardToDelete || !token) return;

    setDeleting(true);
    try {
      await fetch(`/api/admin/dashboard?slug=${cardToDelete.slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchCards();
      if (selectedUser) handleViewUser(selectedUser);
      setShowDeleteCardModal(false);
      setCardToDelete(null);
    } catch (error) {
      console.error('Failed to delete card:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
       <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
        {/* spinner */}
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#9f2b34]/30 border-t-[#9f2b34]" />

        <p className="text-sm font-medium text-[#9f2b34]">
          Loading Dashboard..
        </p>

      
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 pb-8">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#9f2b34]/5 to-transparent p-6 rounded-2xl border border-[#9f2b34]/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#9f2b34] uppercase tracking-wider mb-2">Admin Dashboard</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome back, Admin</h1>
              <p className="text-gray-600 mt-2">Manage users, cards, and monitor platform activity</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-[#9f2b34] text-white px-4 py-2 rounded-xl font-medium">
                {admin?.email || 'Administrator'}
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
            icon={<Users className="h-8 w-8" />}
            color="bg-blue-50 text-blue-700"
          />
          <StatCard
            label="Total Cards"
            value={stats.totalCards}
            icon={<CreditCard className="h-8 w-8" />}
            color="bg-green-50 text-green-700"
          />
          <StatCard
            label="Personal Cards"
            value={stats.personalCards}
            icon={<User className="h-8 w-8" />}
            color="bg-purple-50 text-purple-700"
          />
          <StatCard
            label="Business Cards"
            value={stats.businessCards}
            icon={<Building className="h-8 w-8" />}
            color="bg-amber-50 text-amber-700"
          />
        </div>

        {/* TABS */}
        <div className="bg-white rounded-2xl border border-gray-200 p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setTab('users')}
              className={`flex-1 px-6 py-3 rounded-xl text-sm font-medium transition-all ${tab === 'users'
                ? 'bg-[#9f2b34] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#9f2b34] hover:bg-[#9f2b34]/5'}`}
            >
              Users ({stats.totalUsers})
            </button>
            <button
              onClick={() => setTab('cards')}
              className={`flex-1 px-6 py-3 rounded-xl text-sm font-medium transition-all ${tab === 'cards'
                ? 'bg-[#9f2b34] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#9f2b34] hover:bg-[#9f2b34]/5'}`}
            >
              Cards ({stats.totalCards})
            </button>
          </div>
        </div>

        {/*   USER DETAIL VIEW   */}
        {tab === 'users' && selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-[#9f2b34] transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                Back to Users
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-[#9f2b34]/10 flex items-center justify-center">
                        <span className="text-xl md:text-2xl font-bold text-[#9f2b34]">
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">{selectedUser.name}</h2>
                        <p className="text-sm md:text-base text-gray-600 truncate">{selectedUser.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Joined:</span>
                      <span className="text-gray-700">{formatDate(selectedUser.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Cards:</span>
                      <span className="text-gray-700">{userCards.length}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => confirmDeleteUser(selectedUser)}
                    className="w-full md:w-auto px-4 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 flex-shrink-0" />
                    <span>Delete User</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Cards Created</h3>
              <span className="text-sm text-gray-500">{userCards.length} card(s)</span>
            </div>

            {userCardsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-3 border-[#9f2b34]/20 border-t-[#9f2b34] rounded-full animate-spin mx-auto mb-4"></div>
                   <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
        {/* spinner */}
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#9f2b34]/30 border-t-[#9f2b34]" />

        <p className="text-sm font-medium text-[#9f2b34]">
          Loading Cards…
        </p>

        
      </div>
                </div>
              </div>
            ) : userCards.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 md:p-12 text-center">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No cards created yet</p>
                <p className="text-gray-500 text-sm mt-1">This user hasn't created any digital cards</p>
              </div>
            ) : (
              <div className="grid gap-3 md:gap-4 md:grid-cols-2 xl:grid-cols-3">
                {userCards.map(card => (
                  <div
                    key={card.slug}
                    className="group bg-white rounded-xl border border-gray-200 p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#9f2b34]/30"
                  >
                    <div className="flex gap-3 md:gap-4">
                      <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#9f2b34]/10 to-[#9f2b34]/5 flex items-center justify-center border flex-shrink-0">
                        {card.profileImage || card.logo ? (
                          <img
                            src={card.profileImage || card.logo}
                            alt={card.fullName || card.businessName || 'Card'}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xl md:text-2xl font-bold text-[#9f2b34]">
                            {(card.fullName || card.businessName || 'Card')[0]}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate text-sm md:text-base">
                          {card.fullName || card.businessName}
                        </h3>
                        <p className="text-gray-600 mt-1 line-clamp-2 text-xs md:text-sm">
                          {[card.role || card.tagline, card.company].filter(Boolean).join(' • ') || 'No description'}
                        </p>
                        <p className="text-gray-400 mt-2 text-xs">
                          Created {formatDate(card.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {card.email && (
                        <div className="text-xs bg-gray-50 px-3 py-2 rounded-lg truncate">
                          <span className="font-medium">Email:</span> {card.email}
                        </div>
                      )}
                      {card.phone && (
                        <div className="text-xs bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="font-medium">Phone:</span> {card.phone}
                        </div>
                      )}
                      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mt-4">
                        <span className="text-xs px-3 py-1.5 bg-[#9f2b34]/10 text-[#9f2b34] rounded-full capitalize font-medium self-start xs:self-center">
                          {card.template || 'basic'} • {card.cardType || 'personal'}
                        </span>
                        <div className="flex gap-2 self-end xs:self-center">
                          <button
                            onClick={() => router.push(`/share/${card.slug}`)}
                            className="p-2 text-gray-600 hover:text-[#9f2b34] hover:bg-[#9f2b34]/5 rounded-lg transition-colors"
                            title="View Card"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => confirmDeleteCard(card)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Card"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/*   USERS TABLE (DESKTOP)   */}
        {tab === 'users' && !selectedUser && users.length > 0 && (
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
              <p className="text-gray-600 text-sm mt-1">Manage registered users and their cards</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-[#9f2b34]/10 flex items-center justify-center">
                            <span className="font-medium text-[#9f2b34]">
                              {u.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(u.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewUser(u)}
                            className="px-4 py-2 bg-[#9f2b34] text-white hover:bg-[#9f2b34]/90 rounded-lg text-sm font-medium transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => confirmDeleteUser(u)}
                            className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 text-sm text-gray-600">
              Showing {users.length} user{users.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}

        {/*   USERS MOBILE VIEW   */}
        {tab === 'users' && !selectedUser && users.length > 0 && (
          <div className="lg:hidden space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 px-2">All Users</h2>
            {users.map(u => (
              <div key={u.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-[#9f2b34]/10 flex items-center justify-center">
                      <span className="font-medium text-[#9f2b34]">
                        {u.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{u.name}</h3>
                      <p className="text-sm text-gray-600">{u.email}</p>
                      <p className="text-xs text-gray-400 mt-1">Joined {formatDate(u.createdAt)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleViewUser(u)}
                    className="flex-1 px-4 py-2 bg-[#9f2b34] text-white hover:bg-[#9f2b34]/90 rounded-lg text-sm font-medium text-center transition-colors"
                  >

                    View Details
                  </button>
                  <button
                    onClick={() => confirmDeleteUser(u)}
                    className="flex-1 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium text-center transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/*   NO USERS   */}
        {tab === 'users' && !selectedUser && users.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">There are no registered users in the system yet.</p>
          </div>
        )}

        {/*   CARDS TABLE (DESKTOP)   */}
        {tab === 'cards' && cards.length > 0 && (
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">All Cards</h2>
              <p className="text-gray-600 text-sm mt-1">Manage all digital business cards</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Card</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cards.map(card => (
                    <tr key={card.slug} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#9f2b34]/10 to-[#9f2b34]/5 flex items-center justify-center">
                            <span className="font-medium text-[#9f2b34]">
                              {(card.fullName || card.businessName || 'C')[0]}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900 block">
                              {card.fullName || card.businessName}
                            </span>
                            <span className="text-sm text-gray-500 capitalize">
                              {card.template || 'basic'} template
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{card.ownerEmail}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${card.cardType === 'business'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'}`}
                        >
                          {card.cardType || 'personal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(card.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/share/${card.slug}`)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                          >

                            View
                          </button>
                          <button
                            onClick={() => confirmDeleteCard(card)}
                            className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                          >

                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 text-sm text-gray-600">
              Showing {cards.length} card{cards.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}

        {/*   CARDS MOBILE VIEW   */}
        {tab === 'cards' && cards.length > 0 && (
          <div className="lg:hidden space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 px-2">All Cards</h2>
            {cards.map(card => (
              <div key={card.slug} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#9f2b34]/10 to-[#9f2b34]/5 flex items-center justify-center">
                    <span className="font-medium text-[#9f2b34]">
                      {(card.fullName || card.businessName || 'C')[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{card.fullName || card.businessName}</h3>
                    <p className="text-sm text-gray-600 truncate">{card.ownerEmail}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 capitalize">{card.template} template</span>
                    <span className="text-gray-300">•</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${card.cardType === 'business'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'}`}
                    >
                      {card.cardType || 'personal'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(card.createdAt)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/share/${card.slug}`)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  <button
                    onClick={() => confirmDeleteCard(card)}
                    className="flex-1 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/*   NO CARDS   */}
        {tab === 'cards' && cards.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No cards found</h3>
            <p className="text-gray-600">There are no digital cards created yet.</p>
          </div>
        )}
      </div>

      {/* Delete User Confirmation Modal */}
      {showDeleteUserModal && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
              <button
                onClick={() => {
                  setShowDeleteUserModal(false);
                  setUserToDelete(null);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                disabled={deleting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{userToDelete.name}</p>
                  <p className="text-sm text-gray-600">{userToDelete.email}</p>
                </div>
              </div>

              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this user? This action will permanently delete:
              </p>

              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                  User account: <span className="font-medium">{userToDelete.name}</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                  All associated cards ({userCards.filter(c => c.ownerEmail === userToDelete.email).length})
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                  User data and preferences
                </li>
              </ul>

              <p className="text-sm text-red-600 font-medium">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteUserModal(false);
                  setUserToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={deleteUser}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={deleting}
              >
                {deleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Deleting...
                  </span>
                ) : (
                  'Delete User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Card Confirmation Modal */}
      {showDeleteCardModal && cardToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Card</h3>
              <button
                onClick={() => {
                  setShowDeleteCardModal(false);
                  setCardToDelete(null);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                disabled={deleting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#9f2b34]/10 to-[#9f2b34]/5 flex items-center justify-center">
                  <span className="text-xl font-bold text-[#9f2b34]">
                    {(cardToDelete.fullName || cardToDelete.businessName || 'C')[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {cardToDelete.fullName || cardToDelete.businessName}
                  </p>
                  <p className="text-sm text-gray-600">Owner: {cardToDelete.ownerEmail}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Template:</span>
                  <span className="font-medium capitalize">{cardToDelete.template || 'basic'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${cardToDelete.cardType === 'business'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'}`}
                  >
                    {cardToDelete.cardType || 'personal'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{formatDate(cardToDelete.createdAt)}</span>
                </div>
              </div>

              <p className="text-sm text-red-600 font-medium mb-4">
                This action cannot be undone. The card will be permanently deleted.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteCardModal(false);
                  setCardToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={deleteCard}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={deleting}
              >
                {deleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Deleting...
                  </span>
                ) : (
                  'Delete Card'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/*   STAT CARD   */
function StatCard({ label, value, icon, color }: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color.split(' ')[0]}`}>
          <div className={`${color.split(' ')[1]}`}>
            {icon}
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${color.split(' ')[0]} ${color.split(' ')[1] === 'text-[#9f2b34]' ? 'bg-[#9f2b34]' : ''}`}
            style={{
              width: `${Math.min(value * 10, 100)}%`,
              backgroundColor: color.includes('text-blue') ? '#3b82f6' :
                color.includes('text-green') ? '#10b981' :
                  color.includes('text-purple') ? '#8b5cf6' :
                    color.includes('text-amber') ? '#f59e0b' : '#9f2b34'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}