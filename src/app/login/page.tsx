"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    usuario: "",
    contrasena: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  // Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Limpiar error al escribir
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(formData.usuario, formData.contrasena);

      if (success) {
        // Login exitoso - redirigir inmediatamente
        router.replace("/dashboard");
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      setError("Error de conexión");
      console.error("Error en login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background:
          "linear-gradient(135deg, #0a4c86 0%, #1a5c96 50%, #0a4c86 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div
              className="card shadow-lg border-0"
              style={{ borderRadius: "15px" }}
            >
              <div
                className="card-body p-5"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.98)" }}
              >
                <div className="text-center mb-4">
                  <div className="d-flex justify-content-center mb-3">
                    <Image
                      src="/images/logos/distrito-diamante-logo.png"
                      alt="Distrito Diamante CRM"
                      width={400}
                      height={160}
                      priority
                    />
                  </div>
                </div>

                {error && (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    {error}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError("")}
                      aria-label="Close"
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="usuario" className="form-label">
                      Usuario
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="usuario"
                      name="usuario"
                      value={formData.usuario}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      placeholder="Ingrese su usuario"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="contrasena" className="form-label">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="contrasena"
                      name="contrasena"
                      value={formData.contrasena}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      placeholder="Ingrese su contraseña"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    © 2024 Distrito Diamante. Todos los derechos reservados.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
