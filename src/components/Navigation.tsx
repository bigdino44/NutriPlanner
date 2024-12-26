import React from 'react';
import { NavLink } from './NavLink';
import { Home, Apple, Calendar, ShoppingCart, Settings } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="flex space-x-4">
      <NavLink to="/" icon={<Home className="w-4 h-4" />}>
        Dashboard
      </NavLink>
      <NavLink to="/preferences" icon={<Apple className="w-4 h-4" />}>
        Preferences
      </NavLink>
      <NavLink to="/meal-plans" icon={<Calendar className="w-4 h-4" />}>
        Meal Plans
      </NavLink>
      <NavLink to="/shopping" icon={<ShoppingCart className="w-4 h-4" />}>
        Shopping List
      </NavLink>
      <NavLink to="/settings" icon={<Settings className="w-4 h-4" />}>
        Settings
      </NavLink>
    </nav>
  );
}