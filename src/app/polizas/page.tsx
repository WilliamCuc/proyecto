"use client";

import React, { useState, useEffect } from "react";
import { Poliza } from "../../models/Poliza";
import { PolizasService } from "../../services/polizasService";
import { getClientes } from "../../services/clientesService";
import { getAseguradoras } from "../../services/aseguradorasService";
import { Cliente } from "../../models/Cliente";
import { Aseguradora } from "../../models/Aseguradora";
import "./modal-anim.css";
import Menu from "../../components/Menu";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function PolizasPage() {
  const [polizas, setPolizas] = useState<Poliza[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [aseguradoras, setAseguradoras] = useState<Aseguradora[]>([]);
  const [tiposSeguros, setTiposSeguros] = useState<
    { id_tipo_seguro: number; nombre: string }[]
  >([]);
  const [estados, setEstados] = useState<
    { id_estado: number; nombre: string }[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPoliza, setEditingPoliza] = useState<Poliza | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [formData, setFormData] = useState({
    numero_poliza: "",
    id_cliente: 0,
    id_aseguradora: 0,
    id_tipo_seguro: 0,
    fecha_inicio: "",
    fecha_fin: "",
    monto: 0,
    id_estado: 0,
  });

  const loadPolizas = async (page: number = 1) => {
    try {
      const response = await PolizasService.getAll(page, 25);
      setPolizas(response.polizas);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error("Error loading pólizas:", error);
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

  const loadAseguradoras = async () => {
    try {
      const data = await getAseguradoras();
      setAseguradoras(data);
    } catch (error) {
      console.error("Error loading aseguradoras:", error);
    }
  };

  const loadTiposSeguros = async () => {
    try {
      const data = await PolizasService.getTiposSeguros();
      setTiposSeguros(data);
    } catch (error) {
      console.error("Error loading tipos seguros:", error);
    }
  };

  const loadEstados = async () => {
    try {
      const data = await PolizasService.getEstados();
      setEstados(data);
    } catch (error) {
      console.error("Error loading estados:", error);
    }
  };

  useEffect(() => {
    loadPolizas();
    loadClientes();
    loadAseguradoras();
    loadTiposSeguros();
    loadEstados();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("_id") || name === "monto" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPoliza) {
        await PolizasService.update(editingPoliza.id_poliza, formData);
      } else {
        await PolizasService.create(formData);
      }
      await loadPolizas(currentPage);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving póliza:", error);
    }
  };

  const handleEdit = (poliza: Poliza) => {
    setEditingPoliza(poliza);
    setFormData({
      numero_poliza: poliza.numero_poliza,
      id_cliente: poliza.id_cliente,
      id_aseguradora: poliza.id_aseguradora,
      id_tipo_seguro: poliza.id_tipo_seguro,
      fecha_inicio: poliza.fecha_inicio,
      fecha_fin: poliza.fecha_fin,
      monto: poliza.monto,
      id_estado: poliza.id_estado,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta póliza?")) {
      try {
        await PolizasService.delete(id);
        await loadPolizas(currentPage);
      } catch (error) {
        console.error("Error deleting póliza:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setModalClosing(false);
      setEditingPoliza(null);
      setFormData({
        numero_poliza: "",
        id_cliente: 0,
        id_aseguradora: 0,
        id_tipo_seguro: 0,
        fecha_inicio: "",
        fecha_fin: "",
        monto: 0,
        id_estado: 0,
      });
    }, 400); // Duración igual a la animación
  };

  const handlePageChange = (page: number) => {
    loadPolizas(page);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
    }).format(amount);
  };

  return (
    <ProtectedRoute>
      <div className="container">
        <div className="header-logo text-center mt-5 mb-3">Pólizas</div>
        <Menu />
        <div className="card shadow mb-4">
          <div className="card-body">
            <h2 className="card-title mb-4">Listado de Pólizas</h2>
            <button
              type="button"
              className="btn btn-success mb-3"
              onClick={() => setShowModal(true)}
              disabled={isLoading}
            >
              Agregar Póliza
            </button>
            <div
              className="table-responsive"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Número</th>
                    <th>Cliente</th>
                    <th>Aseguradora</th>
                    <th>Tipo de Seguro</th>
                    <th>Monto</th>
                    <th>Fecha Fin</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {polizas.map((poliza) => (
                    <tr key={poliza.id_poliza}>
                      <td>{poliza.numero_poliza}</td>
                      <td>{poliza.cliente_nombre}</td>
                      <td>{poliza.aseguradora_nombre}</td>
                      <td>{poliza.tipo_seguro_nombre}</td>
                      <td>{formatCurrency(poliza.monto)}</td>
                      <td>{poliza.fecha_fin}</td>
                      <td>
                        <span
                          className={`badge ${
                            poliza.estado_nombre === "Vigente"
                              ? "bg-success"
                              : poliza.estado_nombre === "Por Vencer"
                              ? "bg-warning"
                              : "bg-danger"
                          }`}
                        >
                          {poliza.estado_nombre}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm me-1"
                          disabled={isLoading}
                          onClick={() => handleEdit(poliza)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(poliza.id_poliza)}
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
            <nav aria-label="Paginación de pólizas">
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

        {/* Modal para crear/editar póliza */}
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
                  <h5 className="modal-title">Nueva Póliza</h5>
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
                          <label className="form-label">Número de Póliza</label>
                          <input
                            type="text"
                            className="form-control"
                            name="numero_poliza"
                            value={formData.numero_poliza}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
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
                          <label className="form-label">Aseguradora</label>
                          <select
                            className="form-select"
                            name="id_aseguradora"
                            value={formData.id_aseguradora}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Seleccionar aseguradora</option>
                            {aseguradoras.map((aseguradora) => (
                              <option
                                key={aseguradora.id_aseguradora}
                                value={aseguradora.id_aseguradora}
                              >
                                {aseguradora.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Tipo de Seguro</label>
                          <select
                            className="form-select"
                            name="id_tipo_seguro"
                            value={formData.id_tipo_seguro}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Seleccionar tipo</option>
                            {tiposSeguros.map((tipo) => (
                              <option
                                key={tipo.id_tipo_seguro}
                                value={tipo.id_tipo_seguro}
                              >
                                {tipo.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Monto</label>
                          <input
                            type="number"
                            className="form-control"
                            name="monto"
                            value={formData.monto}
                            onChange={handleInputChange}
                            step="0.01"
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Fecha de Inicio</label>
                          <input
                            type="date"
                            className="form-control"
                            name="fecha_inicio"
                            value={formData.fecha_inicio}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Fecha de Fin</label>
                          <input
                            type="date"
                            className="form-control"
                            name="fecha_fin"
                            value={formData.fecha_fin}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Estado</label>
                          <select
                            className="form-select"
                            name="id_estado"
                            value={formData.id_estado}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Seleccionar estado</option>
                            {estados.map((estado) => (
                              <option
                                key={estado.id_estado}
                                value={estado.id_estado}
                              >
                                {estado.nombre}
                              </option>
                            ))}
                          </select>
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
                      {editingPoliza ? "Actualizar" : "Crear"}
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
