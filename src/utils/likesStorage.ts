const KEY = "liked_posts";

export const likesStorage = {
    get(): string[] {
        try {
            return JSON.parse(localStorage.getItem(KEY) ?? "[]");
        } catch {
            return [];
        }
    },

    has(id: string) {
        return this.get().includes(id);
    },

    add(id: string) {
        const set = new Set(this.get());
        set.add(id);
        localStorage.setItem(KEY, JSON.stringify([...set]));
    },

    remove(id: string) {
        const set = new Set(this.get());
        set.delete(id);
        localStorage.setItem(KEY, JSON.stringify([...set]));
    },
};
