let destUrl = "";

document.getElementById("addUrl").addEventListener("click", async () => {
    // Get arrays containing new and old rules
    const newRule = await getNewRule();

    // Use the arrays to update the dynamic rules
    await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: newRule,
    });
    showSuccessMessage();

    const sourceUrlCtrl = document.getElementById("sourceUrl");
    addUrlToList(sourceUrlCtrl.value.trim());
    sourceUrlCtrl.value = "";
});

document.getElementById("destUrl").addEventListener("keyup", async (event) => {
    // Enable button if have changed
    const hasChanged = destUrl !== event.currentTarget.value;
    document.getElementById("saveDestUrl").disabled =
        event.currentTarget.value === "" || hasChanged === false;
});

document
    .getElementById("saveDestUrl")
    .addEventListener("click", async (event) => {
        // Get old rules with ids
        const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
        const oldRuleIds = oldRules.map((rule) => rule.id);

        // Update old rules with new redirect url
        destUrl = document.getElementById("destUrl").value.trim();
        const newRules = oldRules.map((rule) => {
            rule.action.redirect.url = destUrl;
            return rule;
        });

        // Use the arrays to update the dynamic rules
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: oldRuleIds,
            addRules: newRules,
        });

        showSuccessMessage();
        event.currentTarget.disabled = true;
    });

const showSuccessMessage = () => {
    // Show the success message
    const successMessage = document.getElementById("successMessage");
    successMessage.style.display = "block";
    successMessage.style.opacity = "1";

    // Optionally, hide the message after a few seconds
    setTimeout(() => {
        successMessage.style.opacity = "0";
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 500); // Matches the transition time for a smooth fade-out
    }, 2000); // Message is visible for 2 seconds
};

const generateRandomId = () => {
    // Math.random() generates a number between 0 (inclusive) and 1 (exclusive), like 0.123456789
    // Multiplying by 1000000 stretches this range to 0 to 999,999. Which reduces the likelihood of generating the same id on consecutive calls.
    // +1 shifts the range to be between 1 and 1,000,000, ensuring the id is a positive integer.
    return Math.floor(Math.random() * 1000000) + 1;
};

const validateUrl = (url) => {
    // Simple validation to check if the URL is in a proper format
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
};

const getNewRule = async () => {
    const sourceUrl = document.getElementById("sourceUrl").value.trim();
    const destUrl = document.getElementById("destUrl").value.trim();

    return [
        {
            id: generateRandomId(),
            priority: 1,
            action: {
                type: "redirect",
                redirect: { url: destUrl },
            },
            condition: {
                urlFilter: sourceUrl,
                resourceTypes: ["main_frame"],
            },
        },
    ];
};

const init = async () => {
    // Get old rules
    const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
    const urls = oldRules.map((x) => x.condition.urlFilter);
    if (urls.length === 0) {
        return;
    }
    urls.forEach((x) => addUrlToList(x));

    // Update dest url using the first rule item
    // TODO: This can improve by using storage
    destUrl = oldRules[0].action.redirect.url;
    document.getElementById("destUrl").value = destUrl;
};

const addUrlToList = (url) => {
    // Find the <ul> element in the DOM
    const ul = document.getElementById("blacklist");

    // Create a new <li> element
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = url;

    const deleteBtn = document.createElement("a");
    deleteBtn.textContent = "X";
    deleteBtn.onclick = async (event) => {
        // TODO: improve this by using Id instead
        const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
        const rule = oldRules.find((x) => x.condition.urlFilter === url);
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [rule.id],
        });
        event.target.parentElement.remove();
    };

    li.appendChild(span);
    li.appendChild(deleteBtn);

    // Append the new <li> to the <ul>
    ul.appendChild(li);
};

init();
