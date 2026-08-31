export function getBrowserId() {
    let browserId = localStorage.getItem("browser_id");

    if (!browserId) {
        browserId = crypto.randomUUID();

        localStorage.setItem(
            "browser_id",
            browserId
        );
    }

    return browserId;
}