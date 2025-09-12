import type { EventItem } from '../api/events';
import React, { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  events: EventItem[];
  onCreate: () => void;
  onEdit: (event: EventItem) => void;
  onDelete: (id: string) => void;
}

const EventList: React.FC<Props> = ({ events, onCreate, onEdit, onDelete }) => {
  // Agrupar eventos por mês/ano
  const grouped = events.reduce((acc, event) => {
    const month = new Date(event.startDate).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) acc[month] = [];
    acc[month].push(event);
    return acc;
  }, {} as Record<string, EventItem[]>);

  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({});

  const toggleMonth = (month: string) => {
    setOpenMonths((prev) => ({ ...prev, [month]: !prev[month] }));
  };

  const handleDelete = (event: EventItem) => {
    if (confirm(`Tem certeza que deseja excluir "${event.title}"?`)) {
      onDelete(event.id);
    }
  };

  return (
    <div className="space-y-6">

      {/* Listagem por meses */}
      {Object.entries(grouped).map(([month, events]) => (
        <div
          key={month}
          className="border rounded-xl shadow-sm bg-white overflow-hidden"
        >
          {/* Cabeçalho do mês */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
            <button
              onClick={() => toggleMonth(month)}
              className="flex items-center justify-between w-full font-semibold text-lg text-left"
            >
              <span>{month}</span>
              <motion.div
                animate={{ rotate: openMonths[month] ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </motion.div>
            </button>
            {/* Botão para criar novo evento nesse mês */}
            <button
              onClick={onCreate}
              className="ml-3 p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
              title="Adicionar evento neste mês"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Lista de eventos animada */}
          <AnimatePresence initial={false}>
            {openMonths[month] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                {events.length > 0 ? (
                  <ul className="divide-y">
                    {events.map((event) => (
                      <li
                        key={event.id}
                        className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer"
                        onClick={() => onEdit(event)}
                      >
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(event.startDate).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}{" "}
                            -{" "}
                            {new Date(event.endDate).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                          {event.location && (
                            <p className="text-sm text-gray-400">
                              📍 {event.location}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(event);
                          }}
                          className="p-2 rounded-full text-red-500 hover:bg-red-50 transition"
                          title="Excluir evento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    Nenhum evento neste mês
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default EventList;