import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    UserGroupIcon,
    DocumentTextIcon,
    ChatIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    TagIcon,
    CollectionIcon,
    TrashIcon,
    CalendarIcon,
    UserAddIcon,
    UserRemoveIcon,
    UserIcon,
    CheckCircleIcon,
    XCircleIcon,
    PencilAltIcon,
    PlusCircleIcon,
    StarIcon
} from '@heroicons/react/outline';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Avatar from '~/components/partial/Avatar/avatar.component';
import Loading_spinner from '~/components/partial/Loading_spinner/loading_spinner.component';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Configure axios with base URL and credentials
const api = axios.create({
    baseURL: 'http://localhost:3030/api/user',
    withCredentials: true
});

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        users: {
            total: 0,
            newToday: 0,
            premium: 0
        },
        posts: {
            total: 0,
            published: 0,
            drafts: 0,
            newToday: 0
        },
        comments: {
            total: 0,
            newToday: 0
        },
        topics: {
            total: 0
        },
        tags: {
            total: 0
        }
    });

    const [recentPosts, setRecentPosts] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                const { data: statsData } = await api.get('/admin/dashboard/stats');
                setStats(statsData);

                const { data: postsData } = await api.get('/admin/posts', {
                    params: {
                        page: 1,
                        limit: 4,
                        sortBy: 'createdAt',
                        sortOrder: -1
                    }
                });
                setRecentPosts(postsData.posts.map(post => ({
                    _id: post._id,
                    title: post.tittle, // Assuming the typo is intentional in the API
                    author: post.author.authorId.username,
                    date: new Date(post.createdAt).toLocaleDateString('en-US'),
                    status: post.status ? 'published' : 'draft'
                })));

                const { data: usersData } = await api.get('/admin/users', {
                    params: {
                        page: 1,
                        limit: 4,
                        sortBy: 'createdAt',
                        sortOrder: -1
                    }
                });
                setRecentUsers(usersData.users.map(user => ({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    joinDate: new Date(user.createdAt).toLocaleDateString('en-US'),
                    isMember: user.isMember
                })));

                setLoading(false);
            } catch ( err ) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data');
                setLoading(false);
            }
        };

        if ( activeTab === 'dashboard' ) {
            fetchDashboardData();
        }
    }, [activeTab]);

    const renderContent = () => {
        switch ( activeTab ) {
            case 'dashboard':
                return renderDashboard();
            case 'users':
                return <UserManagement />;
            case 'posts':
                return <PostManagement />;
            case 'comments':
                return <CommentManagement />;
            case 'topics':
                return <TopicManagement />;
            case 'tags':
                return <TagManagement />;
            case 'analytics':
                return <Analytics />;
            default:
                return renderDashboard();
        }
    };

    const renderDashboard = () => {
        if ( loading ) {
            return <div className="flex justify-center py-8"><p>Loading data...</p></div>;
        }

        if ( error ) {
            return <div className="bg-red-50 p-4 rounded-lg text-red-600 text-sm">{ error }</div>;
        }

        return (
            <div className="space-y-6 font-customs">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard
                        title="Users"
                        count={ stats.users.total }
                        subtitle={ `${ stats.users.newToday } new today` }
                        icon={ <UserGroupIcon className="h-5 w-5 text-blue-500" /> }
                    />
                    <StatCard
                        title="Posts"
                        count={ stats.posts.total }
                        subtitle={ `${ stats.posts.published } published, ${ stats.posts.drafts } drafts` }
                        icon={ <DocumentTextIcon className="h-5 w-5 text-green-500" /> }
                    />
                    <StatCard
                        title="Comments"
                        count={ stats.comments.total }
                        subtitle={ `${ stats.comments.newToday } new today` }
                        icon={ <ChatIcon className="h-5 w-5 text-yellow-500" /> }
                    />
                    <StatCard
                        title="Premium Members"
                        count={ stats.users.premium }
                        subtitle={ `${ ((stats.users.premium / stats.users.total) * 100).toFixed(1) }% of users` }
                        icon={ <CurrencyDollarIcon className="h-5 w-5 text-indigo-500" /> }
                    />
                    <StatCard
                        title="Topics"
                        count={ stats.topics?.total || 0 }
                        subtitle="Total topics"
                        icon={ <CollectionIcon className="h-5 w-5 text-purple-500" /> }
                    />
                    <StatCard
                        title="Tags"
                        count={ stats.tags?.total || 0 }
                        subtitle="Total tags"
                        icon={ <TagIcon className="h-5 w-5 text-pink-500" /> }
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Recent Posts</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Title</th>
                                    <th className="text-left py-2">Author</th>
                                    <th className="text-left py-2">Date</th>
                                    <th className="text-left py-2">Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                { recentPosts.map(post => (
                                    <tr key={ post._id } className="border-b text-sm">
                                        <td className="py-2">{ post.title }</td>
                                        <td className="py-2">{ post.author }</td>
                                        <td className="py-2">{ post.date }</td>
                                        <td className="py-2">
                                            <StatusBadge status={ post.status } />
                                        </td>
                                    </tr>
                                )) }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">New Users</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Username</th>
                                    <th className="text-left py-2">Email</th>
                                    <th className="text-left py-2">Join Date</th>
                                    <th className="text-left py-2">Membership</th>
                                </tr>
                                </thead>
                                <tbody>
                                { recentUsers.map(user => (
                                    <tr key={ user._id } className="border-b text-sm">
                                        <td className="py-2">{ user.username }</td>
                                        <td className="py-2">{ user.email }</td>
                                        <td className="py-2">{ user.joinDate }</td>
                                        <td className="py-2">
                                            { user.isMember ? (
                                                <span
                                                    className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Member</span>
                                            ) : (
                                                <span
                                                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Free</span>
                                            ) }
                                        </td>
                                    </tr>
                                )) }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleSignout = async () => {
        if ( isLoading ) return <Loading_spinner />;

        setIsLoading(true);
        try {
            await axios.get('http://localhost:3030/api/auth/logout', { withCredentials: true });
        } catch ( error ) {
            console.error('Lỗi khi đăng xuất:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-64 bg-white shadow-md">
                <div className="">
                    <a href="/admin" className="flex space-x-2 p-4 h-14">
                        <svg viewBox="0 0 1043.63 592.71" className="max-w-[89px] min-w-[50px] h-full">
                            <g data-name="Layer 2">
                                <g data-name="Layer 1">
                                    <path
                                        d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 279-147.17 279s-147.17-124.94-147.17-279 65.88-279 147.16-279 147.17 124.9 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94s-51.75-111.91-51.75-249.94 23.17-249.94 51.75-249.94 51.76 111.9 51.76 249.94"></path>
                                </g>
                            </g>
                        </svg>
                        <h1 className="text-base font-bold">Admin Dashboard</h1>
                    </a>
                </div>

                <nav className="mt-6 space-y-6">
                    <div>
                        <SidebarItem
                            icon={ <ChartBarIcon className="h-5 w-5" /> }
                            title="Dashboard"
                            isActive={ activeTab === 'dashboard' }
                            onClick={ () => setActiveTab('dashboard') }
                        />
                        <SidebarItem
                            icon={ <UserGroupIcon className="h-5 w-5" /> }
                            title="User Management"
                            isActive={ activeTab === 'users' }
                            onClick={ () => setActiveTab('users') }
                        />
                        <SidebarItem
                            icon={ <DocumentTextIcon className="h-5 w-5" /> }
                            title="Post Management"
                            isActive={ activeTab === 'posts' }
                            onClick={ () => setActiveTab('posts') }
                        />
                        <SidebarItem
                            icon={ <ChatIcon className="h-5 w-5" /> }
                            title="Comment Management"
                            isActive={ activeTab === 'comments' }
                            onClick={ () => setActiveTab('comments') }
                        />
                        <SidebarItem
                            icon={ <CollectionIcon className="h-5 w-5" /> }
                            title="Topic Management"
                            isActive={ activeTab === 'topics' }
                            onClick={ () => setActiveTab('topics') }
                        />
                        <SidebarItem
                            icon={ <TagIcon className="h-5 w-5" /> }
                            title="Tag Management"
                            isActive={ activeTab === 'tags' }
                            onClick={ () => setActiveTab('tags') }
                        />
                        <SidebarItem
                            icon={ <ChartBarIcon className="h-5 w-5" /> }
                            title="Analytics"
                            isActive={ activeTab === 'analytics' }
                            onClick={ () => setActiveTab('analytics') }
                        />
                    </div>
                    <div>
                        <form onSubmit={ handleSignout }>
                            <button
                                className="text-center w-full py-3 px-4 text-sm font-customs font-semibold text-gray-600 hover:bg-gray-50"
                                type="submit">
                                Sign out
                            </button>
                        </form>
                    </div>
                </nav>
            </div>

            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm">
                    <div className="flex justify-between items-center p-4">
                        <h1 className="text-xl font-semibold font-customs">{ getPageTitle(activeTab) }</h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <Avatar username={ 'Admin' } width={ 32 } height={ 32 } />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-6">
                    { renderContent() }
                </main>
            </div>
        </div>
    );
}

// Helper Components
function SidebarItem({ icon, title, isActive = false, onClick }) {
    return (
        <div
            className={ `flex items-center py-3 px-4 cursor-pointer ${ isActive ? 'bg-gray-50 text-gray-600 border-r-4 border-gray-600 font-semibold' : 'text-gray-600 hover:bg-gray-50' }` }
            onClick={ onClick }
        >
            <span className="mr-3">{ icon }</span>
            <span className="font-customs text-sm">{ title }</span>
        </div>
    );
}

function StatCard({ title, count, subtitle, icon }) {
    return (
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="p-3 rounded-full bg-gray-50">{ icon }</div>
            <div className="ml-4">
                <h3 className="text-gray-500 text-sm font-medium">{ title }</h3>
                <p className="text-2xl font-semibold">{ count.toLocaleString() }</p>
                { subtitle && <p className="text-xs text-gray-500">{ subtitle }</p> }
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    let bgColor = 'bg-gray-100 text-gray-800';

    if ( status === 'published' ) bgColor = 'bg-green-100 text-green-800';
    if ( status === 'draft' ) bgColor = 'bg-yellow-100 text-yellow-800';
    if ( status === 'flagged' ) bgColor = 'bg-red-100 text-red-800';
    if ( status === 'archived' ) bgColor = 'bg-purple-100 text-purple-800';

    return (
        <span className={ `${ bgColor } px-2 py-1 rounded text-xs` }>
            { status.charAt(0).toUpperCase() + status.slice(1) }
        </span>
    );
}

function getPageTitle(tab) {
    switch ( tab ) {
        case 'dashboard':
            return 'Dashboard';
        case 'users':
            return 'User management';
        case 'posts':
            return 'Post management';
        case 'comments':
            return 'Comment management';
        case 'topics':
            return 'Topic management';
        case 'tags':
            return 'Tag management';
        case 'analytics':
            return 'Analytics';
        default:
            return 'Dashboard';
    }
}

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 20,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null,
        firstPage: 1,
        lastPage: 1,
        links: {
            first: '',
            last: '',
            prev: null,
            next: null
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState(-1);
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showBanModal, setShowBanModal] = useState(false);
    const [banReason, setBanReason] = useState('');
    const [userToBan, setUserToBan] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/admin/users', {
                    params: {
                        page: pagination.currentPage,
                        limit: pagination.itemsPerPage,
                        sortBy,
                        sortOrder,
                        search
                    }
                });

                setUsers(data.users);
                setPagination(data.pagination);
                setLoading(false);
            } catch ( err ) {
                console.error('Error fetching users:', err);
                setError('Failed to load users');
                setLoading(false);
                toast.error('Failed to load users', {
                    description: 'There was an error fetching the user data.'
                });
            }
        };

        fetchUsers();
    }, [pagination.currentPage, pagination.itemsPerPage, sortBy, sortOrder, search]);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const handleNavigateToPage = (url) => {
        if ( !url ) return;

        const urlObj = new URL(url);
        const pageParam = urlObj.searchParams.get('page');
        if ( pageParam ) {
            handlePageChange(parseInt(pageParam));
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        if ( search.trim() ) {
            toast.info(`Searching for "${ search }"`);
        }
    };

    const handleSort = (column) => {
        if ( sortBy === column ) {
            setSortOrder(prev => prev * -1);
        } else {
            setSortBy(column);
            setSortOrder(-1);
        }
    };

    const handleBanUser = (user) => {
        setUserToBan(user);
        setShowBanModal(true);
    };

    const confirmBanUser = async () => {
        if ( !banReason.trim() ) {
            toast.error('Please provide a ban reason');
            return;
        }

        try {
            toast.loading('Banning user...');

            await api.put(`/admin/users/${ userToBan._id }/status`, {
                action: 'ban',
                banReason: banReason
            });

            const { data } = await api.get('/admin/users', {
                params: {
                    page: pagination.currentPage,
                    limit: pagination.itemsPerPage,
                    sortBy,
                    sortOrder,
                    search
                }
            });

            setUsers(data.users);
            setPagination(data.pagination);
            setShowBanModal(false);
            setBanReason('');
            setUserToBan(null);

            toast.dismiss();
            toast.success('User banned successfully');

            // If we banned from the modal, update the modal state
            if ( selectedUser && selectedUser._id === userToBan._id ) {
                setSelectedUser({ ...selectedUser, isBanned: true });
            }
        } catch ( err ) {
            console.error('Error banning user:', err);
            toast.error('Failed to ban user', {
                description: err.response?.data?.message || 'An error occurred while banning the user.'
            });
        }
    };

    const handleUnbanUser = async (userId) => {
        try {
            toast.loading('Unbanning user...');
            await api.put(`/admin/users/${ userId }/status`, { action: 'unban', banReason: '' });
            const { data } = await api.get('/admin/users', {
                params: {
                    page: pagination.currentPage,
                    limit: pagination.itemsPerPage,
                    sortBy,
                    sortOrder,
                    search
                }
            });
            setUsers(data.users);
            setPagination(data.pagination);
            toast.dismiss();
            toast.success('User unbanned successfully');
            if ( selectedUser && selectedUser._id === userId ) {
                setSelectedUser({ ...selectedUser, isBanned: false });
            }
        } catch ( err ) {
            console.error('Error unbanning user:', err);
            toast.error('Failed to unban user', {
                description: err.response?.data?.message || 'An error occurred while unbanning the user.'
            });
        }
    };

    const handleMakeMember = async (userId) => {
        try {
            toast.loading('Adding member status...');
            await api.put(`/admin/users/${ userId }/status`, { action: 'makeMember' });
            const { data } = await api.get('/admin/users', {
                params: {
                    page: pagination.currentPage,
                    limit: pagination.itemsPerPage,
                    sortBy,
                    sortOrder,
                    search
                }
            });
            setUsers(data.users);
            setPagination(data.pagination);
            toast.dismiss();
            toast.success('User is now a member');
            if ( selectedUser && selectedUser._id === userId ) {
                setSelectedUser({ ...selectedUser, isMember: true });
            }
        } catch ( err ) {
            console.error('Error making user a member:', err);
            toast.error('Failed to make user a member', {
                description: err.response?.data?.message || 'An error occurred while making the user a member.'
            });
        }
    };

    const handleRemoveMember = async (userId) => {
        try {
            toast.loading('Removing member status...');
            await api.put(`/admin/users/${ userId }/status`, { action: 'removeMember' });
            const { data } = await api.get('/admin/users', {
                params: {
                    page: pagination.currentPage,
                    limit: pagination.itemsPerPage,
                    sortBy,
                    sortOrder,
                    search
                }
            });
            setUsers(data.users);
            setPagination(data.pagination);
            toast.dismiss();
            toast.success('Member status removed');
            if ( selectedUser && selectedUser._id === userId ) {
                setSelectedUser({ ...selectedUser, isMember: false });
            }
        } catch ( err ) {
            console.error('Error removing member status:', err);
            toast.error('Failed to remove member status', {
                description: err.response?.data?.message || 'An error occurred while removing the member status.'
            });
        }
    };

    const handleUserDetails = async (userId) => {
        toast.loading('Loading user details...');

        try {
            const { data } = await api.get(`/admin/users/${ userId }`);
            setSelectedUser(data.user);
            setShowUserModal(true);
            toast.dismiss();
        } catch ( err ) {
            console.error('Error fetching user details:', err);
            setError('Failed to load user details');
            toast.error('Failed to load user details', {
                description: 'There was an error retrieving the user information.'
            });
        }
    };

    const closeUserModal = () => {
        setShowUserModal(false);
        setSelectedUser(null);
    };

    const closeBanModal = () => {
        setShowBanModal(false);
        setBanReason('');
        setUserToBan(null);
    };

    if ( loading && users.length === 0 ) {
        return <div className="flex justify-center py-8"><p>Loading data...</p></div>;
    }

    return (
        <div className="">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold font-customs">User Management</h2>
                    <div className="text-sm text-gray-500">
                        Showing { users.length } / { pagination.total } users
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex space-x-2">
                        <select
                            className="w-full border focus:border-current rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50 px-3 py-2"
                            onChange={ (e) => {
                                const val = e.target.value;
                                setSortBy(val.split('|')[0]);
                                setSortOrder(parseInt(val.split('|')[1]));
                                toast.info(`Sorting by <span class="math-inline">\{val\.split\('\|'\)\[0\] \=\=\= 'createdAt' ? 'date' \: 'name'\} \(</span>{parseInt(val.split('|')[1]) === 1 ? 'ascending' : 'descending'})`);
                            } }
                            value={ `<span class="math-inline">\{sortBy\}\|</span>{sortOrder}` }
                        >
                            <option value="createdAt|-1">Newest</option>
                            <option value="createdAt|1">Oldest</option>
                            <option value="username|1">Name (A-Z)</option>
                            <option value="username|-1">Name (Z-A)</option>
                        </select>
                    </div>
                    <form onSubmit={ handleSearch } className="flex">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full border focus:border-current rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50 px-3 py-2"
                            value={ search }
                            onChange={ (e) => setSearch(e.target.value) }
                        />
                    </form>
                </div>

                { error &&
                    <div className="text-red-600 mb-4 text-sm text-center">{ error }</div> }

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="text-left p-3">Username</th>
                            <th className="text-left p-3">Email</th>
                            <th className="text-left p-3">Join Date</th>
                            <th className="text-left p-3">Status</th>
                            <th className="text-left p-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        { users.map(user => (
                            <tr key={ user._id } className="border-b">
                                <td className="p-3 text-sm font-customs">{ user.username }</td>
                                <td className="p-3 text-sm font-customs">{ user.email }</td>
                                <td className="p-3 text-sm font-customs">{ new Date(user.createdAt).toLocaleDateString('en-US') }</td>
                                <td className="p-3">
                                    <div className="flex space-x-1">
                                        { user.isMember && (
                                            <span
                                                className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-customs">
                                                    Member
                                                </span>
                                        ) }
                                        { user.isAdmin && (
                                            <span
                                                className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-customs">
                                                    Admin
                                                </span>
                                        ) }
                                        { user.isBanned && (
                                            <span
                                                className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-customs">
                                                    Banned
                                                </span>
                                        ) }
                                        { !user.isMember && !user.isAdmin && !user.isBanned && (
                                            <span
                                                className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-customs">
                                                    Regular
                                                </span>
                                        ) }
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="flex space-x-2">
                                        <button
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={ () => handleUserDetails(user._id) }
                                        >
                                            <UserIcon className="w-5 h-5" />
                                        </button>
                                        { !user.isAdmin ? <>
                                            { user.isBanned ? (
                                                <button
                                                    className="text-green-600 hover:text-green-800"
                                                    onClick={ () => handleUnbanUser(user._id) }
                                                >
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button className="text-red-600 hover:text-red-800"
                                                        onClick={ () => handleBanUser(user) }
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                         fill="currentColor" className="size-5">
                                                        <path fillRule="evenodd"
                                                              d="m5.965 4.904 9.131 9.131a6.5 6.5 0 0 0-9.131-9.131Zm8.07 10.192L4.904 5.965a6.5 6.5 0 0 0 9.131 9.131ZM4.343 4.343a8 8 0 1 1 11.314 11.314A8 8 0 0 1 4.343 4.343Z"
                                                              clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            ) }
                                            { user.isMember ? (
                                                <button
                                                    className="text-orange-600 hover:text-orange-800"
                                                    onClick={ () => handleRemoveMember(user._id) }
                                                >
                                                    <UserRemoveIcon className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    className="text-green-600 hover:text-green-800"
                                                    onClick={ () => handleMakeMember(user._id) }
                                                >
                                                    <UserAddIcon className="w-5 h-5" />
                                                </button>
                                            ) }
                                        </> : <></>
                                        }
                                    </div>
                                </td>
                            </tr>
                        )) }
                        </tbody>
                    </table>
                </div>

                {/* Traditional Pagination */ }
                <div className="flex justify-center items-center mt-6">
                    <div className="flex items-center space-x-2">
                        {/* First page button */ }
                        <button
                            onClick={ () => handleNavigateToPage(pagination.links.first) }
                            disabled={ !pagination.hasPrevPage }
                            className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            «
                        </button>

                        {/* Previous page button */ }
                        <button
                            onClick={ () => handleNavigateToPage(pagination.links.prev) }
                            disabled={ !pagination.hasPrevPage }
                            className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ‹
                        </button>

                        {/* Page number buttons with ellipses */ }
                        { Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                            .filter(page => {
                                const currentPage = pagination.currentPage;
                                return page === 1 ||
                                    page === pagination.totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1);
                            })
                            .map((page, index, array) => {
                                if ( index > 0 && page - array[index - 1] > 1 ) {
                                    return (
                                        <React.Fragment key={ `ellipsis-${ page }` }>
                                            <span className="px-3 py-1">...</span>
                                            <button
                                                key={ page }
                                                onClick={ () => handlePageChange(page) }
                                                className={ `px-3 py-1 rounded border ${ pagination.currentPage === page
                                                    ? 'bg-gray-800 text-white'
                                                    : 'hover:bg-gray-100'
                                                }` }
                                            >
                                                { page }
                                            </button>
                                        </React.Fragment>
                                    );
                                }
                                return (
                                    <button
                                        key={ page }
                                        onClick={ () => handlePageChange(page) }
                                        className={ `px-3 py-1 rounded border ${ pagination.currentPage === page
                                            ? 'bg-gray-800 text-white'
                                            : 'hover:bg-gray-100'
                                        }` }
                                    >
                                        { page }
                                    </button>
                                );
                            }) }

                        {/* Next page button */ }
                        <button
                            onClick={ () => handleNavigateToPage(pagination.links.next) }
                            disabled={ !pagination.hasNextPage }
                            className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ›
                        </button>

                        {/* Last page button */ }
                        <button
                            onClick={ () => handleNavigateToPage(pagination.links.last) }
                            disabled={ !pagination.hasNextPage }
                            className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            »
                        </button>
                    </div>
                </div>

                {/* Pagination info - additional page indicator */ }
                { pagination.total > 0 && (
                    <div className="mt-2 text-center text-sm text-gray-500">
                        Page { pagination.currentPage } / { pagination.totalPages } | Total
                        users: { pagination.total }
                    </div>
                ) }
            </div>

            {/* User Details Modal */ }
            { showUserModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-sm shadow-lg p-6 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold font-customs">User Details</h3>
                            <button onClick={ closeUserModal } className="text-gray-500 hover:text-gray-700">
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="font-customs">
                                <p className="text-sm text-gray-500">Username</p>
                                <p className="font-medium">{ selectedUser.username }</p>
                            </div>
                            <div className="font-customs">
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{ selectedUser.email }</p>
                            </div>
                            <div className="font-customs">
                                <p className="text-sm text-gray-500">Subdomain</p>
                                <p className="font-medium">{ selectedUser.subdomain || 'None' }</p>
                            </div>
                            <div className="font-customs">
                                <p className="text-sm text-gray-500">Join Date</p>
                                <p className="font-medium">{ new Date(selectedUser.createdAt).toLocaleDateString('en-US') }</p>
                            </div>
                            <div className="font-customs">
                                <p className="text-sm text-gray-500">Member Status</p>
                                <div className="mt-1">
                                    { selectedUser.isMember ? (
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                            Member
                                        </span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                            Not a Member
                                        </span>
                                    ) }
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Account Status</p>
                                <div className="mt-1">
                                    { selectedUser.isBanned ? (
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                            Banned
                                        </span>
                                    ) : (
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                            Active
                                        </span>
                                    ) }
                                </div>
                            </div>
                            {
                                selectedUser.banReason && <>
                                    <div>
                                        <p className="text-sm text-gray-500">Ban Reason</p>
                                        <p className="font-medium">{ selectedUser.banReason }</p>
                                    </div>
                                </>
                            }
                            <div>
                                <p className="text-sm text-gray-500">Followers</p>
                                <p className="font-medium">{ selectedUser.followers?.length || 0 }</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Following</p>
                                <p className="font-medium">{ selectedUser.following?.length || 0 }</p>
                            </div>
                            { selectedUser.subscriptionStatus && (
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500">Subscription Status</p>
                                    <p className="font-medium">{ selectedUser.subscriptionStatus }</p>
                                </div>
                            ) }
                        </div>


                        { !selectedUser.isAdmin ? <div className="flex justify-end border-t pt-4">
                            <div className="space-x-2">
                                { selectedUser.isBanned ? (
                                    <button
                                        className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 text-sm"
                                        onClick={ () => handleUnbanUser(selectedUser._id) }
                                    >
                                        Unban Account
                                    </button>
                                ) : (
                                    <button
                                        className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 text-sm"
                                        onClick={ () => handleBanUser(selectedUser) }
                                    >
                                        Ban Account
                                    </button>
                                ) }
                                { selectedUser.isMember ? (
                                    <button
                                        className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 text-sm"
                                        onClick={ () => handleRemoveMember(selectedUser._id) }
                                    >
                                        Remove Member
                                    </button>
                                ) : (
                                    <button
                                        className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 text-sm"
                                        onClick={ () => handleMakeMember(selectedUser._id) }
                                    >
                                        Make Member
                                    </button>
                                ) }
                            </div>
                        </div> : '' }
                    </div>
                </div>
            ) }

            {/* Ban Confirmation Modal */ }
            { showBanModal && userToBan && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-customs">
                    <div className="bg-white rounded-sm shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Confirm Ban</h3>
                        <p className="mb-4 text-sm">Are you sure you want to ban user: <span
                            className="font-medium text-sm">{ userToBan.username }</span>?</p>
                        <div className="mb-4">
                            <label htmlFor="banReason" className="block text-gray-700 text-sm font-bold mb-2">
                                Reason for Ban (Optional):
                            </label>
                            <textarea
                                id="banReason"
                                className="shadow appearance-none w-full py-2 px-3 text-gray-700 leading-tight border focus:border-current rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50"
                                rows="3"
                                placeholder="Enter ban reason..."
                                value={ banReason }
                                onChange={ (e) => setBanReason(e.target.value) }
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 text-sm"
                                onClick={ closeBanModal }
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 text-sm"
                                onClick={ confirmBanUser }
                            >
                                Confirm Ban
                            </button>
                        </div>
                    </div>
                </div>
            ) }
        </div>
    );
}

