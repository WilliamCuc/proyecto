"use client";

import React from "react";
import Image from "next/image";
import Menu from "../../components/Menu";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container">
        <div className="d-flex justify-content-center mt-2 mb-3">
          <Image
            src="/images/logos/distrito-diamante-logo.png"
            alt="Distrito Diamante CRM"
            width={200}
            height={80}
            priority
          />
        </div>
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

        <div className="row g-4">
          <div className="col-md-4 d-flex">
            <div className="card shadow mb-4 w-100">
              <div className="card-body text-center d-flex flex-column">
                <h5 className="card-title">Clientes</h5>
                <p className="card-text flex-grow-1">
                  Gestiona la información de tus clientes
                </p>
                <a href="/clientes" className="btn btn-primary mt-auto">
                  Ver Clientes
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-4 d-flex">
            <div className="card shadow mb-4 w-100">
              <div className="card-body text-center d-flex flex-column">
                <h5 className="card-title">Pólizas</h5>
                <p className="card-text flex-grow-1">
                  Administra las pólizas de seguros
                </p>
                <a href="/polizas" className="btn btn-primary mt-auto">
                  Ver Pólizas
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-4 d-flex">
            <div className="card shadow mb-4 w-100">
              <div className="card-body text-center d-flex flex-column">
                <h5 className="card-title">Seguimientos</h5>
                <p className="card-text flex-grow-1">
                  Monitorea el progreso de tus casos
                </p>
                <a href="/seguimientos" className="btn btn-primary mt-auto">
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
