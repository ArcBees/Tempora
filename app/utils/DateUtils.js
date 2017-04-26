import moment from 'moment';

const LOCALE = 'fr_CA';

export const DateFormat = {
    SHORT_DATE: 'YYYY-MM-DD',
    FULL_DATE: 'LL',
    TIME: 'h:mm'
};

export function formatDate(date: string, dateFormat: DateFormat): string {
    return moment(date).locale(LOCALE).format(dateFormat);
}

export function formatCurrentDate(dateFormat: DateFormat): string {
    return moment().locale(LOCALE).format(dateFormat);
}
