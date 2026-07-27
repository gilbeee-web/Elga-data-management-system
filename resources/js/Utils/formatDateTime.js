export const formatDateTime = (dateTime) => {
    if (!dateTime) return "—";

    return new Date(dateTime).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};