import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { authService } from "@/services/api/authService";

const Header = ({ onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [availableUsers, setAvailableUsers] = useState([]);
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setShowUserMenu(false);
};

  const handleSwitchUser = (userId) => {
    try {
      const user = authService.switchUser(userId);
      setCurrentUser(user);
      toast.success(`Switched to ${user.name}`);
      setShowUserSelector(false);
      setShowUserMenu(false);
      // Refresh the page to update all components with new user context
      window.location.reload();
    } catch (error) {
      toast.error('Failed to switch user');
    }
  };

  const toggleUserSelector = () => {
    if (!showUserSelector) {
      // Load available users when opening selector
      const users = authService.getAllUsers().filter(user => user.Id !== currentUser?.Id);
      setAvailableUsers(users);
    }
    setShowUserSelector(!showUserSelector);
  };

const navigationItems = [
    { name: "Recipes", path: "/", icon: "BookOpen" },
    { name: "Add Recipe", path: "/add-recipe", icon: "Plus" },
    { name: "Categories", path: "/categories", icon: "Tags" },
    { name: "Shopping List", path: "/shopping-list", icon: "ShoppingCart" }
  ];

  const isActivePath = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="ChefHat" size={24} className="text-white" />
            </div>
<h1 className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Family Flavor Vault
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActivePath(item.path)
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <ApperIcon name={item.icon} size={18} />
                {item.name}
              </button>
            ))}
</nav>

          {/* Search Bar - Desktop */}
          {location.pathname === "/" && (
            <div className="hidden md:block w-80">
              <SearchBar
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search recipes, ingredients..."
              />
            </div>
          )}

          {/* User Profile - Desktop */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {currentUser.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser.name}
                  </span>
                  <ApperIcon 
                    name={showUserMenu ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                    className="text-gray-500" 
                  />
                </button>

{showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={toggleUserSelector}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <ApperIcon name="Users" size={14} />
                      Switch User
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <ApperIcon name="LogOut" size={14} />
                      Sign Out
                    </button>
                  </div>
                )}

                {/* User Selector Modal */}
                {showUserSelector && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Select User</p>
                      <p className="text-xs text-gray-500">Choose a user to switch to</p>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {availableUsers.map((user) => (
                        <button
                          key={user.Id}
                          onClick={() => handleSwitchUser(user.Id)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <button
                        onClick={() => setShowUserSelector(false)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Mobile Menu Button */}
{/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {currentUser && (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {currentUser.name.charAt(0)}
                </span>
              </div>
            )}
            <button
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {location.pathname === "/" && (
          <div className="md:hidden pb-4">
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search recipes, ingredients..."
            />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActivePath(item.path)
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <ApperIcon name={item.icon} size={20} />
                {item.name}
              </button>
            ))}
</nav>

          {/* Mobile User Section */}
{currentUser && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {currentUser.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>
              </div>
              
              <div className="px-4 space-y-1">
                <button
                  onClick={toggleUserSelector}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-lg"
                >
                  <ApperIcon name="Users" size={16} />
                  Switch User
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-lg"
                >
                  <ApperIcon name="LogOut" size={16} />
                  Sign Out
                </button>
              </div>

              {/* Mobile User Selector */}
              {showUserSelector && (
                <div className="mt-3 mx-4 bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900 mb-2">Select User</p>
                  <div className="space-y-2">
                    {availableUsers.map((user) => (
                      <button
                        key={user.Id}
                        onClick={() => handleSwitchUser(user.Id)}
                        className="w-full text-left p-2 hover:bg-white rounded-lg flex items-center gap-3 transition-colors"
                      >
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowUserSelector(false)}
                    className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;