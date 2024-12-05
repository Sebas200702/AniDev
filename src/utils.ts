export const baseUrl = process.env.NODE_ENV === 'production' ? 'https://animeflix.vercel.app' : 'http://localhost:4321'

export const debounce = (callback: (...args: any[]) => void, waitTime: number): (...args: any[]) => void => {
    let timer: NodeJS.Timeout;
    return (...args: any[]): void => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback(...args);
        }, waitTime);
    };
}
