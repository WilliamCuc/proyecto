import React, { useEffect } from "react";
import {
  FaHome,
  FaUsers,
  FaFileAlt,
  FaBuilding,
  FaUserCog,
  FaBell,
  FaChartBar,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";

export default function Menu() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary rounded mb-4">
      <div className="container-fluid">
        <ul className="navbar-nav mb-2 mb-lg-0">
          <li className="nav-item">
            <a className="nav-link d-flex align-items-center" href="/dashboard">
              <FaHome className="me-2" /> <span>Dashboard</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link d-flex align-items-center" href="/clientes">
              <FaUsers className="me-2" /> <span>Clientes</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link d-flex align-items-center" href="/polizas">
              <FaFileAlt className="me-2" /> <span>Pólizas</span>
            </a>
          </li>
          {/* Dropdown de mantenimiento */}
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle d-flex align-items-center"
              href="#"
              id="mantenimientoDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaUserCog className="me-2" /> <span>Mantenimiento</span>
            </a>
            <ul
              className="dropdown-menu"
              aria-labelledby="mantenimientoDropdown"
            >
              <li>
                <a
                  className="dropdown-item d-flex align-items-center"
                  href="/usuarios"
                >
                  <FaUsers className="me-2" /> <span>Administrar Usuarios</span>
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item d-flex align-items-center"
                  href="/aseguradoras"
                >
                  <FaBuilding className="me-2" />{" "}
                  <span>Administrar Aseguradoras</span>
                </a>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <a
              className="nav-link d-flex align-items-center"
              href="/seguimientos"
            >
              <FaClipboardList className="me-2" /> <span>Seguimientos</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link d-flex align-items-center" href="/alertas">
              <FaBell className="me-2" /> <span>Alertas</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link d-flex align-items-center" href="/reportes">
              <FaChartBar className="me-2" /> <span>Reportes</span>
            </a>
          </li>
          <li className="nav-item ms-auto">
            <a className="nav-link d-flex align-items-center" href="/login">
              <FaSignOutAlt className="me-2" /> <span>Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
