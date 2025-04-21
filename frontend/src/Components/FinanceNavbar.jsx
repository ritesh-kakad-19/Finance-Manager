import React from "react";
import { Navbar, Button, Nav, Form, Dropdown } from "react-bootstrap";
import { FaSignOutAlt, FaMoon, FaSun, FaUserCircle, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FinanceNavbar = ({ darkMode, setDarkMode, loggingOut, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <Navbar
      bg={darkMode ? "dark" : "light"}
      variant={darkMode ? "dark" : "light"}
      expand="lg"
      className="px-3 py-2 shadow"
    >
      <Navbar.Brand className="fw-bold">💰 Finance Manager</Navbar.Brand>
      <Nav className="ms-auto d-flex align-items-center">
        <Form.Check
          type="switch"
          id="dark-mode-toggle"
          label={darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          className="me-3"
          onChange={() => setDarkMode(!darkMode)}
          checked={darkMode}
        />

        <Dropdown align="end" className="me-3">
          <Dropdown.Toggle variant={darkMode ? "secondary" : "light"} id="dropdown-basic">
            <FaBars />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => navigate("/profile")}>
              <FaUserCircle className="me-2" />
              Profile
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout} disabled={loggingOut}>
              <FaSignOutAlt className="me-2" />
              {loggingOut ? "Logging Out..." : "Logout"}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

export default FinanceNavbar;
