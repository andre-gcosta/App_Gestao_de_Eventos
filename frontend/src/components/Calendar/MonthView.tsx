import type { EventItem } from '../../types/event';
import { format } from 'date-fns';
import { useMonthView } from '../../hooks/useMonthView';

interface MonthViewProps {
  currentDate: Date;
  events?: EventItem[];
  onEdit: (event: EventItem) => void;
  onCreate: (date: Date) => void;
}

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function MonthView({ currentDate, events = [], onEdit, onCreate }: MonthViewProps) {
  const { days } = useMonthView({ currentDate, events });

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="text-center font-semibold text-sm">
            {day}
          </div>
        ))}
      </div>

      <div className="month-view grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <div
            key={i}
            className={`
              cell-month border rounded-lg p-1 flex flex-col h-28 cursor-pointer
              ${day.isWeekend ? 'bg-gray-100' : 'bg-white'}
              ${day.isToday ? 'bg-blue-100 border-blue-400' : ''}
              hover:bg-gray-200 transition-colors
            `}
            onClick={() => day.inMonth && onCreate(day.date)}
          >
            <div className="font-semibold text-sm mb-1">{day.inMonth ? day.date.getDate() : ''}</div>

            <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
              {day.events.map((event) => (
                <div
                  key={event.id}
                  className="event-panel p-1 rounded shadow-sm text-xs text-white truncate cursor-pointer flex-shrink-0"
                  style={{ backgroundColor: event.color || '#3b82f6' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(event);
                  }}
                  title={`${event.title} • ${format(new Date(event.startDate), 'HH:mm')} • ${event.location || '-'}`}
                >
                  <div className="font-semibold truncate">{event.title}</div>
                  <div className="text-[10px]">{format(new Date(event.startDate), 'HH:mm')}</div>
                  {event.location && (
                    <div className="text-[10px] truncate">📍 {event.location}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
