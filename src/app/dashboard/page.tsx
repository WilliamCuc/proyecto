"use client";

import React from "react";
import Menu from "../../components/Menu";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container">
        <div className="header-logo text-center mt-5 mb-3">Dashboard</div>
        <Menu />

        <div className="row">
          <div className="col-12">
            <div className="card shadow mb-4">
              <div className="card-body text-center">
                <h1 className="card-title mb-4">
                  Bienvenido, {user?.primer_nombre} {user?.primer_apellido}
                </h1>
                <p className="card-text">
                  Sistema de gestión CRM - Distrito Diamante
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="card shadow mb-4">
              <div className="card-body text-center">
                <h5 className="card-title">Clientes</h5>
                <p className="card-text">
                  Gestiona la información de tus clientes
                </p>
                <a href="/clientes" className="btn btn-primary">
                  Ver Clientes
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow mb-4">
              <div className="card-body text-center">
                <h5 className="card-title">Pólizas</h5>
                <p className="card-text">Administra las pólizas de seguros</p>
                <a href="/polizas" className="btn btn-primary">
                  Ver Pólizas
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow mb-4">
              <div className="card-body text-center">
                <h5 className="card-title">Seguimientos</h5>
                <p className="card-text">Monitorea el progreso de tus casos</p>
                <a href="/seguimientos" className="btn btn-primary">
                  Ver Seguimientos
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
