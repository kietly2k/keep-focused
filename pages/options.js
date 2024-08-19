document.getElementById("save").addEventListener("click", () => {
    const item1 = document.getElementById("item1").value;
    const item2 = document.getElementById("item2").value;
    const redirectUrl = document.getElementById("redirectUrl").value;
    const blacklist = [item1, item2];

    chrome.storage.sync.set({ blacklist, redirectUrl });
});
