import React, { useEffect, useState, useRef } from 'react';
import type { EventItem } from '../types/event';
import { motion } from "framer-motion";

interface Props {
  event?: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<EventItem, "id">, id?: string) => void;
  onDelete?: (id: string) => void;
}

// Converte Date para string "YYYY-MM-DDTHH:mm" para input datetime-local
function toBrazilInput(date: Date) {
  const tzOffset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - tzOffset * 60000);
  return localDate.toISOString().slice(0, 16);
}

// Converte string "YYYY-MM-DDTHH:mm" do input para Date de forma segura
function fromBrazilInput(value: string) {
  if (!value) return new Date();
  const parts = value.split("T");
  if (parts.length !== 2) return new Date();
  const [datePart, timePart] = parts;
  const dateSegments = datePart.split("-");
  const timeSegments = timePart.split(":");
  if (dateSegments.length !== 3 || timeSegments.length !== 2) return new Date();
  const [year, month, day] = dateSegments.map(Number);
  const [hour, minute] = timeSegments.map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

const EventModal: React.FC<Props> = ({ event, isOpen, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const modalRef = useRef<HTMLDivElement>(null);

  // Atualiza campos quando o evento muda
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setStartDate(toBrazilInput(new Date(event.startDate)));
      setEndDate(toBrazilInput(new Date(event.endDate)));
      setLocation(event.location || "");
      setDescription(event.description || "");
      setStatus(event.status || "");
    } else {
      const now = new Date();
      setTitle("");
      setStartDate(toBrazilInput(now));
      const defaultEnd = new Date(now.getTime() + 60 * 60 * 1000);
      setEndDate(toBrazilInput(defaultEnd));
      setLocation("");
      setDescription("");
      setStatus("");
    }
    setErrors({});
    setTouched({});
  }, [event, isOpen]);

  // Validação dinâmica
  useEffect(() => {
    const newErrors: { [key: string]: string } = {};
    const start = fromBrazilInput(startDate);
    const end = fromBrazilInput(endDate);

    if (touched.title && !title.trim()) newErrors.title = "Título obrigatório";
    if (touched.startDate && start > end) newErrors.endDate = "Data final não pode ser antes da inicial";
    else if (touched.endDate && (end.getTime() - start.getTime()) / 60000 < 15) newErrors.endDate = "Duração mínima é de 15 minutos";

    setErrors(newErrors);
  }, [title, startDate, endDate, touched]);

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Marca todos os campos como tocados
    setTouched({ title: true, startDate: true, endDate: true });

    // Valida novamente diretamente
    const start = fromBrazilInput(startDate);
    const end = fromBrazilInput(endDate);
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "Título obrigatório";
    if (start > end) newErrors.endDate = "Data final não pode ser antes da inicial";
    else if ((end.getTime() - start.getTime()) / 60000 < 15) newErrors.endDate = "Duração mínima é de 15 minutos";

    setErrors(newErrors);

    // Se houver erros, não salva
    if (Object.keys(newErrors).length) return;

    onSave(
        {
        title,
        startDate: start,
        endDate: end,
        location,
        description,
        status: status,
        userId: 1,
        },
        event?.id
    );
    onClose();
    };

  const handleDelete = () => {
    if (!event || !onDelete) return;
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      onDelete(event.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => modalRef.current && !modalRef.current.contains(e.target as Node) && onClose()}
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
      >
        <h2 className="text-xl font-bold mb-4">
          {event?.id ? "Editar Evento" : "Novo Evento"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, title: true }))}
              className={`w-full border rounded-lg p-2 ${errors.title ? "border-red-500" : ""}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Início *</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, startDate: true }))}
              className={`w-full border rounded-lg p-2 ${errors.startDate ? "border-red-500" : ""}`}
            />
            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Fim *</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, endDate: true }))}
              className={`w-full border rounded-lg p-2 ${errors.endDate ? "border-red-500" : ""}`}
            />
            {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Local</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-2 resize-none"
              rows={3}
            />
            <label className="block text-sm font-medium">Status</label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancelar
            </button>

            {event?.id && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Excluir
              </button>
            )}

            <button
              type="submit"
              disabled={Object.keys(errors).length > 0}
              className={`px-4 py-2 rounded-lg text-white ${Object.keys(errors).length > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              Salvar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EventModal;
