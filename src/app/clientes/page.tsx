"use client";
import React, { useEffect, useState } from "react";
import {
  getClientes,
  addCliente,
  deleteCliente,
  updateCliente, // Asegúrate de tener esta función en clientesService
} from "../../services/clientesService";
import { Cliente } from "../../models/Cliente";
import "./modal-anim.css";
import Menu from "../../components/Menu";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    documento_identificacion: "",
    correo: "",
    telefono: "",
    direccion: "",
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [editCliente, setEditCliente] = useState<Cliente | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;
  const totalPages = Math.ceil(clientes.length / pageSize);
  const paginatedClientes = clientes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    cargarClientes();
  }, []);

  async function cargarClientes() {
    setLoading(true);
    try {
      const data = await getClientes();
      setClientes(data as Cliente[]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const handleEditClick = (cliente: Cliente) => {
    setForm({
      primer_nombre: cliente.primer_nombre || "",
      segundo_nombre: cliente.segundo_nombre || "",
      primer_apellido: cliente.primer_apellido || "",
      segundo_apellido: cliente.segundo_apellido || "",
      documento_identificacion: cliente.documento_identificacion || "",
      correo: cliente.correo || "",
      telefono: cliente.telefono || "",
      direccion: cliente.direccion || "",
    });
    setEditCliente(cliente);
    setShowModal(true);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editCliente) {
        await updateCliente(editCliente.id_cliente, {
          ...form,
          fecha_registro: editCliente.fecha_registro,
        });
      } else {
        await addCliente({
          ...form,
          fecha_registro: new Date().toISOString(),
        });
      }
      setForm({
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        documento_identificacion: "",
        correo: "",
        telefono: "",
        direccion: "",
      });
      setEditCliente(null);
      setShowModal(false);
      await cargarClientes();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleDelete(id: number) {
    setLoading(true);
    try {
      await deleteCliente(id);
      await cargarClientes();
    } catch (e) {
      // Manejo de error
      console.error(e);
    }
    setLoading(false);
  }

  const handleCloseModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setModalClosing(false);
    }, 400); // Duración igual a la animación
  };

  return (
    <div className="container">
      <div className="header-logo text-center mt-5 mb-3">Clientes</div>
      <Menu />
      <div className="card shadow mb-4">
        <div className="card-body">
          <h2 className="card-title mb-4">Listado de Clientes</h2>
          <button
            type="button"
            className="btn btn-success mb-3"
            onClick={() => setShowModal(true)}
            disabled={loading}
          >
            Agregar Cliente
          </button>
          <div
            className="table-responsive"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClientes.map((c: Cliente) => (
                  <tr key={c.id_cliente}>
                    <td>
                      {c.primer_nombre} {c.segundo_nombre} {c.primer_apellido}{" "}
                      {c.segundo_apellido}
                    </td>
                    <td>{c.correo}</td>
                    <td>{c.telefono}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-1"
                        disabled={loading}
                        onClick={() => handleEditClick(c)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(c.id_cliente)}
                        disabled={loading}
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
          <nav aria-label="Paginación de clientes">
            <ul className="pagination justify-content-center">
              <li
                className={`page-item${currentPage === 1 ? " disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
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
                    onClick={() => setCurrentPage(i + 1)}
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
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {/* Modal para crear nuevo cliente */}
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
                <h5 className="modal-title">Nuevo Cliente</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Cerrar"
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    handleSubmit(e);
                    handleCloseModal();
                  }}
                >
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Primer Nombre</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.primer_nombre}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              primer_nombre: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Segundo Nombre</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.segundo_nombre}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              segundo_nombre: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Primer Apellido</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.primer_apellido}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              primer_apellido: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Segundo Apellido</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.segundo_apellido}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              segundo_apellido: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Documento</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.documento_identificacion}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              documento_identificacion: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={form.correo}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, correo: e.target.value }))
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Teléfono</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.telefono}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, telefono: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Dirección</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.direccion}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              direccion: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    Guardar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
