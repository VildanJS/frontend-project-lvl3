export const getUrlThroughProxy = (value: string): string =>
    `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
        value,
    )}`
