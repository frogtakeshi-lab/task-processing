function todayString() {
    return new Date().toISOString().slice(0, 10);
}
export function formatDueDate(iso) {
    const today = todayString();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);
    if (iso === today)
        return '今日';
    if (iso === tomorrowStr)
        return '明日';
    const date = new Date(iso + 'T00:00:00');
    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    if (year === currentYear)
        return `${month}/${day}`;
    return `${year}/${month}/${day}`;
}
export function isOverdue(iso) {
    return iso < todayString();
}
export function isDueSoon(iso) {
    const today = todayString();
    if (iso <= today)
        return false;
    const diff = new Date(iso + 'T00:00:00').getTime() - new Date(today + 'T00:00:00').getTime();
    return diff <= 2 * 24 * 60 * 60 * 1000;
}
export function calcNextDueDate(currentDue, recurrence) {
    const base = currentDue ?? todayString();
    const d = new Date(base + 'T00:00:00');
    switch (recurrence) {
        case 'daily':
            d.setDate(d.getDate() + 1);
            break;
        case 'weekly':
            d.setDate(d.getDate() + 7);
            break;
        case 'monthly':
            d.setMonth(d.getMonth() + 1);
            break;
        default:
            break;
    }
    return d.toISOString().slice(0, 10);
}
export function todayISO() {
    return todayString();
}