function PostManagement() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        author: ''
    });
    const [showPostModal, setShowPostModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        limit: 20,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null
    });

    const fetchPosts = async (page = 1) => {
        try {
            setLoading(true);

            const { data } = await api.get('/admin/posts', {
                params: {
                    ...filters,
                    page,
                    limit: pagination.limit
                }
            });

            setPosts(data.posts);
            setPagination(data.pagination || {
                currentPage: 1,
                totalPages: 0,
                totalItems: 0,
                limit: 20,
                hasNextPage: false,
                hasPrevPage: false,
                nextPage: null,
                prevPage: null
            });
            setLoading(false);
        } catch ( err ) {
            console.error('Error fetching posts:', err);
            setError('Failed to load posts');
            setLoading(false);
            toast.error('Failed to load posts', {
                description: 'There was an error retrieving the posts. Please try again later.'
            });
        }
    };

    useEffect(() => {
        // Reset to page 1 when filters change
        fetchPosts(1);
    }, [filters]);

    const handlePageChange = (newPage) => {
        fetchPosts(newPage);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handlePostAction = async (postId, action) => {
        try {
            // For delete action, we'll handle it separately with confirmation
            if ( action === 'delete' ) {
                return handleDeletePost(postId);
            }

            // Show loading toast
            const loadingToastId = toast.loading(`Processing ${ action } action...`);

            await api.put(`/admin/posts/${ postId }/status`, { action });

            // Dismiss loading toast and show success toast
            toast.dismiss(loadingToastId);

            // Success messages based on action
            const successMessages = {
                'reject': 'Post has been unpublished',
                'feature': 'Post marked as featured',
                'unfeature': 'Post removed from featured',
                'publish': 'Post has been published'
            };

            toast.success(successMessages[action] || `Post ${ action } successful`);

            // Refresh post list
            fetchPosts(pagination.currentPage);
        } catch ( err ) {
            console.error(`Error performing ${ action } on post:`, err);
            setError(`Failed to ${ action } post`);
            toast.error(`Failed to ${ action } post`, {
                description: 'Please try again or contact support if the issue persists.'
            });
        }
    };

    const handleDeletePost = (postId) => {
        const postTitle = posts.find(p => p._id === postId)?.tittle || 'this post';

        toast.warning(`Delete ${ postTitle }?`, {
            description: 'This action cannot be undone.',
            action: {
                label: 'Delete',
                onClick: async () => {
                    try {
                        const loadingToastId = toast.loading('Deleting post...');

                        await api.put(`/admin/posts/${ postId }/status`, { action: 'delete' });

                        toast.dismiss(loadingToastId);
                        toast.success('Post deleted successfully');

                        // Close modal if the deleted post is currently selected
                        if ( selectedPost && selectedPost.post._id === postId ) {
                            setShowPostModal(false);
                        }

                        // Refresh post list
                        fetchPosts(pagination.currentPage);
                    } catch ( err ) {
                        console.error('Error deleting post:', err);
                        toast.error('Failed to delete post', {
                            description: 'Please try again or contact support if the issue persists.'
                        });
                    }
                }
            }
        });
    };

    const handleViewPost = async (postId) => {
        try {
            const loadingToastId = toast.loading('Loading post details...');

            const { data } = await api.get(`/admin/posts/${ postId }`);
            setSelectedPost(data);
            setShowPostModal(true);

            toast.dismiss(loadingToastId);
        } catch ( err ) {
            console.error('Error fetching post details:', err);
            setError('Failed to load post details');
            toast.error('Failed to load post details', {
                description: 'There was an error retrieving the post information.'
            });
        }
    };

    const handleDeleteComment = async (commentId) => {
        toast.warning('Delete this comment?', {
            description: 'This action cannot be undone.',
            action: {
                label: 'Delete',
                onClick: async () => {
                    try {
                        const loadingToastId = toast.loading('Deleting comment...');

                        // Optimistically update UI before API call completes
                        if ( selectedPost ) {
                            const updatedComments = selectedPost.comments.filter(
                                comment => comment._id !== commentId
                            );

                            setSelectedPost({
                                ...selectedPost,
                                comments: updatedComments
                            });
                        }

                        // Make the API call
                        await api.delete(`/admin/comments/${ commentId }`);

                        toast.dismiss(loadingToastId);
                        toast.success('Comment deleted successfully');
                    } catch ( err ) {
                        console.error('Error deleting comment:', err);
                        toast.error('Failed to delete comment', {
                            description: 'Please try again or contact support if the issue persists.'
                        });

                        // Revert the UI change if API call fails
                        if ( selectedPost ) {
                            // Refetch the post details to restore accurate data
                            handleViewPost(selectedPost.post._id);
                        }
                    }
                }
            }
        });
    };

    if ( loading && posts.length === 0 ) {
        return <div className="flex justify-center py-8"><p>Loading data...</p></div>;
    }

    return (
        <div className="">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold font-customs">Post Management</h2>
                    <div className="text-sm text-gray-500">
                        Showing { posts.length } / { pagination.totalItems } posts
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input
                            type="text"
                            name="search"
                            placeholder="Search by title, content..."
                            className="w-full border focus:border-current rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50 px-3 py-2"
                            value={ filters.search }
                            onChange={ handleFilterChange }
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            className="w-full border focus:border-current rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50 px-3 py-2"
                            value={ filters.status }
                            onChange={ handleFilterChange }
                        >
                            <option value="">All</option>
                            <option value="true">Published</option>
                            <option value="false">Draft</option>
                        </select>
                    </div>
                </div>

                { error &&
                    <div className="text-red-600 mb-4 text-sm text-center">{ error }</div> }

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="text-left p-3">Title</th>
                            <th className="text-left p-3">Author</th>
                            <th className="text-left p-3">Topic</th>
                            <th className="text-left p-3">Date</th>
                            <th className="text-left p-3">Status</th>
                            <th className="text-left p-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        { posts.map(post => (
                            <tr key={ post._id } className="border-b">
                                <td className="p-3 max-w-1/3">
                                    <button
                                        className="text-blue-600 hover:text-blue-800 text-left w-full truncate font-customs text-sm"
                                        onClick={ () => handleViewPost(post._id) }
                                    >
                                        { post.tittle }
                                    </button>
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center font-customs text-sm">
                                        <Avatar avatar={ post.author?.authorId?.ava } width={ 32 } height={ 32 }
                                                username={ post.author?.authorName } />
                                        <div className="ml-2"></div>
                                        { post.author?.authorId?.username || 'Unknown' }
                                    </div>
                                </td>
                                <td className="p-3 font-customs text-sm">
                                    { post.topic?.topicName || '-' }
                                </td>
                                <td className="p-3 font-customs text-sm">
                                    { new Date(post.createdAt).toLocaleDateString() }
                                </td>
                                <td className="p-3">
                                    <div className="flex space-x-1">
                                        { post.status ? (
                                            <span
                                                className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-customs">
                                                Published
                                            </span>
                                        ) : (
                                            <span
                                                className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-customs">
                                                Draft
                                            </span>
                                        ) }
                                        { post.isFeatured && (
                                            <span
                                                className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-customs">
                                                Featured
                                            </span>
                                        ) }
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="flex space-x-2">
                                        <button
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={ () => handleViewPost(post._id) }
                                            title="View details"
                                        >
                                            <DocumentTextIcon className="h-5 w-5" />
                                        </button>
                                        { post.status && <button
                                            className="text-yellow-600 hover:text-yellow-800"
                                            onClick={ () => handlePostAction(post._id, 'reject') }
                                            title="Unpublish"
                                        >
                                            <XCircleIcon className="h-5 w-5" />
                                        </button> }
                                        { post.status && !post.isFeatured ? (
                                            <button
                                                className="text-purple-600 hover:text-purple-800"
                                                onClick={ () => handlePostAction(post._id, 'feature') }
                                                title="Mark as featured"
                                            >
                                                <StarIcon className="h-5 w-5" />
                                            </button>
                                        ) : post.isFeatured ? (
                                            <button
                                                className="text-gray-600 hover:text-gray-800"
                                                onClick={ () => handlePostAction(post._id, 'unfeature') }
                                                title="Remove featured"
                                            >
                                                <StarIcon className="h-5 w-5" />
                                            </button>
                                        ) : null }
                                        <button
                                            className="text-red-600 hover:text-red-800"
                                            onClick={ () => handleDeletePost(post._id) }
                                            title="Delete post"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) }
                        </tbody>
                    </table>
                </div>

                { posts.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500 text-sm font-customs">
                        No posts match the current filters
                    </div>
                ) }

                {/* Pagination */ }
                { pagination.totalPages > 0 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="flex items-center space-x-2" aria-label="Pagination">
                            <button
                                onClick={ () => handlePageChange(1) }
                                disabled={ !pagination.hasPrevPage }
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                «
                            </button>
                            <button
                                onClick={ () => handlePageChange(pagination.prevPage) }
                                disabled={ !pagination.hasPrevPage }
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ‹
                            </button>

                            {/* Page number buttons */ }
                            { Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                .filter(page => {
                                    const currentPage = pagination.currentPage;
                                    return page === 1 ||
                                        page === pagination.totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1);
                                })
                                .map((page, index, array) => {
                                    if ( index > 0 && page - array[index - 1] > 1 ) {
                                        return (
                                            <React.Fragment key={ `ellipsis-${ page }` }>
                                                <span className="px-3 py-1">...</span>
                                                <button
                                                    key={ page }
                                                    onClick={ () => handlePageChange(page) }
                                                    className={ `px-3 py-1 rounded border ${
                                                        pagination.currentPage === page
                                                            ? 'bg-gray-800 text-white'
                                                            : 'hover:bg-gray-100'
                                                    }` }
                                                >
                                                    { page }
                                                </button>
                                            </React.Fragment>
                                        );
                                    }
                                    return (
                                        <button
                                            key={ page }
                                            onClick={ () => handlePageChange(page) }
                                            className={ `px-3 py-1 rounded border ${
                                                pagination.currentPage === page
                                                    ? 'bg-gray-800 text-white'
                                                    : 'hover:bg-gray-100'
                                            }` }
                                        >
                                            { page }
                                        </button>
                                    );
                                }) }

                            <button
                                onClick={ () => handlePageChange(pagination.nextPage) }
                                disabled={ !pagination.hasNextPage }
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ›
                            </button>
                            <button
                                onClick={ () => handlePageChange(pagination.totalPages) }
                                disabled={ !pagination.hasNextPage }
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                »
                            </button>
                        </nav>
                    </div>
                ) }

                {/* Pagination info */ }
                { pagination.totalItems > 0 && (
                    <div className="mt-2 text-center text-sm text-gray-500">
                        Page { pagination.currentPage } / { pagination.totalPages } | Total
                        posts: { pagination.totalItems }
                    </div>
                ) }
            </div>

            {/* Post Details Modal */ }
            { showPostModal && selectedPost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-0">
                    <div className="bg-white rounded-sm p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold font-customs">{ selectedPost.post.tittle }</h2>
                            <button
                                className="text-gray-600 hover:text-gray-800"
                                onClick={ () => setShowPostModal(false) }
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <Avatar avatar={ selectedPost.post.author?.authorId?.ava } width={ 48 } height={ 48 }
                                        username={ selectedPost.post.author?.authorName } />
                                <div className="mr-3"></div>
                                <div>
                                    <h3 className="font-medium font-customs">{ selectedPost.post.author?.authorName }</h3>
                                    <p className="text-sm text-gray-600">
                                        { new Date(selectedPost.post.createdAt).toLocaleDateString() }
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                { selectedPost.post.status ? (
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                      Published
                                    </span>
                                ) : (
                                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                      Draft
                                    </span>
                                ) }
                                { selectedPost.post.isFeatured && (
                                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                      Featured
                                    </span>
                                ) }
                            </div>
                        </div>

                        { selectedPost.post.topic?.topicId && (
                            <div className="mb-4">
                              <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                { selectedPost.post.topic.topicName }
                              </span>
                            </div>
                        ) }

                        <div className="prose max-w-none mb-6 font-customs2"
                             dangerouslySetInnerHTML={ { __html: selectedPost.post.content } } />

                        <div className="border-t pt-4">
                            <h3 className="text-base font-semibold font-customs mb-4">Comments
                                ({ selectedPost.comments.length })</h3>
                            <div className="space-y-4">
                                { selectedPost.comments.length > 0 ? (
                                    selectedPost.comments.map(comment => (
                                        <div key={ comment._id } className="border-b pb-4 last:border-0">
                                            <div className="flex items-start space-x-3">
                                                <Avatar avatar={ comment.author?.authorId?.ava } width={ 32 }
                                                        height={ 32 }
                                                        username={ comment.author?.authorName } />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-medium">{ comment.author?.username }</h4>
                                                            <p className="text-sm text-gray-500">
                                                                { new Date(comment.createdAt).toLocaleString() }
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={ () => handleDeleteComment(comment._id) }
                                                            className="text-red-600 hover:text-red-800 text-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                    <p className="mt-2">{ comment.content }</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm font-customs">No comments yet</p>
                                ) }
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                            { selectedPost.post.status && !selectedPost.post.isFeatured ? (
                                <button
                                    className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 text-sm"
                                    onClick={ () => {
                                        handlePostAction(selectedPost.post._id, 'feature');
                                        setShowPostModal(false);
                                    } }
                                >
                                    Mark as featured
                                </button>
                            ) : selectedPost.post.isFeatured ? (
                                <button
                                    className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 text-sm"
                                    onClick={ () => {
                                        handlePostAction(selectedPost.post._id, 'unfeature');
                                        setShowPostModal(false);
                                    } }
                                >
                                    Remove featured
                                </button>
                            ) : null }
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 text-sm"
                                onClick={ () => {
                                    handleDeletePost(selectedPost.post._id);
                                } }
                            >
                                Delete post
                            </button>
                        </div>
                    </div>
                </div>
            ) }
        </div>
    );
}

