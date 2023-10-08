export function categorizeLinks(text: string): { imageUrl: string[]; url: string[] } {
    const imageLinkRegex: RegExp = /\.(jpg|jpeg|png|gif|bmp|svg)$/i;
    const urlRegex: RegExp = /(https?:\/\/[^\s]+)/g;

    const urls: string[] = text.match(urlRegex) || [];
    const result: { imageUrl: string[]; url: string[] } = {
        imageUrl: [],
        url: []
    };

    urls.forEach((url: string) => {
        if (url.match(imageLinkRegex)) {
            result.imageUrl.push(url);
        } else {
            result.url.push(url);
        }
    });
    console.log("v", result);
    return result;
}

export async function isImageLink(url: string): Promise<boolean> {
    try {
        const response = await fetch(url, { method: "HEAD" });

        // Check if the response is OK and Content-Type header indicates an image
        if (response.ok) {
            const contentType: string | null = response.headers.get("content-type");
            if (contentType && contentType.startsWith("image")) {
                return true;
            }
        }
    } catch (error) {
        // Handle errors if the request fails
        console.error(`Error checking ${url}: ${error}`);
    }

    return false;
}
