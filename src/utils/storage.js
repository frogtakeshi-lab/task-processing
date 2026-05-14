const STORAGE_KEY = 'taskapp_v1';
export function loadTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return [];
        const data = JSON.parse(raw);
        if (data.version !== 1 || !Array.isArray(data.tasks))
            return [];
        return data.tasks;
    }
    catch {
        return [];
    }
}
export function saveTasks(tasks) {
    try {
        const schema = { version: 1, tasks };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(schema));
    }
    catch (e) {
        console.warn('Failed to save tasks to localStorage:', e);
    }
}