function CommentManagement() {
    const [comments, setComments] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit: 20,
        hasNextPage: false,
        hasPrevPage: false
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [postIdFilter, setPostIdFilter] = useState('');
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/admin/comments', {
                params: {
                    page: pagination.currentPage,
                    limit: pagination.limit,
                    postId: postIdFilter || undefined
                }
            });

            setComments(data.comments);
            setPagination(data.pagination);
            setLoading(false);

            // Show toast when comments are successfully loaded
            if ( postIdFilter ) {
                toast.success(`Loaded comments for post: ${ postIdFilter }`);
            }
        } catch ( err ) {
            console.error('Error fetching comments:', err);
            setError('Failed to load comments');
            setLoading(false);
            toast.error('Failed to load comments');
        }
    };

    useEffect(() => {
        fetchComments();
    }, [pagination.currentPage, postIdFilter, pagination.limit]);

    const handlePageChange = (newPage) => {
        if ( newPage < 1 || newPage > pagination.totalPages ) return;
        setPagination(prev => ({ ...prev, currentPage: newPage }));
        toast.info(`Navigating to page ${ newPage }`);
    };

    const confirmDeleteComment = (commentId, commentContent) => {
        toast.warning(`Are you sure you want to delete this comment?`, {
            description: commentContent.length > 50 ? `${ commentContent.substring(0, 50) }...` : commentContent,
            action: {
                label: 'Delete',
                onClick: () => executeDeleteComment(commentId)
            },
            cancel: {
                label: 'Cancel',
                onClick: () => toast.info('Deletion cancelled')
            },
            duration: 5000
        });
    };

    const executeDeleteComment = async (commentId) => {
        try {
            // Optimistically update UI before API call completes
            const updatedComments = comments.filter(comment => comment._id !== commentId);
            setComments(updatedComments);

            // Close modal if open
            if ( showCommentModal ) {
                setShowCommentModal(false);
            }

            // Make the API call
            await api.delete(`/admin/comments/${ commentId }`);

            toast.success('Comment deleted successfully');

            // Refresh pagination data if needed
            if ( updatedComments.length === 0 && pagination.currentPage > 1 ) {
                // If we deleted the last comment on the page, go to previous page
                setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
            } else {
                // Otherwise just update the pagination info
                setPagination(prev => ({
                    ...prev,
                    totalItems: prev.totalItems - 1,
                    totalPages: Math.ceil((prev.totalItems - 1) / prev.limit)
                }));
            }
        } catch ( err ) {
            console.error('Error deleting comment:', err);
            setError('Failed to delete comment');
            toast.error('Failed to delete comment');

            // Revert the UI change by refetching comments
            fetchComments();
        }
    };

    const handleViewComment = (comment) => {
        setSelectedComment(comment);
        setShowCommentModal(true);
        toast.info(`Viewing comment from ${ comment.author?.username || 'Unknown' }`);
    };

    const handleFilterByPost = (postId, postTitle) => {
        setPostIdFilter(postId);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        toast.info(`Filtering comments for post: ${ postTitle || 'Unknown' }`);

        if ( showCommentModal ) {
            setShowCommentModal(false);
        }
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        if ( pagination.totalPages <= maxPagesToShow ) {
            // Show all pages if total pages are less than max pages to show
            for ( let i = 1; i <= pagination.totalPages; i++ ) {
                pageNumbers.push(i);
            }
        } else {
            // Calculate range of pages to show
            let startPage = Math.max(1, pagination.currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = startPage + maxPagesToShow - 1;

            if ( endPage > pagination.totalPages ) {
                endPage = pagination.totalPages;
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            // Add first page and ellipsis if necessary
            if ( startPage > 1 ) {
                pageNumbers.push(1);
                if ( startPage > 2 ) {
                    pageNumbers.push('...');
                }
            }

            // Add page numbers
            for ( let i = startPage; i <= endPage; i++ ) {
                pageNumbers.push(i);
            }

            // Add ellipsis and last page if necessary
            if ( endPage < pagination.totalPages ) {
                if ( endPage < pagination.totalPages - 1 ) {
                    pageNumbers.push('...');
                }
                pageNumbers.push(pagination.totalPages);
            }
        }

        return pageNumbers;
    };

    if ( loading && comments.length === 0 ) {
        return <div className="flex justify-center py-8"><p>Loading data...</p></div>;
    }

    return (
        <div className="">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold font-customs">Comment Management</h2>
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Filter by Post ID"
                            className="border focus:border-current rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50 px-3 py-2"
                            value={ postIdFilter }
                            onChange={ (e) => setPostIdFilter(e.target.value) }
                        />
                    </div>
                </div>

                { error &&
                    <div className="text-red-600 mb-4 text-sm text-center">{ error }</div> }

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="text-left p-3">Content</th>
                            <th className="text-left p-3">Author</th>
                            <th className="text-left p-3">Post</th>
                            <th className="text-left p-3">Date</th>
                            <th className="text-left p-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        { comments.map(comment => (
                            <tr key={ comment._id } className="border-b">
                                <td className="p-3 max-w-xs truncate">
                                    <button
                                        className="text-blue-600 hover:text-blue-800 text-left text-sm font-customs"
                                        onClick={ () => handleViewComment(comment) }
                                    >
                                        { comment.content.length > 50 ? `${ comment.content.substring(0, 50) }...` : comment.content }
                                    </button>
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center">
                                        <Avatar avatar={ comment.author.ava } username={ comment.author.username }
                                                width={ 32 } height={ 32 } />
                                        <div className="ml-2"></div>
                                        { comment.author?.username || 'Unknown' }
                                    </div>
                                </td>
                                <td className="p-3">
                                    <button
                                        className="text-blue-600 hover:text-blue-800 text-sm font-customs"
                                        onClick={ () => handleFilterByPost(comment.post._id, comment.post?.tittle) }
                                    >
                                        { comment.post?.tittle || 'Unknown' }
                                    </button>
                                </td>
                                <td className="p-3 text-sm font-customs">
                                    { new Date(comment.createdAt).toLocaleDateString() }
                                </td>
                                <td className="p-3">
                                    <div className="flex space-x-2">
                                        <button
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={ () => handleViewComment(comment) }
                                            title="View details"
                                        >
                                            <ChatIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-800"
                                            onClick={ () => confirmDeleteComment(comment._id, comment.content) }
                                            title="Delete comment"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) }
                        </tbody>
                    </table>
                </div>

                {/* Traditional Pagination */ }
                { pagination.totalPages > 0 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="flex items-center space-x-2" aria-label="Pagination">
                            <button
                                onClick={ () => handlePageChange(1) }
                                disabled={ !pagination.hasPrevPage }
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                «
                            </button>
                            <button
                                onClick={ () => handlePageChange(pagination.prevPage) }
                                disabled={ !pagination.hasPrevPage }
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ‹
                            </button>

                            {/* Create page number buttons */ }
                            { Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                .filter(page => {
                                    // Display pages near the current page
                                    const currentPage = pagination.currentPage;
                                    return page === 1 ||
                                        page === pagination.totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1);
                                })
                                .map((page, index, array) => {
                                    // Add "..." if there's a gap between pages
                                    if ( index > 0 && page - array[index - 1] > 1 ) {
                                        return (
                                            <React.Fragment key={ `ellipsis-${ page }` }>
                                                <span className="px-3 py-1">...</span>
                                                <button
                                                    key={ page }
                                                    onClick={ () => handlePageChange(page) }
                                                    className={ `px-3 py-1 rounded border ${
                                                        pagination.currentPage === page
                                                            ? 'bg-gray-800 text-white'
                                                            : 'hover:bg-gray-100'
                                                    }` }
                                                >
                                                    { page }
                                                </button>
                                            </React.Fragment>
                                        );
                                    }
                                    return (
                                        <button
                                            key={ page }
                                            onClick={ () => handlePageChange(page) }
                                            className={ `px-3 py-1 rounded border ${
                                                pagination.currentPage === page
                                                    ? 'bg-gray-800 text-white'
                                                    : 'hover:bg-gray-100'
                                            }` }
                                        >
                                            { page }
                                        </button>
                                    );
                                }) }

                            <button
                                onClick={ () => handlePageChange(pagination.nextPage) }
                                disabled={ !pagination.hasNextPage }
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ›
                            </button>
                            <button
                                onClick={ () => handlePageChange(pagination.totalPages) }
                                disabled={ !pagination.hasNextPage }
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                »
                            </button>
                        </nav>
                    </div>
                ) }

                {/* Pagination information */ }
                { pagination.totalItems > 0 && (
                    <div className="mt-2 text-center text-sm text-gray-500">
                        Page { pagination.currentPage } / { pagination.totalPages } |
                        Total: { pagination.totalItems } comments
                    </div>
                ) }
            </div>

            {/* Comment Details Modal */ }
            { showCommentModal && selectedComment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-sm p-6 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-4 w-full">
                            <h2 className="text-xl font-semibold font-customs">Comment Details</h2>
                            <button
                                className="text-gray-600 hover:text-gray-800"
                                onClick={ () => setShowCommentModal(false) }
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex items-start space-x-4 mb-6">
                            <Avatar avatar={ selectedComment.author.ava } username={ selectedComment.author.username }
                                    width={ 48 } height={ 48 } />
                            <div>
                                <h3 className="font-medium">{ selectedComment.author?.username }</h3>
                                <p className="text-sm text-gray-500">
                                    { new Date(selectedComment.createdAt).toLocaleString() }
                                </p>
                                <div className="mt-2 p-4 prose max-w-none mb-6 font-customs">
                                    { selectedComment.content }
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-medium mb-2 font-customs">Post:</h3>
                            <div className="flex items-center space-x-3">
                                <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                                <button
                                    className="text-blue-600 hover:text-blue-800"
                                    onClick={ () => handleFilterByPost(selectedComment.post._id, selectedComment.post?.tittle) }
                                >
                                    { selectedComment.post?.tittle || 'Unknown' }
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 pt-4 border-t">
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 text-sm font-customs"
                                onClick={ () => confirmDeleteComment(selectedComment._id, selectedComment.content) }
                            >
                                Delete Comment
                            </button>
                        </div>
                    </div>
                </div>
            ) }
        </div>
    );
}

