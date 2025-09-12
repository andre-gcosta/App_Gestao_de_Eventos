import type { EventItem } from "../../types/event";
import { format } from "date-fns";
import { useWeekView } from "../../hooks/useWeekView";
import { useEventTooltip } from "../../hooks/useEventTooltip";

interface WeekViewProps {
  currentDate: Date;
  events?: EventItem[];
  onEdit: (event: EventItem) => void;
  onCreate?: (date: Date) => void;
}

export default function WeekView({
  currentDate,
  events = [],
  onEdit,
  onCreate,
}: WeekViewProps) {
  const { days, nowPosition, positionedEvents } = useWeekView({
    currentDate,
    events,
  });
  const { tooltipEvent, setTooltipEvent, tooltipPos, eventRefs } =
    useEventTooltip(currentDate);

  return (
    <div className="flex flex-col h-full border rounded-lg bg-white shadow-sm overflow-auto">
      {/* Cabeçalho */}
      <div className="flex">
        <div className="w-14" />
        <div className="grid grid-cols-7 border-b border-gray-200 flex-1">
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`text-center font-semibold p-2 text-sm
                ${day.isWeekend ? "bg-gray-100" : "bg-white"}
                ${day.isToday ? "bg-blue-100 border-b-2 border-blue-400" : ""}`}
            >
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][
                day.date.getDay()
              ]}{" "}
              {day.date.getDate()}
            </div>
          ))}
        </div>
      </div>

      {/* Corpo da semana */}
      <div className="flex flex-1 overflow-auto relative">
        {/* Horário */}
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

        {/* Colunas da semana */}
        <div className="flex-1 relative grid grid-cols-7 border-l border-gray-200">
          {days.map((day, colIndex) => (
            <div
              key={colIndex}
              className={`relative border-r border-gray-200 ${
                day.isWeekend ? "bg-gray-50" : "bg-white"
              } ${day.isToday ? "bg-blue-50" : ""}`}
            >
              {/* Linha do horário atual */}
              {day.isToday && nowPosition !== null && (
                <div
                  className="absolute left-0 right-0 h-0.5 bg-red-500 z-20"
                  style={{ top: `${nowPosition}%` }}
                >
                  <div className="absolute -left-2 -top-1 w-3 h-3 rounded-full bg-red-500"></div>
                </div>
              )}

              {/* Divs de horas clicáveis */}
              {Array.from({ length: 24 }, (_, hour) => {
                const topHour = (hour / 24) * 100;
                return (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 h-[4.1666%] group hover:bg-gray-50 cursor-pointer"
                    style={{ top: `${topHour}%` }}
                    onClick={() => {
                      if (onCreate) {
                        const date = new Date(day.date);
                        date.setHours(hour, 0, 0, 0);
                        onCreate(date);
                      }
                    }}
                  >
                    <div className="absolute left-0 right-0 border-t-2 border-gray-200"></div>
                    {Array.from({ length: 3 }, (_, i) => (
                      <div
                        key={i}
                        className="absolute left-0 right-0 border-t border-dotted border-gray-200"
                        style={{ top: `${((i + 1) * 25) / 100}%` }}
                      />
                    ))}
                  </div>
                );
              })}

              {/* Eventos */}
              {positionedEvents[day.date.toDateString()]?.map(
                ({ event, top, height, left, width }) => (
                  <div
                    key={event.id}
                    ref={(el) => (eventRefs.current[event.id] = el)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(event);
                    }}
                    onMouseEnter={() => setTooltipEvent(event)}
                    onMouseLeave={() => setTooltipEvent(null)}
                    onFocus={() => setTooltipEvent(event)}
                    onBlur={() => setTooltipEvent(null)}
                    className="absolute rounded-lg shadow-md p-2 text-sm cursor-pointer overflow-hidden border hover:shadow-lg hover:brightness-110 transition-all"
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
                )
              )}
            </div>
          ))}

          {/* Tooltip */}
          {tooltipEvent?.description && (
            <div
              className="absolute z-50 p-2 bg-black text-white text-xs rounded shadow-md max-w-xs"
              style={{ top: tooltipPos.y, left: tooltipPos.x }}
            >
              {tooltipEvent.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
