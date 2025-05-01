const handleLogout = () => {
    removeToken();
    navigate('/login');
};