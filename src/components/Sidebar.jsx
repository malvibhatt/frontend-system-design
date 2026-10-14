import { NavLink } from "react-router-dom";
import { nav } from "../routes.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand">
        <p className="brand-title">Frontend System Design</p>
        <p className="brand-sub">A practical field guide</p>
      </NavLink>

      {nav.map((group) => (
        <nav className="nav-group" key={group.group}>
          <div className="nav-label">{group.group}</div>
          {group.items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            >
              <span className="nav-num">{item.num}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      ))}

      <ThemeToggle />
    </aside>
  );
}
