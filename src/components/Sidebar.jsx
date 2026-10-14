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
          {group.items.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                <span className="nav-num">{item.num}</span>
                <span>{item.label}</span>
                <span className="nav-ext" aria-label="opens in a new tab">↗</span>
              </a>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >
                <span className="nav-num">{item.num}</span>
                <span>{item.label}</span>
              </NavLink>
            )
          )}
        </nav>
      ))}

      <ThemeToggle />
    </aside>
  );
}
