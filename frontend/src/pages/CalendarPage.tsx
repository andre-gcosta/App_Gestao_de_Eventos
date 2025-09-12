import React, { useState } from "react";
import DayView from "../components/Calendar/DayView";
import WeekView from "../components/Calendar/WeekView";
import MonthView from "../components/Calendar/MonthView";
import EventList from "../components/EventList";
import EventModal from "../components/EventModal";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, LogOut } from "lucide-react";

import type { EventItem } from "../types/event";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import { useCalendarDate } from "../hooks/useCalendarDate";
import type { ViewMode } from "../hooks/useCalendarDate";
import { useAuth } from "../auth/AuthContext";
import { redirect } from "react-router-dom";

const CalendarPage: React.FC = () => {
  const { events, addEvent, editEvent, removeEvent } = useCalendarEvents();
  const { currentDate, view, setView, handlePrev, handleNext, handleToday, getTitle } = useCalendarDate("month");

  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = (date?: Date) => {
    const now = date ? new Date(date) : new Date();
    const startDate = new Date(now);
    if (!date) startDate.setMinutes(0, 0, 0);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    setSelectedEvent({
      title: "",
      startDate,
      endDate,
      location: "",
      status: "",
      //userId: 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (event: EventItem) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Omit<EventItem, "id">, id?: string) => {
    try {
      if (id && selectedEvent?.id) await editEvent(id, data);
      else await addEvent(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;
    try {
      await removeEvent(id);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
    }
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-col flex-1 gap-4 p-4 sm:p-6 max-w-screen-2xl w-full mx-auto">
        {/* Header sticky */}
        <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-gray-200 flex flex-wrap justify-between items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-lg">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold">Meus Eventos</h1>
            {view !== "list" && (
              <div className="flex items-center gap-1 sm:gap-2">
                <button onClick={handlePrev} className="p-1 sm:p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleToday}
                  className="px-2 sm:px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs sm:text-sm font-medium"
                >
                  Hoje
                </button>
                <button onClick={handleNext} className="p-1 sm:p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                  <ChevronRight size={18} />
                </button>
                <h2 className="ml-2 sm:ml-4 text-sm sm:text-xl font-semibold">{getTitle()}</h2>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {(["month", "week", "day", "list"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setView(mode)}
                className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition ${
                  view === mode ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {mode === "month" && "Mês"}
                {mode === "week" && "Semana"}
                {mode === "day" && "Dia"}
                {mode === "list" && "Lista"}
              </button>
            ))}
            <button
              onClick={() => handleCreate()}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 text-xs sm:text-sm font-medium"
            >
              <CalendarIcon size={16} />
              Novo Evento
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs sm:text-sm font-medium"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>

        {/* Conteúdo scrollable */}
        <div className="flex-1 overflow-auto relative bg-white rounded-lg shadow p-2 sm:p-4">
          <AnimatePresence mode="wait">
            {view === "month" && (
              <MonthView
                events={events}
                currentDate={currentDate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCreate={handleCreate}
                showLocationIcon
              />
            )}
            {view === "week" && (
              <WeekView
                events={events}
                currentDate={currentDate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCreate={handleCreate}
              />
            )}
            {view === "day" && (
              <DayView
                events={events}
                currentDate={currentDate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCreate={handleCreate}
              />
            )}
            {view === "list" && (
              <EventList events={events} onEdit={handleEdit} onDelete={handleDelete} onCreate={handleCreate} />
            )}
          </AnimatePresence>
        </div>

        {/* Modal */}
        <EventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );

};

export default CalendarPage;
