export const getUrlThroughProxy = (url: FormDataEntryValue): URL => {
    const baseUrl = 'https://allorigins.hexlet.app'
    return new URL(`get?disableCache=true&url=${encodeURIComponent(
        String(url),
    )}`, baseUrl);
}

