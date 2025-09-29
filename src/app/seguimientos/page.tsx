"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Seguimiento } from "../../models/Seguimiento";
import { SeguimientosService } from "../../services/seguimientosService";
import { getClientes } from "../../services/clientesService";
import { Cliente } from "../../models/Cliente";
import "./modal-anim.css";
import Menu from "../../components/Menu";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";

export default function SeguimientosPage() {
  const { user } = useAuth();
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [isLoading] = useState(false);
  const [editingSeguimiento, setEditingSeguimiento] =
    useState<Seguimiento | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [total, setTotal] = useState(0);

  const [formData, setFormData] = useState({
    id_cliente: 0,
    id_usuario: user?.id_usuario || 1, // Usuario autenticado
    fecha: new Date().toISOString().slice(0, 16), // formato datetime-local
    nota: "",
  });

  const loadSeguimientos = async (page: number = 1) => {
    try {
      const response = await SeguimientosService.getAll(page, 25);
      setSeguimientos(response.seguimientos);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error("Error loading seguimientos:", error);
    }
  };

  const loadClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error("Error loading clientes:", error);
    }
  };

  useEffect(() => {
    loadSeguimientos();
    loadClientes();
  }, []);

  // Actualizar el usuario en formData cuando se carga
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        id_usuario: user.id_usuario,
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "id_cliente" || name === "id_usuario" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSeguimiento) {
        await SeguimientosService.update(
          editingSeguimiento.id_seguimiento,
          formData
        );
      } else {
        await SeguimientosService.create(formData);
      }
      await loadSeguimientos(currentPage);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving seguimiento:", error);
    }
  };

  const handleEdit = (seguimiento: Seguimiento) => {
    setEditingSeguimiento(seguimiento);
    setFormData({
      id_cliente: seguimiento.id_cliente,
      id_usuario: seguimiento.id_usuario,
      fecha: seguimiento.fecha.slice(0, 16), // Formato para datetime-local
      nota: seguimiento.nota,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Está seguro de eliminar este seguimiento?")) {
      try {
        await SeguimientosService.delete(id);
        await loadSeguimientos(currentPage);
      } catch (error) {
        console.error("Error deleting seguimiento:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setModalClosing(false);
      setEditingSeguimiento(null);
      setFormData({
        id_cliente: 0,
        id_usuario: user?.id_usuario || 1,
        fecha: new Date().toISOString().slice(0, 16),
        nota: "",
      });
    }, 400); // Duración igual a la animación
  };

  const handlePageChange = (page: number) => {
    loadSeguimientos(page);
  };

  const formatDateTime = (datetime: string) => {
    return new Date(datetime).toLocaleString("es-GT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        <div className="card shadow mb-4">
          <div className="card-body">
            <h2 className="card-title mb-4">Listado de Seguimientos</h2>
            <button
              type="button"
              className="btn btn-success mb-3"
              onClick={() => setShowModal(true)}
              disabled={isLoading}
            >
              Agregar Seguimiento
            </button>
            <div
              className="table-responsive"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Cliente</th>
                    <th>Usuario</th>
                    <th>Fecha</th>
                    <th>Nota</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {seguimientos.map((seguimiento) => (
                    <tr key={seguimiento.id_seguimiento}>
                      <td>{seguimiento.cliente_nombre}</td>
                      <td>{seguimiento.usuario_nombre}</td>
                      <td>{formatDateTime(seguimiento.fecha)}</td>
                      <td>
                        <div
                          style={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {seguimiento.nota}
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm me-1"
                          disabled={isLoading}
                          onClick={() => handleEdit(seguimiento)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDelete(seguimiento.id_seguimiento)
                          }
                          disabled={isLoading}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <nav aria-label="Paginación de seguimientos">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item${currentPage === 1 ? " disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &laquo;
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item${
                      currentPage === i + 1 ? " active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item${
                    currentPage === totalPages ? " disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Modal para crear/editar seguimiento */}
        {showModal && (
          <div
            className={`modal fade show d-block animate-modal${
              modalClosing ? " animate-modal-close" : ""
            }`}
            tabIndex={-1}
            role="dialog"
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Nuevo Seguimiento</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                    aria-label="Cerrar"
                  ></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Cliente</label>
                          <select
                            className="form-select"
                            name="id_cliente"
                            value={formData.id_cliente}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Seleccionar cliente</option>
                            {clientes.map((cliente) => (
                              <option
                                key={cliente.id_cliente}
                                value={cliente.id_cliente}
                              >
                                {cliente.primer_nombre}{" "}
                                {cliente.primer_apellido}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Fecha y Hora</label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Nota</label>
                          <textarea
                            className="form-control"
                            name="nota"
                            rows={4}
                            value={formData.nota}
                            onChange={handleInputChange}
                            placeholder="Descripción del seguimiento..."
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingSeguimiento ? "Actualizar" : "Crear"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
