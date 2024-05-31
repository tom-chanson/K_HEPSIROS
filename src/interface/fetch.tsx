interface IFetch {
  error: boolean;
}

export interface IFetchClass extends IFetch {
  start: Date;
  end: Date;
  title: string;
  room: string;
  teacher: string;
  date_update: Date;
  error: false;
}

export interface IFetchException extends IFetch {
  message: string;
  date: Date;
  error: true;
  date_data?: Date;
}

export interface IFetchResult {
  data: IFetchClass[];
  exception: IFetchException[];
  user: string;
}
