"use client";
import React, { useEffect, useState } from "react";
import {
  getAseguradoras,
  addAseguradora,
  updateAseguradora,
  deleteAseguradora,
} from "../../services/aseguradorasService";
import { Aseguradora } from "../../models/Aseguradora";
import "../clientes/modal-anim.css";
import Menu from "../../components/Menu";

export default function AseguradorasPage() {
  const [aseguradoras, setAseguradoras] = useState<Aseguradora[]>([]);
  const [form, setForm] = useState<Omit<Aseguradora, "id_aseguradora">>({
    nombre: "",
    contacto_nombre: "",
    telefono: "",
    correo: "",
    direccion: "",
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [editAseguradora, setEditAseguradora] = useState<Aseguradora | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;
  const totalPages = Math.ceil(aseguradoras.length / pageSize);
  const paginatedAseguradoras = aseguradoras.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    cargarAseguradoras();
  }, []);

  async function cargarAseguradoras() {
    setLoading(true);
    try {
      const data = await getAseguradoras();
      setAseguradoras(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const handleCloseModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setModalClosing(false);
      setEditAseguradora(null);
      setForm({
        nombre: "",
        contacto_nombre: "",
        telefono: "",
        correo: "",
        direccion: "",
      });
    }, 400);
  };

  const handleEditClick = (aseguradora: Aseguradora) => {
    setForm({
      nombre: aseguradora.nombre || "",
      contacto_nombre: aseguradora.contacto_nombre || "",
      telefono: aseguradora.telefono || "",
      correo: aseguradora.correo || "",
      direccion: aseguradora.direccion || "",
    });
    setEditAseguradora(aseguradora);
    setShowModal(true);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editAseguradora) {
        await updateAseguradora(editAseguradora.id_aseguradora, form);
      } else {
        await addAseguradora(form);
      }
      handleCloseModal();
      await cargarAseguradoras();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleDelete(id: number) {
    setLoading(true);
    try {
      await deleteAseguradora(id);
      await cargarAseguradoras();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <div className="container">
      <div className="header-logo text-center mt-5 mb-3">Aseguradoras</div>
      <Menu />
      <div className="card shadow mb-4">
        <div className="card-body">
          <h2 className="card-title mb-4">Listado de Aseguradoras</h2>
          <button
            type="button"
            className="btn btn-success mb-3"
            onClick={() => setShowModal(true)}
            disabled={loading}
          >
            Agregar Aseguradora
          </button>
          <div
            className="table-responsive"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Contacto</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Dirección</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAseguradoras.map((a: Aseguradora) => (
                  <tr key={a.id_aseguradora}>
                    <td>{a.nombre}</td>
                    <td>{a.contacto_nombre}</td>
                    <td>{a.telefono}</td>
                    <td>{a.correo}</td>
                    <td>{a.direccion}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-1"
                        disabled={loading}
                        onClick={() => handleEditClick(a)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(a.id_aseguradora)}
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
          <nav aria-label="Paginación de aseguradoras">
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
      {/* Modal para crear/editar aseguradora */}
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
                <h5 className="modal-title">
                  {editAseguradora ? "Editar Aseguradora" : "Nueva Aseguradora"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Cerrar"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.nombre}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, nombre: e.target.value }))
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Contacto</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.contacto_nombre}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              contacto_nombre: e.target.value,
                            }))
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
                    <div className="col-12">
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
                          required
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
