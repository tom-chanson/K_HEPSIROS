interface IEvent {
    user: string;
    start: Date;
    end: Date;
    title: string;
    event_id: number;
    allDay: boolean;
    agendaAvatar?: React.ReactElement | string;
  }
  
  export interface IEventClass extends IEvent {
    room: string;
    teacher: string;
    date_update: Date;
    allDay: false;
  }
  
  export interface IEventException extends IEvent {
    message: string;
    allDay: true;
    error: true;
    color: "#af2525";
    date_data?: Date;
  }
  
  export type EventCalendar = IEventClass | IEventException;
