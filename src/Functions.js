// Function to make the 1st letter capital
const capitalize = (text) => {
    let lower = text.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1, text.length);
}
// Formating the News Title
const handleNewsTitle = (text) => {
    return (text===null?"No title : View the detail news":text.split(" - ")[0].split(" ").slice(0, 10).join(" ") + "...");
}
// Formating the news descripotion
const handelNewsDescription = (text) => {
    return (text===null?"No description : View the detail news":text.split(" ").slice(0, 8).join(" ") + "...");
}
// Calculate Upload time
const calculatePublishTime = (inputUtcString) => {
    // Parse the input UTC time
    const inputDateUTC = new Date(inputUtcString);

    // Convert input UTC time to IST (UTC + 5:30)
    const inputDateIST = new Date(inputDateUTC.getTime() + 5.5 * 60 * 60 * 1000);

    // Get the current time in UTC and convert to IST
    const nowUTC = new Date();
    const nowIST = new Date(nowUTC.getTime() + 5.5 * 60 * 60 * 1000);

    // Step 4: Calculate time difference
    const diffMs = nowIST - inputDateIST;
    const diffSeconds = Math.floor(Math.abs(diffMs) / 1000);

    const days = Math.floor(diffSeconds / (3600 * 24));

    // If more than 24 hours, show days only
    if (days >= 1) {
        const direction = diffMs >= 0 ? "ago" : "from now";
        return (inputUtcString===null?"":`Published ${days} day${days > 1 ? "s" : ""} ${direction}`);
    }

    // Otherwise, show hours, minutes, seconds
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = diffSeconds % 60;
    const direction = diffMs >= 0 ? "ago" : "from now";
    return (inputUtcString===null?"":`Published ${hours}h ${minutes}m ${seconds}s ${direction}`);
}
// Formating news content
function handleNewsContent(content) {
    // Remove any text that matches "… [+xxxx chars]" or just "…"
    return (content===null?"No content: View detail news":content.replace(/…\s*\[\+\d+\s+chars\]$/, '').trim());
}

// Function to shalow copy the to country wise article element indexes
const getCountryArticleIndexArray = (country, expandedIndexes) => {
    if (country === "India") {
        return expandedIndexes.indiaExpandedIds;
    }
    else if (country === "US") {
        return expandedIndexes.usExpandedIds;
    }
    else if (country === "China") {
        return expandedIndexes.chinaExpandedIds
    }
}

export {
    capitalize, handleNewsTitle, handelNewsDescription, calculatePublishTime, handleNewsContent, getCountryArticleIndexArray,
};
