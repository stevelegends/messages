export function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to generate a random light color code
export function getRandomLightColor() {
    let color;
    let brightness;
    do {
        color = getRandomColor();
        // Check if the color is light (using a simple brightness threshold)
        const hex = color.slice(1); // Remove the '#' symbol
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        brightness = (r * 299 + g * 587 + b * 114) / 1000;
    } while (brightness < 128); // Adjust this threshold for your preference
    return color;
}

// Function to generate a random dark color code
export function getRandomDarkColor() {
    let color;
    let brightness;
    do {
        color = getRandomColor();
        // Check if the color is dark (using a simple brightness threshold)
        const hex = color.slice(1); // Remove the '#' symbol
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        brightness = (r * 299 + g * 587 + b * 114) / 1000;
    } while (brightness >= 128); // Adjust this threshold for your preference
    return color;
}
