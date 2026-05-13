export function getContentMetrics(markdownBody: string) {
    const plainText = markdownBody
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`[^`]*`/g, " ")
        .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
        .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
        .replace(/[#>*_\-\n\r]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const wordCount = plainText.length
        ? plainText.split(" ").filter(Boolean).length
        : 0;

    const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

    return { wordCount, readMinutes };
}
