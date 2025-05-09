import React from "react";
import { useSnapshot } from "valtio";
import { UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import state from "../../Utils/Store";

const LeftMenu = () => {
  const snap = useSnapshot(state);
  
  const handleClick = (index) => {
    state.activeIndex = index;
  };
  
  return (
    <div className="left-menu">
      <div className="left-menu-header">
        <div className="nav__logo">
          <Link to="/">
            <UtensilsCrossed className="logo__icon" size={36} />
            <h1 className="logo__text">Cook<span>Mate</span></h1>
          </Link>
        </div>
      </div>
      <ul className="left-menu-list">
        {[
          "Explore",
          "Cooking Goals",
          "Progress Tracker",
          "Friends",
          "Alerts",
        ].map((item, index) => (
          <li
            key={index}
            onClick={() => handleClick(index + 1)}
            className={`left-menu-item ${snap.activeIndex === index + 1 ? "active" : ""}`}
          >
            <a href="#" className="left-menu-link">
              {item}
            </a>
            {snap.activeIndex === index + 1 && (
              <div className="left-menu-active-indicator" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftMenu;