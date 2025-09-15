"use client";
import React, { useEffect, useState } from "react";
import Menu from "../../components/Menu";
import {
  getUsuarios,
  addUsuario,
  updateUsuario,
  deleteUsuario,
} from "../../services/usuariosService";
import { getRoles } from "../../services/rolesService";
import { getEstadosUsuario } from "../../services/estadosUsuarioService";
import { Usuario } from "../../models/Usuario";
import { Rol } from "../../models/Rol";
import { EstadoUsuario } from "../../models/EstadoUsuario";
import "../clientes/modal-anim.css";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [estados, setEstados] = useState<EstadoUsuario[]>([]);
  const [form, setForm] = useState<
    Omit<Usuario, "id_usuario" | "fecha_creacion">
  >({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    usuario: "",
    contrasena: "",
    id_rol: 0,
    id_estado: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [editUsuario, setEditUsuario] = useState<Usuario | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;
  const totalPages = Math.ceil(usuarios.length / pageSize);
  const paginatedUsuarios = usuarios.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
    cargarEstados();
  }, []);

  async function cargarUsuarios() {
    setLoading(true);
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function cargarRoles() {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function cargarEstados() {
    try {
      const data = await getEstadosUsuario();
      setEstados(data);
    } catch (e) {
      console.error(e);
    }
  }

  const handleCloseModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setModalClosing(false);
      setEditUsuario(null);
      setForm({
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        usuario: "",
        contrasena: "",
        id_rol: 0,
        id_estado: 0,
      });
    }, 400);
  };

  const handleEditClick = (usuario: Usuario) => {
    setForm({
      primer_nombre: usuario.primer_nombre || "",
      segundo_nombre: usuario.segundo_nombre || "",
      primer_apellido: usuario.primer_apellido || "",
      segundo_apellido: usuario.segundo_apellido || "",
      usuario: usuario.usuario || "",
      contrasena: usuario.contrasena || "",
      id_rol: usuario.id_rol,
      id_estado: usuario.id_estado,
    });
    setEditUsuario(usuario);
    setShowModal(true);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editUsuario) {
        await updateUsuario(editUsuario.id_usuario, form);
      } else {
        await addUsuario({
          ...form,
          fecha_creacion: new Date().toISOString(),
        });
      }
      handleCloseModal();
      await cargarUsuarios();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleDelete(id: number) {
    setLoading(true);
    try {
      await deleteUsuario(id);
      await cargarUsuarios();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <div className="container">
      <div className="header-logo text-center mt-5 mb-3">Usuarios</div>
      <Menu />
      <div className="card shadow mb-4">
        <div className="card-body">
          <h2 className="card-title mb-4">Listado de Usuarios</h2>
          <button
            type="button"
            className="btn btn-success mb-3"
            onClick={() => setShowModal(true)}
            disabled={loading}
          >
            Agregar Usuario
          </button>
          <div
            className="table-responsive"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsuarios.map((u: Usuario) => (
                  <tr key={u.id_usuario}>
                    <td>
                      {u.primer_nombre} {u.segundo_nombre} {u.primer_apellido}{" "}
                      {u.segundo_apellido}
                    </td>
                    <td>{u.usuario}</td>
                    <td>
                      {roles.find((r) => r.id_rol === u.id_rol)?.nombre ||
                        u.id_rol}
                    </td>
                    <td>
                      {estados.find((es) => es.id_estado === u.id_estado)
                        ?.nombre || u.id_estado}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-1"
                        disabled={loading}
                        onClick={() => handleEditClick(u)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(u.id_usuario)}
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
          <nav aria-label="Paginación de usuarios">
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
      {/* Modal para crear/editar usuario */}
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
                  {editUsuario ? "Editar Usuario" : "Nuevo Usuario"}
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
                        <label className="form-label">Usuario</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.usuario}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, usuario: e.target.value }))
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                          type="password"
                          className="form-control"
                          value={form.contrasena}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              contrasena: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Rol</label>
                        <select
                          className="form-select"
                          value={form.id_rol}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              id_rol: Number(e.target.value),
                            }))
                          }
                          required
                        >
                          <option value="">Selecciona un rol</option>
                          {roles.map((r: Rol) => (
                            <option key={r.id_rol} value={r.id_rol}>
                              {r.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Estado</label>
                        <select
                          className="form-select"
                          value={form.id_estado}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              id_estado: Number(e.target.value),
                            }))
                          }
                          required
                        >
                          <option value="">Selecciona un estado</option>
                          {estados.map((es: EstadoUsuario) => (
                            <option key={es.id_estado} value={es.id_estado}>
                              {es.nombre}
                            </option>
                          ))}
                        </select>
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
