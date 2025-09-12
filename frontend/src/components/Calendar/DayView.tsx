import { format } from "date-fns";
import type { EventItem } from "../../types/event";
import { useDayView } from "../../hooks/useDayView";
import { useEventTooltip } from "../../hooks/useEventTooltip";

interface DayViewProps {
  currentDate: Date;
  events?: EventItem[];
  onEdit: (event: EventItem) => void;
  onCreate: (date: Date) => void;
}

export default function DayView({
  currentDate,
  events = [],
  onEdit,
  onCreate,
}: DayViewProps) {
  const { positionedEvents, nowPosition } = useDayView(currentDate, events);
  const { tooltipEvent, setTooltipEvent, tooltipPos, eventRefs } =
    useEventTooltip(currentDate);

  return (
    <div className="flex h-full border rounded-lg bg-white shadow-sm overflow-y-auto relative">
      {/* Coluna lateral de horas */}
      <div className="flex flex-col w-14 border-r border-gray-200">
        {Array.from({ length: 24 }, (_, hour) => (
          <div
            key={hour}
            className="h-24 flex items-start justify-end pr-2 text-xs text-gray-500"
          >
            {hour.toString().padStart(2, "0")}:00
          </div>
        ))}
      </div>

      {/* Área principal do calendário */}
      <div className="relative flex-1">
        {/* Linha vermelha do horário atual */}
        {nowPosition !== null && (
          <div
            className="absolute left-0 right-0 h-0.5 bg-red-500 z-20"
            style={{ top: `${nowPosition}%` }}
          >
            <div className="absolute -left-2 -top-1 w-3 h-3 rounded-full bg-red-500"></div>
          </div>
        )}

        {/* Grid de 24 horas */}
        {Array.from({ length: 24 }, (_, hour) => {
          const topHour = (hour / 24) * 100;
          return (
            <div
              key={hour}
              className="absolute left-0 right-0 h-[4.1666%] group hover:bg-gray-50 cursor-pointer"
              style={{ top: `${topHour}%` }}
              onClick={() => {
                const date = new Date(currentDate);
                date.setHours(hour, 0, 0, 0);
                onCreate(date);
              }}
            >
              <div className="absolute left-0 right-0 border-t-2 border-gray-200"></div>
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t border-dotted border-gray-200"
                  style={{ top: `${((i + 1) * 25) / 100}%` }}
                ></div>
              ))}
            </div>
          );
        })}

        {/* Eventos */}
        {positionedEvents.map(({ event, top, height, left, width }) => (
          <div
            key={event.id}
            ref={(el) => (eventRefs.current[event.id] = el)}
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(event);
            }}
            onFocus={() => setTooltipEvent(event)}
            onBlur={() => setTooltipEvent(null)}
            onMouseEnter={() => setTooltipEvent(event)}
            onMouseLeave={() => setTooltipEvent(null)}
            className="absolute rounded-lg shadow-md p-2 text-sm cursor-pointer overflow-hidden border hover:shadow-lg hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{
              top: `${top}%`,
              height: `${height}%`,
              left: `${left}%`,
              width: `${width}%`,
              backgroundColor: event.color || "#3b82f6",
              color: "white",
            }}
          >
            <p className="font-semibold truncate">{event.title}</p>
            <p className="text-xs truncate">
              {format(new Date(event.startDate), "HH:mm")} -{" "}
              {format(new Date(event.endDate), "HH:mm")}
            </p>
            {event.location && (
              <p className="text-xs truncate">📍 {event.location}</p>
            )}
          </div>
        ))}

        {/* Tooltip */}
        {tooltipEvent?.description && (
          <div
            className="absolute z-50 p-2 bg-black text-white text-xs rounded shadow-md max-w-xs"
            style={{
              top: tooltipPos.y,
              left: tooltipPos.x,
            }}
          >
            {tooltipEvent.description}
          </div>
        )}
      </div>
    </div>
  );
}
