import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

export function formatCurrency(amount: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency
    }).format(amount);
}

export function formatDate(date: string): string {
    let formatted = format(parseISO(date), 'MMM d, yyyy', { locale: it });
    return String(formatted).charAt(0).toUpperCase() + String(formatted).slice(1);
}

export function formatDateDDMMYYYY(date: string): string {
    return format(parseISO(date), 'dd/MM/yyyy', { locale: it });
}

export function monthString(date: string): string {
    let formatted = format(parseISO(date), 'MMM', { locale: it });
    return String(formatted).charAt(0).toUpperCase() + String(formatted).slice(1);
}

export function dayMonthString(date: string): string {
    let day = format(parseISO(date), 'dd', { locale: it });
    let month = format(parseISO(date), 'MMM', { locale: it });
    return day + ' ' + String(month).charAt(0).toUpperCase() + String(month).slice(1);
}

export function monthYearString(date: string): string {
    let formatted = format(parseISO(date), 'MMM yyyy', { locale: it });
    return String(formatted).charAt(0).toUpperCase() + String(formatted).slice(1);
}

export function month(date: string): string {
    return format(parseISO(date), 'MM', { locale: it });
}

export function formatAccountType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
}
