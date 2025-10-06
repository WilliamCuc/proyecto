"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Recordatorio } from "../../models/Recordatorio";
import { recordatoriosService } from "../../services/recordatoriosService";
import { Poliza } from "../../models/Poliza";
import { PolizasService } from "../../services/polizasService";
import "./modal-anim.css";
import Menu from "../../components/Menu";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function RecordatoriosPage() {
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [polizas, setPolizas] = useState<Poliza[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [isLoading] = useState(false);
  const [editingRecordatorio, setEditingRecordatorio] =
    useState<Recordatorio | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [total, setTotal] = useState(0);

  const [formData, setFormData] = useState({
    id_poliza: 0,
    dias_antes: 30,
    enviado: false,
    fecha_envio: null as string | null,
  });

  const loadRecordatorios = async (page: number = 1) => {
    try {
      const response = await recordatoriosService.getAll(page, 25);
      setRecordatorios(response.recordatorios);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error("Error loading recordatorios:", error);
    }
  };

  const loadPolizas = async () => {
    try {
      const response = await PolizasService.getAll(1, 1000);
      setPolizas(response.polizas);
    } catch (error) {
      console.error("Error loading polizas:", error);
    }
  };

  useEffect(() => {
    loadRecordatorios();
    loadPolizas();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "id_poliza" || name === "dias_antes"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRecordatorio) {
        await recordatoriosService.update(
          editingRecordatorio.id_recordatorio,
          formData
        );
      } else {
        await recordatoriosService.create(formData);
      }
      await loadRecordatorios(currentPage);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving recordatorio:", error);
    }
  };

  const handleEdit = (recordatorio: Recordatorio) => {
    setEditingRecordatorio(recordatorio);
    setFormData({
      id_poliza: recordatorio.id_poliza,
      dias_antes: recordatorio.dias_antes,
      enviado: recordatorio.enviado,
      fecha_envio: recordatorio.fecha_envio,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Está seguro de eliminar este recordatorio?")) {
      try {
        await recordatoriosService.delete(id);
        await loadRecordatorios(currentPage);
      } catch (error) {
        console.error("Error deleting recordatorio:", error);
      }
    }
  };

  const handleMarkAsSent = async (id: number) => {
    try {
      await recordatoriosService.markAsSent(id);
      await loadRecordatorios(currentPage);
    } catch (error) {
      console.error("Error marking as sent:", error);
    }
  };

  const handleCloseModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setModalClosing(false);
      setEditingRecordatorio(null);
      setFormData({
        id_poliza: 0,
        dias_antes: 30,
        enviado: false,
        fecha_envio: null,
      });
    }, 400);
  };

  const handlePageChange = (page: number) => {
    loadRecordatorios(page);
  };

  const formatDateTime = (datetime: string | null) => {
    if (!datetime) return "No enviado";
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
        <div className="d-flex justify-content-center mt-5 mb-3">
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
            <h2 className="card-title mb-4">Listado de Recordatorios</h2>
            <button
              type="button"
              className="btn btn-success mb-3"
              onClick={() => setShowModal(true)}
              disabled={isLoading}
            >
              Agregar Recordatorio
            </button>
            <div
              className="table-responsive"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Póliza</th>
                    <th>Cliente</th>
                    <th>Días Antes</th>
                    <th>Estado</th>
                    <th>Fecha Envío</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {recordatorios.map((recordatorio) => (
                    <tr key={recordatorio.id_recordatorio}>
                      <td>{recordatorio.poliza_numero}</td>
                      <td>{recordatorio.cliente_nombre}</td>
                      <td>{recordatorio.dias_antes} días</td>
                      <td>
                        <span
                          className={`badge ${
                            recordatorio.enviado
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {recordatorio.enviado ? "Enviado" : "Pendiente"}
                        </span>
                      </td>
                      <td>{formatDateTime(recordatorio.fecha_envio)}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm me-1"
                          disabled={isLoading}
                          onClick={() => handleEdit(recordatorio)}
                        >
                          Editar
                        </button>
                        {!recordatorio.enviado && (
                          <button
                            className="btn btn-info btn-sm me-1"
                            onClick={() =>
                              handleMarkAsSent(recordatorio.id_recordatorio)
                            }
                            disabled={isLoading}
                          >
                            Marcar Enviado
                          </button>
                        )}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDelete(recordatorio.id_recordatorio)
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
            <nav aria-label="Paginación de recordatorios">
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

        {/* Modal para crear/editar recordatorio */}
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
                    {editingRecordatorio ? "Editar" : "Nuevo"} Recordatorio
                  </h5>
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
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Póliza</label>
                          <select
                            className="form-select"
                            name="id_poliza"
                            value={formData.id_poliza}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Seleccionar póliza</option>
                            {polizas.map((poliza) => (
                              <option
                                key={poliza.id_poliza}
                                value={poliza.id_poliza}
                              >
                                {poliza.numero_poliza} - {poliza.cliente_nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Días Antes del Vencimiento
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="dias_antes"
                            value={formData.dias_antes}
                            onChange={handleInputChange}
                            min="1"
                            max="365"
                            required
                          />
                          <div className="form-text">
                            Número de días antes del vencimiento para enviar el
                            recordatorio
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3 form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="enviado"
                            checked={formData.enviado}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label">
                            Marcar como enviado
                          </label>
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
                      {editingRecordatorio ? "Actualizar" : "Crear"}
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
