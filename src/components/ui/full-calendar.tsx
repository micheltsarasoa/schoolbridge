'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export function FullCalendarComponent() {
  return (
    <div className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={[
          { title: 'Mathematics', start: '2025-10-31T10:00:00', end: '2025-10-31T11:00:00' },
          { title: 'Physics', start: '2025-10-31T11:00:00', end: '2025-10-31T12:00:00' },
        ]}
      />
    </div>
  );
}
