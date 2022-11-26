import { format as fechaFormat } from 'fecha';

const toDate = (
  dateValue: string | Date | number,
  type?:
    | 'product'
    | 'weekdays'
    | 'DD/MM/YYYY'
    | 'YYYY-MM-DD'
    | 'MMM DD'
    | 'DD MMM YYYY'
    | 'D MMM'
    | 'DD/MM/YYYY - hh:mm'
): string => {
  if (!dateValue) {
    return '';
  }
  const date = new Date(dateValue);

  let format = 'DD MMM’YY'; // default format
  if (type === 'product') {
    format = date.getFullYear() !== new Date().getFullYear() ? 'D MMM’YY' : 'D MMM';
  } else if (type === 'weekdays') {
    format = 'ddd, D MMM YYYY';
  } else if (type) {
    format = type;
  }

  try {
    return fechaFormat(date, format);
  } catch (e) {
    return '';
  }
};

const toTime = (timeValue: string, format = 'h:mm A'): string =>
  fechaFormat(new Date(timeValue), format);

const getSGTTime = (date?: string & Date) => {
  const local = date || new Date();
  const UTC = local.getTime() + local.getTimezoneOffset() * 60000;
  return new Date(UTC + 3600000 * 8);
};

const expireIn = (expired_at: string, unit: 'hour' | 'day' = 'day', compareSGT = false): string => {
  const expirationDateTime = new Date(expired_at);
  const today = compareSGT ? getSGTTime() : new Date();

  if (expirationDateTime < today) {
    return `Expired`;
  }

  const timeDiff = Math.abs(expirationDateTime.getTime() - today.getTime());
  const diffInUnits = Math.ceil(timeDiff / (1000 * 3600 * (unit === 'day' ? 24 : 1)));
  return diffInUnits + (diffInUnits > 1 ? ` ${unit}s` : ` ${unit}`);
};

const getNextWeekDays = (days: number, startDate?: string) => {
  const today = startDate ? new Date(startDate) : new Date();
  const weekDays = [];

  let i = 1;
  while (weekDays.length !== days) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      weekDays.push(d);
    }
    i += 1;
  }

  return weekDays;
};

const isCurrentDateInRange = (_startTime: string | Date, _endTime: string | Date): boolean => {
  const startTime = new Date(_startTime);
  const endTime = new Date(_endTime);
  const currentTime = getSGTTime();
  return startTime <= currentTime && currentTime <= endTime;
};

const isCurrentDateInRangeSG = (_startTime: string | Date, _endTime: string | Date): boolean => {
  // @ts-ignore: override
  const startTime = getSGTTime(new Date(_startTime));
  // @ts-ignore: override
  const endTime = getSGTTime(new Date(_endTime));
  const currentTime = getSGTTime();
  return startTime <= currentTime && currentTime <= endTime;
};

export {
  toTime,
  toDate,
  expireIn,
  getSGTTime,
  getNextWeekDays,
  isCurrentDateInRange,
  isCurrentDateInRangeSG,
};