function Analytics() {
    const [period, setPeriod] = useState('week');
    const [userGrowth, setUserGrowth] = useState(null);
    const [contentStats, setContentStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const [userRes, contentRes] = await Promise.all([
                    api.get('/admin/dashboard/user-growth', { params: { period } }),
                    api.get('/admin/dashboard/content-stats', { params: { period } })
                ]);

                setUserGrowth(userRes.data);
                setContentStats(contentRes.data);
                setLoading(false);
            } catch ( err ) {
                console.error('Error fetching analytics:', err);
                setError('Failed to load analytics data');
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [period]);

    const userGrowthChartData = {
        labels: userGrowth?.userSignups.map(item => item._id) || [],
        datasets: [
            {
                label: 'New Users',
                data: userGrowth?.userSignups.map(item => item.count) || [],
                backgroundColor: 'rgba(59, 130, 246, 0.7)'
            },
            {
                label: 'New Premium Members',
                data: userGrowth?.premiumSignups.map(item => item.count) || [],
                backgroundColor: 'rgba(124, 58, 237, 0.7)'
            }
        ]
    };

    const contentStatsChartData = {
        labels: contentStats?.postCreation.map(item => item._id) || [],
        datasets: [
            {
                label: 'New Posts',
                data: contentStats?.postCreation.map(item => item.count) || [],
                backgroundColor: 'rgba(16, 185, 129, 0.7)'
            },
            {
                label: 'New Comments',
                data: contentStats?.commentCreation.map(item => item.count) || [],
                backgroundColor: 'rgba(245, 158, 11, 0.7)'
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Activity Statistics'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        }
    };

    if ( loading ) {
        return <div className="flex justify-center py-8"><p>Loading data...</p></div>;
    }

    if ( error ) {
        return <div className="bg-red-50 p-4 rounded-lg text-red-600 text-sm">{ error }</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800 font-customs">Statistics and Analytics</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={ () => setPeriod('week') }
                        className={ `px-3 py-1 rounded-full text-sm ${ period === 'week' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700' }` }
                    >
                        Week
                    </button>
                    <button
                        onClick={ () => setPeriod('month') }
                        className={ `px-3 py-1 rounded-full text-sm ${ period === 'month' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700' }` }
                    >
                        Month
                    </button>
                    <button
                        onClick={ () => setPeriod('year') }
                        className={ `px-3 py-1 rounded-full text-sm ${ period === 'year' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700' }` }
                    >
                        Year
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-customs">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <ChartBarIcon className="h-5 w-5 text-blue-500" />
                        <h2 className="text-lg font-semibold">User Growth</h2>
                    </div>
                    <Bar options={ chartOptions } data={ userGrowthChartData } />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <CalendarIcon className="h-5 w-5 text-green-500" />
                        <h2 className="text-lg font-semibold">Content Activity</h2>
                    </div>
                    <Bar options={ chartOptions } data={ contentStatsChartData } />
                </div>
            </div>

            { contentStats?.topAuthors && contentStats.topAuthors.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Top Authors</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="text-left p-3">Author</th>
                                <th className="text-left p-3">Post Count</th>
                                <th className="text-left p-3">Email</th>
                            </tr>
                            </thead>
                            <tbody>
                            { contentStats.topAuthors.map(author => (
                                <tr key={ author._id } className="border-b">
                                    <td className="p-3">
                                        <div className="flex items-center">
                                            <img
                                                src={ author.author?.ava || '/api/placeholder/32/32' }
                                                alt={ author.author?.username }
                                                className="h-8 w-8 rounded-full mr-2"
                                            />
                                            { author.author?.username || 'Unknown' }
                                        </div>
                                    </td>
                                    <td className="p-3">{ author.count }</td>
                                    <td className="p-3">{ author.author?.email || '-' }</td>
                                </tr>
                            )) }
                            </tbody>
                        </table>
                    </div>
                </div>
            ) }
        </div>
    );
}

function TopicManagement() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        sortBy: 'topicname',
        sortOrder: 1
    });
    const [showTopicModal, setShowTopicModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [newTopicName, setNewTopicName] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        limit: 20,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null
    });

    // Fetch topics from API
    const fetchTopics = async (page = 1) => {
        try {
            setLoading(true);

            const { data } = await api.get('/admin/topics', {
                params: {
                    ...filters,
                    page,
                    limit: pagination.limit
                }
            });

            setTopics(data.topics);
            setPagination(data.pagination || {
                currentPage: 1,
                totalPages: 0,
                totalItems: 0,
                limit: 20,
                hasNextPage: false,
                hasPrevPage: false,
                nextPage: null,
                prevPage: null
            });
            setLoading(false);
        } catch ( err ) {
            console.error('Error fetching topics:', err);
            setError('Failed to load topics');
            setLoading(false);
            toast.error('Failed to load topics', {
                description: 'There was an error retrieving the topics. Please try again later.'
            });
        }
    };

    // Initialize on component mount
    useEffect(() => {
        fetchTopics(1);
    }, [filters]);

    // Handle page change for pagination
    const handlePageChange = (newPage) => {
        fetchTopics(newPage);
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Handle sort order change
    const handleSortChange = (sortField) => {
        setFilters(prev => {
            // If clicking the same field, toggle sort order
            if ( prev.sortBy === sortField ) {
                return { ...prev, sortOrder: prev.sortOrder * -1 };
            }
            // Otherwise, sort by new field in ascending order
            return { ...prev, sortBy: sortField, sortOrder: 1 };
        });
    };

    // Handle view topic details
    const handleViewTopic = async (topicId) => {
        try {
            const loadingToastId = toast.loading('Loading topic details...');

            const { data } = await api.get(`/admin/topics/${ topicId }`);
            setSelectedTopic(data);
            setShowTopicModal(true);
            setEditMode(false);

            toast.dismiss(loadingToastId);
        } catch ( err ) {
            console.error('Error fetching topic details:', err);
            setError('Failed to load topic details');
            toast.error('Failed to load topic details', {
                description: 'There was an error retrieving the topic information.'
            });
        }
    };

    // Handle edit mode for topic
    const handleEditTopic = () => {
        if ( selectedTopic ) {
            setNewTopicName(selectedTopic.topic.topicname);
            setEditMode(true);
        }
    };

    // Save topic edits
    const handleSaveTopic = async () => {
        if ( !newTopicName.trim() ) {
            toast.error('Topic name cannot be empty');
            return;
        }

        try {
            const loadingToastId = toast.loading('Updating topic...');

            await api.put(`/admin/topics/${ selectedTopic.topic._id }`, {
                topicname: newTopicName
            });

            toast.dismiss(loadingToastId);
            toast.success('Topic updated successfully');

            // Refresh topic list
            fetchTopics(pagination.currentPage);

            // Refresh current topic details
            const { data } = await api.get(`/admin/topics/${ selectedTopic.topic._id }`);
            setSelectedTopic(data);

            setEditMode(false);
        } catch ( err ) {
            console.error('Error updating topic:', err);
            toast.error('Failed to update topic', {
                description: err.response?.data?.message || 'Please try again later.'
            });
        }
    };

    // Handle create new topic
    const handleCreateTopic = async () => {
        if ( !newTopicName.trim() ) {
            toast.error('Topic name cannot be empty');
            return;
        }

        try {
            const loadingToastId = toast.loading('Creating topic...');

            await api.post('/admin/topics', {
                topicname: newTopicName
            });

            toast.dismiss(loadingToastId);
            toast.success('Topic created successfully');

            // Reset form and close modal
            setNewTopicName('');
            setShowCreateModal(false);

            // Refresh topic list
            fetchTopics(1);
        } catch ( err ) {
            console.error('Error creating topic:', err);
            toast.error('Failed to create topic', {
                description: err.response?.data?.message || 'Please try again later.'
            });
        }
    };

    // Handle delete topic
    const handleDeleteTopic = (topicId, topicName) => {
        toast.warning(`Delete topic "${ topicName }"?`, {
            description: 'This action cannot be undone. All associated tags will also be deleted.',
            action: {
                label: 'Delete',
                onClick: async () => {
                    try {
                        const loadingToastId = toast.loading('Deleting topic...');

                        await api.delete(`/admin/topics/${ topicId }`);

                        toast.dismiss(loadingToastId);
                        toast.success('Topic deleted successfully');

                        // Close modal if the deleted topic is currently selected
                        if ( selectedTopic && selectedTopic.topic._id === topicId ) {
                            setShowTopicModal(false);
                        }

                        // Refresh topic list
                        fetchTopics(pagination.currentPage);
                    } catch ( err ) {
                        console.error('Error deleting topic:', err);
                        toast.error('Failed to delete topic', {
                            description: err.response?.data?.message || 'Please try again later.'
                        });
                    }
                }
            }
        });
    };

    if ( loading && topics.length === 0 ) {
        return <div className="flex justify-center py-8"><p>Loading topics...</p></div>;
    }

    return (
        <div className="">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold font-customs">Topic Management</h2>
                    <div className="flex items-center">
                        <button
                            onClick={ () => {
                                setNewTopicName('');
                                setShowCreateModal(true);
                            } }
                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-sm"
                        >
                            Create New Topic
                        </button>
                        <div className="ml-4 text-sm text-gray-500">
                            Showing { topics.length } / { pagination.totalItems } topics
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                        type="text"
                        name="search"
                        placeholder="Search topics by name..."
                        className="w-full border focus:border-current rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50 px-3 py-2"
                        value={ filters.search }
                        onChange={ handleFilterChange }
                    />
                </div>

                { error &&
                    <div className="text-red-600 mb-4 text-sm text-center">{ error }</div> }

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="text-left p-3">Topic Name</th>
                            <th className="text-left p-3">Tags</th>
                            <th className="text-left p-3">Posts</th>
                            <th className="text-left p-3">Followers</th>
                            <th className="text-center p-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        { topics.map(topic => (
                            <tr key={ topic._id } className="border-b">
                                <td className="p-3">
                                    <button
                                        className="text-blue-600 hover:text-blue-800 text-left w-full font-customs text-sm"
                                        onClick={ () => handleViewTopic(topic._id) }
                                    >
                                        { topic.topicname }
                                    </button>
                                </td>
                                <td className="p-3 font-customs text-sm">
                                    { topic.tags?.length || 0 }
                                </td>
                                <td className="p-3 font-customs text-sm">
                                    {/* This would be filled if we had post count in the API response */ }
                                    { topic.postsCount || 0 }
                                </td>
                                <td className="p-3 font-customs text-sm">
                                    { topic.followers || 0 }
                                </td>
                                <td className="p-3">
                                    <div className="flex space-x-2 justify-center">
                                        <button
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={ () => handleViewTopic(topic._id) }
                                            title="View details"
                                        >
                                            <DocumentTextIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="text-yellow-600 hover:text-yellow-800"
                                            onClick={ () => {
                                                setSelectedTopic({ topic });
                                                setNewTopicName(topic.topicname);
                                                setEditMode(true);
                                                setShowTopicModal(true);
                                            } }
                                            title="Edit topic"
                                        >
                                            <PencilAltIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-800"
                                            onClick={ () => handleDeleteTopic(topic._id, topic.topicname) }
                                            title="Delete topic"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) }
                        </tbody>
                    </table>
                </div>

                { topics.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500 text-sm font-customs">
                        No topics match the current filters
                    </div>
                ) }

                {/* Pagination */ }
                { pagination.totalPages > 0 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="flex items-center space-x-2" aria-label="Pagination">
                            <button
                                onClick={ () => handlePageChange(1) }
                                disabled={ !pagination.hasPrevPage }
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                «
                            </button>
                            <button
                                onClick={ () => handlePageChange(pagination.prevPage) }
                                disabled={ !pagination.hasPrevPage }
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ‹
                            </button>

                            {/* Page number buttons */ }
                            { Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                .filter(page => {
                                    const currentPage = pagination.currentPage;
                                    return page === 1 ||
                                        page === pagination.totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1);
                                })
                                .map((page, index, array) => {
                                    if ( index > 0 && page - array[index - 1] > 1 ) {
                                        return (
                                            <React.Fragment key={ `ellipsis-${ page }` }>
                                                <span className="px-3 py-1">...</span>
                                                <button
                                                    key={ page }
                                                    onClick={ () => handlePageChange(page) }
                                                    className={ `px-3 py-1 rounded border ${
                                                        pagination.currentPage === page
                                                            ? 'bg-gray-800 text-white'
                                                            : 'hover:bg-gray-100'
                                                    }` }
                                                >
                                                    { page }
                                                </button>
                                            </React.Fragment>
                                        );
                                    }
                                    return (
                                        <button
                                            key={ page }
                                            onClick={ () => handlePageChange(page) }
                                            className={ `px-3 py-1 rounded border ${
                                                pagination.currentPage === page
                                                    ? 'bg-gray-800 text-white'
                                                    : 'hover:bg-gray-100'
                                            }` }
                                        >
                                            { page }
                                        </button>
                                    );
                                }) }

                            <button
                                onClick={ () => handlePageChange(pagination.nextPage) }
                                disabled={ !pagination.hasNextPage }
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ›
                            </button>
                            <button
                                onClick={ () => handlePageChange(pagination.totalPages) }
                                disabled={ !pagination.hasNextPage }
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                »
                            </button>
                        </nav>
                    </div>
                ) }

                {/* Pagination info */ }
                { pagination.totalItems > 0 && (
                    <div className="mt-2 text-center text-sm text-gray-500">
                        Page { pagination.currentPage } / { pagination.totalPages } | Total
                        topics: { pagination.totalItems }
                    </div>
                ) }
            </div>

            {/* Topic Details/Edit Modal */ }
            { showTopicModal && selectedTopic && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-0">
                    <div className="bg-white rounded-sm p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold font-customs">
                                { editMode ? 'Edit Topic' : 'Topic Details' }
                            </h2>
                            <button
                                className="text-gray-600 hover:text-gray-800"
                                onClick={ () => setShowTopicModal(false) }
                            >
                                ✕
                            </button>
                        </div>

                        { editMode ? (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Topic Name</label>
                                <input
                                    type="text"
                                    value={ newTopicName }
                                    onChange={ e => setNewTopicName(e.target.value) }
                                    className="w-full border focus:border-current rounded-md text-sm font-customs focus:ring-0 outline-none bg-gray-50 px-3 py-2"
                                />
                            </div>
                        ) : (
                            <div className="mb-6">
                                <h3 className="text-lg font-medium">{ selectedTopic.topic.topicname }</h3>
                                <div className="mt-2 flex space-x-4">
                                    <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                        { selectedTopic.stats?.postsCount || 0 } Posts
                                    </div>
                                    <div className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                        { selectedTopic.stats?.followersCount || 0 } Followers
                                    </div>
                                    <div className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                                        { selectedTopic.stats?.tagsCount || 0 } Tags
                                    </div>
                                </div>
                            </div>
                        ) }

                        { !editMode && selectedTopic.tags && selectedTopic.tags.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-md font-medium mb-2">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    { selectedTopic.tags.map(tag => (
                                        <span
                                            key={ tag._id }
                                            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            { tag.tag }
                                        </span>
                                    )) }
                                </div>
                            </div>
                        ) }

                        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                            { editMode ? (
                                <>
                                    <button
                                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 text-sm"
                                        onClick={ () => setEditMode(false) }
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-sm"
                                        onClick={ handleSaveTopic }
                                    >
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="bg-yellow-600 text-white px-4 py-2 rounded-full hover:bg-yellow-700 text-sm"
                                        onClick={ handleEditTopic }
                                    >
                                        Edit Topic
                                    </button>
                                    <button
                                        className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 text-sm"
                                        onClick={ () => handleDeleteTopic(selectedTopic.topic._id, selectedTopic.topic.topicname) }
                                    >
                                        Delete Topic
                                    </button>
                                </>
                            ) }
                        </div>
                    </div>
                </div>
            ) }

            {/* Create Topic Modal */ }
            { showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-0">
                    <div className="bg-white rounded-sm p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold font-customs">Create New Topic</h2>
                            <button
                                className="text-gray-600 hover:text-gray-800"
                                onClick={ () => setShowCreateModal(false) }
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Topic Name</label>
                            <input
                                type="text"
                                value={ newTopicName }
                                onChange={ e => setNewTopicName(e.target.value) }
                                placeholder="Enter topic name"
                                className="w-full border focus:border-current rounded-full text-sm font-customs focus:ring-0 outline-none bg-gray-50 px-3 py-2"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 text-sm"
                                onClick={ () => setShowCreateModal(false) }
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-sm"
                                onClick={ handleCreateTopic }
                            >
                                Create Topic
                            </button>
                        </div>
                    </div>
                </div>
            ) }
        </div>
    );
}

