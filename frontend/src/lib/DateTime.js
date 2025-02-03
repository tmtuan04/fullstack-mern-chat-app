import toast from "react-hot-toast";

export function checkDate (dateData) {
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[1,2])-(19|20)\d{2}$/;
    if (datePattern.test(dateData)) return true;
    if (dateData.length === 10) {
        toast.error("Invalid formate date, try again!");
        return;
    }
}

export function formatMessageTime (date) {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Sử dụng định dạng 24h thay vì AM/PM
    })
}

export function formatDate (dateString) {
    if (!dateString) return "";

    const date = dateString.split("T")[0];
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
}