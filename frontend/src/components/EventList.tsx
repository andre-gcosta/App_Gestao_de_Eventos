import type { EventItem } from '../api/events';
import React from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEventList } from "../hooks/useEventList";

interface Props {
  events: EventItem[];
  onCreate: (defaultDate?: Date) => void;
  onEdit: (event: EventItem) => void;
  onDelete: (id: string) => void;
}

const EventList: React.FC<Props> = ({ events, onCreate, onEdit, onDelete }) => {
  const { groupedEvents, openMonths, toggleMonth, getFirstDayOfMonth, formatMonthLabel } =
    useEventList(events);

  const handleDelete = (event: EventItem) => {
    if (confirm(`Tem certeza que deseja excluir "${event.title}"?`)) {
      onDelete(event.id);
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents).map(([monthKey, events]) => {
        const monthLabel = formatMonthLabel(monthKey);
        const baseDate = getFirstDayOfMonth(monthKey);

        return (
          <div key={monthKey} className="border rounded-xl shadow-sm bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
              <button
                onClick={() => toggleMonth(monthKey)}
                className="flex items-center justify-between w-full font-semibold text-lg text-left"
              >
                <span>{monthLabel}</span>
                <motion.div
                  animate={{ rotate: openMonths[monthKey] ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                </motion.div>
              </button>

              <button
                onClick={() => onCreate(baseDate)}
                className="ml-3 p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                title="Adicionar evento neste mês"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <AnimatePresence initial={false}>
              {openMonths[monthKey] && (
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
                              {new Date(event.startDate).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              -{" "}
                              {new Date(event.endDate).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            {event.location && (
                              <p className="text-sm text-gray-400">📍 {event.location}</p>
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
        );
      })}
    </div>
  );
};

export default EventList;