function TagManagement() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        sortBy: 'tag',
        sortOrder: 1,
        topicId: ''
    });
    const [showTagModal, setShowTagModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [selectedTopicForTag, setSelectedTopicForTag] = useState(null);
    const [topicsList, setTopicsList] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        limit: 20,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null
    });

    // Fetch tags from API
    const fetchTags = async (page = 1) => {
        try {
            setLoading(true);

            const { data } = await api.get('/admin/tags', {
                params: {
                    ...filters,
                    page,
                    limit: pagination.limit
                }
            });

            setTags(data.tags);
            setPagination(data.pagination || {
                currentPage: 1,
                totalPages: 0,
                totalItems: 0,
                limit: 20,
                hasNextPage: false,
                hasPrevPage: false,
                nextPage: null,
                prevPage: null
            });
            setLoading(false);
        } catch ( err ) {
            console.error('Error fetching tags:', err);
            setError('Failed to load tags');
            setLoading(false);
            toast.error('Failed to load tags', {
                description: 'There was an error retrieving the tags. Please try again later.'
            });
        }
    };

    // Fetch topics for dropdown
    const fetchTopics = async () => {
        try {
            const { data } = await api.get('/admin/topics', {
                params: {
                    limit: 100 // Get all topics for dropdown
                }
            });
            setTopicsList(data.topics);
        } catch ( err ) {
            console.error('Error fetching topics:', err);
            toast.error('Failed to load topics', {
                description: 'There was an error retrieving topics for the dropdown.'
            });
        }
    };

    // Initialize on component mount
    useEffect(() => {
        fetchTags(1);
        fetchTopics();
    }, [filters]);

    // Handle page change for pagination
    const handlePageChange = (newPage) => {
        fetchTags(newPage);
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Handle sort order change
    const handleSortChange = (sortField) => {
        setFilters(prev => {
            // If clicking the same field, toggle sort order
            if ( prev.sortBy === sortField ) {
                return { ...prev, sortOrder: prev.sortOrder * -1 };
            }
            // Otherwise, sort by new field in ascending order
            return { ...prev, sortBy: sortField, sortOrder: 1 };
        });
    };

    // Handle view tag details
    const handleViewTag = async (tagId) => {
        try {
            const loadingToastId = toast.loading('Loading tag details...');

            const { data } = await api.get(`/admin/tags/${ tagId }`);
            setSelectedTag(data);
            setShowTagModal(true);
            setEditMode(false);

            toast.dismiss(loadingToastId);
        } catch ( err ) {
            console.error('Error fetching tag details:', err);
            setError('Failed to load tag details');
            toast.error('Failed to load tag details', {
                description: 'There was an error retrieving the tag information.'
            });
        }
    };

    // Handle edit mode for tag
    const handleEditTag = () => {
        if ( selectedTag ) {
            setNewTagName(selectedTag.tag.tag);
            setSelectedTopicForTag(selectedTag.tag.topic?.topicId || '');
            setEditMode(true);
        }
    };

    // Save tag edits
    const handleSaveTag = async () => {
        if ( !newTagName.trim() ) {
            toast.error('Tag name cannot be empty');
            return;
        }

        try {
            const loadingToastId = toast.loading('Updating tag...');

            await api.put(`/admin/tags/${ selectedTag.tag._id }`, {
                tag: newTagName,
                topicId: selectedTopicForTag || null
            });

            toast.dismiss(loadingToastId);
            toast.success('Tag updated successfully');

            // Refresh tag list
            fetchTags(pagination.currentPage);

            // Refresh current tag details
            const { data } = await api.get(`/admin/tags/${ selectedTag.tag._id }`);
            setSelectedTag(data);

            setEditMode(false);
        } catch ( err ) {
            console.error('Error updating tag:', err);
            toast.error('Failed to update tag', {
                description: err.response?.data?.message || 'Please try again later.'
            });
        }
    };

    // Handle create new tag
    const handleCreateTag = async () => {
        if ( !newTagName.trim() ) {
            toast.error('Tag name cannot be empty');
            return;
        }

        try {
            const loadingToastId = toast.loading('Creating tag...');

            await api.post('/admin/tags', {
                tag: newTagName,
                topicId: selectedTopicForTag || null
            });

            toast.dismiss(loadingToastId);
            toast.success('Tag created successfully');

            // Reset form and close modal
            setNewTagName('');
            setSelectedTopicForTag(null);
            setShowCreateModal(false);

            // Refresh tag list
            fetchTags(1);
        } catch ( err ) {
            console.error('Error creating tag:', err);
            toast.error('Failed to create tag', {
                description: err.response?.data?.message || 'Please try again later.'
            });
        }
    };

    // Handle delete tag
    const handleDeleteTag = (tagId, tagName) => {
        toast.warning(`Delete tag "${ tagName }"?`, {
            description: 'This action cannot be undone.',
            action: {
                label: 'Delete',
                onClick: async () => {
                    try {
                        const loadingToastId = toast.loading('Deleting tag...');

                        await api.delete(`/admin/tags/${ tagId }`);

                        toast.dismiss(loadingToastId);
                        toast.success('Tag deleted successfully');

                        // Close modal if the deleted tag is currently selected
                        if ( selectedTag && selectedTag.tag._id === tagId ) {
                            setShowTagModal(false);
                        }

                        // Refresh tag list
                        fetchTags(pagination.currentPage);
                    } catch ( err ) {
                        console.error('Error deleting tag:', err);
                        toast.error('Failed to delete tag', {
                            description: err.response?.data?.message || 'Please try again later.'
                        });
                    }
                }
            }
        });
    };

    if ( loading && tags.length === 0 ) {
        return <div className="flex justify-center py-8"><p>Loading tags...</p></div>;
    }

    return (
        <div className="">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold font-customs">Tag Management</h2>
                    <div className="flex items-center">
                        <button
                            onClick={ () => {
                                setNewTagName('');
                                setSelectedTopicForTag(null);
                                setShowCreateModal(true);
                            } }
                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-sm"
                        >
                            Create New Tag
                        </button>
                        <div className="ml-4 text-sm text-gray-500">
                            Showing { tags.length } / { pagination.totalItems } tags
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input
                            type="text"
                            name="search"
                            placeholder="Search tags by name..."
                            className="w-full border focus:border-current rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50 px-3 py-2"
                            value={ filters.search }
                            onChange={ handleFilterChange }
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Topic</label>
                        <select
                            name="topicId"
                            className="w-full border focus:border-current rounded-md text-sm font-customs focus:ring-0 outline-none bg-gray-50 px-3 py-2"
                            value={ filters.topicId }
                            onChange={ handleFilterChange }
                        >
                            <option value="">All Topics</option>
                            { topicsList.map(topic => (
                                <option key={ topic._id } value={ topic._id }>{ topic.topicname }</option>
                            )) }
                        </select>
                    </div>
                </div>

                { error &&
                    <div className="text-red-600 mb-4 text-sm text-center">{ error }</div> }

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="text-left p-3">Tag Name</th>
                            <th className="text-left p-3">Topic</th>
                            <th className="text-left p-3">Posts</th>
                            <th className="text-left p-3">Followers</th>
                            <th className="text-center p-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        { tags.map(tag => (
                            <tr key={ tag._id } className="border-b">
                                <td className="p-3">
                                    <button
                                        className="text-blue-600 hover:text-blue-800 text-left w-full font-customs text-sm"
                                        onClick={ () => handleViewTag(tag._id) }
                                    >
                                        { tag.tag }
                                    </button>
                                </td>
                                <td className="p-3 font-customs text-sm">
                                    { tag.topic?.topicName || 'No topic' }
                                </td>
                                <td className="p-3 font-customs text-sm">
                                    {/* This would be filled if we had post count in the API response */ }
                                    { tag.postsCount || 0 }
                                </td>
                                <td className="p-3 font-customs text-sm">
                                    { tag.followers || 0 }
                                </td>
                                <td className="p-3">
                                    <div className="flex space-x-2 justify-center">
                                        <button
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={ () => handleViewTag(tag._id) }
                                            title="View details"
                                        >
                                            <DocumentTextIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="text-yellow-600 hover:text-yellow-800"
                                            onClick={ () => {
                                                setSelectedTag({ tag });
                                                setNewTagName(tag.tag);
                                                setSelectedTopicForTag(tag.topic?.topicId || '');
                                                setEditMode(true);
                                                setShowTagModal(true);
                                            } }
                                            title="Edit tag"
                                        >
                                            <PencilAltIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-800"
                                            onClick={ () => handleDeleteTag(tag._id, tag.tag) }
                                            title="Delete tag"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) }
                        </tbody>
                    </table>
                </div>

                { tags.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500 text-sm font-customs">
                        No tags match the current filters
                    </div>
                ) }

                {/* Pagination */ }
                { pagination.totalPages > 0 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="flex items-center space-x-2" aria-label="Pagination">
                            <button
                                onClick={ () => handlePageChange(1) }
                                disabled={ !pagination.hasPrevPage }
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                «
                            </button>
                            <button
                                onClick={ () => handlePageChange(pagination.prevPage) }
                                disabled={ !pagination.hasPrevPage }
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ‹
                            </button>

                            {/* Page number buttons */ }
                            { Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                .filter(page => {
                                    const currentPage = pagination.currentPage;
                                    return page === 1 ||
                                        page === pagination.totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1);
                                })
                                .map((page, index, array) => {
                                    if ( index > 0 && page - array[index - 1] > 1 ) {
                                        return (
                                            <React.Fragment key={ `ellipsis-${ page }` }>
                                                <span className="px-3 py-1">...</span>
                                                <button
                                                    key={ page }
                                                    onClick={ () => handlePageChange(page) }
                                                    className={ `px-3 py-1 rounded border ${
                                                        pagination.currentPage === page
                                                            ? 'bg-gray-800 text-white'
                                                            : 'hover:bg-gray-100'
                                                    }` }
                                                >
                                                    { page }
                                                </button>
                                            </React.Fragment>
                                        );
                                    }
                                    return (
                                        <button
                                            key={ page }
                                            onClick={ () => handlePageChange(page) }
                                            className={ `px-3 py-1 rounded border ${
                                                pagination.currentPage === page
                                                    ? 'bg-gray-800 text-white'
                                                    : 'hover:bg-gray-100'
                                            }` }
                                        >
                                            { page }
                                        </button>
                                    );
                                }) }

                            <button
                                onClick={ () => handlePageChange(pagination.nextPage) }
                                disabled={ !pagination.hasNextPage }
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ›
                            </button>
                            <button
                                onClick={ () => handlePageChange(pagination.totalPages) }
                                disabled={ !pagination.hasNextPage }
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                »
                            </button>
                        </nav>
                    </div>
                ) }

                {/* Pagination info */ }
                { pagination.totalItems > 0 && (
                    <div className="mt-2 text-center text-sm text-gray-500">
                        Page { pagination.currentPage } / { pagination.totalPages } | Total
                        tags: { pagination.totalItems }
                    </div>
                ) }
            </div>

            {/* Tag Details/Edit Modal */ }
            { showTagModal && selectedTag && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-0">
                    <div className="bg-white rounded-sm p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold font-customs">
                                { editMode ? 'Edit Tag' : 'Tag Details' }
                            </h2>
                            <button
                                className="text-gray-600 hover:text-gray-800"
                                onClick={ () => setShowTagModal(false) }
                            >
                                ✕
                            </button>
                        </div>

                        { editMode ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
                                    <input
                                        type="text"
                                        value={ newTagName }
                                        onChange={ e => setNewTagName(e.target.value) }
                                        className="w-full border focus:border-current rounded-md text-sm font-customs focus:ring-0 outline-none bg-gray-50 px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Topic
                                        (optional)</label>
                                    <select
                                        value={ selectedTopicForTag || '' }
                                        onChange={ e => setSelectedTopicForTag(e.target.value || null) }
                                        className="w-full border focus:border-current rounded-md text-sm font-customs focus:ring-0 outline-none bg-gray-50 px-3 py-2"
                                    >
                                        <option value="">No topic</option>
                                        { topicsList.map(topic => (
                                            <option key={ topic._id } value={ topic._id }>{ topic.topicname }</option>
                                        )) }
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-6">
                                <h3 className="text-lg font-medium">{ selectedTag.tag.tag }</h3>
                                { selectedTag.tag.topic && (
                                    <div className="mt-1 text-sm text-gray-600">
                                        Topic: { selectedTag.tag.topic.topicName }
                                    </div>
                                ) }
                                <div className="mt-2 flex space-x-4">
                                    <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                        { selectedTag.stats?.postsCount || 0 } Posts
                                    </div>
                                    <div className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                        { selectedTag.stats?.followersCount || 0 } Followers
                                    </div>
                                </div>
                            </div>
                        ) }

                        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                            { editMode ? (
                                <>
                                    <button
                                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 text-sm"
                                        onClick={ () => setEditMode(false) }
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-sm"
                                        onClick={ handleSaveTag }
                                    >
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="bg-yellow-600 text-white px-4 py-2 rounded-full hover:bg-yellow-700 text-sm"
                                        onClick={ handleEditTag }
                                    >
                                        Edit Tag
                                    </button>
                                    <button
                                        className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 text-sm"
                                        onClick={ () => handleDeleteTag(selectedTag.tag._id, selectedTag.tag.tag) }
                                    >
                                        Delete Tag
                                    </button>
                                </>
                            ) }
                        </div>
                    </div>
                </div>
            ) }

            {/* Create Tag Modal */ }
            { showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-0">
                    <div className="bg-white rounded-sm p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold font-customs">Create New Tag</h2>
                            <button
                                className="text-gray-600 hover:text-gray-800"
                                onClick={ () => setShowCreateModal(false) }
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
                                <input
                                    type="text"
                                    value={ newTagName }
                                    onChange={ e => setNewTagName(e.target.value) }
                                    placeholder="Enter tag name"
                                    className="w-full border focus:border-current rounded-md text-sm font-customs focus:ring-0 outline-none bg-gray-50 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Topic (optional)</label>
                                <select
                                    value={ selectedTopicForTag || '' }
                                    onChange={ e => setSelectedTopicForTag(e.target.value || null) }
                                    className="w-full border focus:border-current rounded-md text-sm font-customs focus:ring-0 outline-none bg-gray-50 px-3 py-2"
                                >
                                    <option value="">No topic</option>
                                    { topicsList.map(topic => (
                                        <option key={ topic._id } value={ topic._id }>{ topic.topicname }</option>
                                    )) }
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 text-sm"
                                onClick={ () => setShowCreateModal(false) }
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-sm"
                                onClick={ handleCreateTag }
                            >
                                Create Tag
                            </button>
                        </div>
                    </div>
                </div>
            ) }
        </div>
    );
}