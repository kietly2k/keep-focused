document.getElementById("save").addEventListener("click", async () => {
    // Get arrays containing new and old rules
    const newRules = await getNewRules();
    const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
    const oldRuleIds = oldRules.map((rule) => rule.id);
    // Use the arrays to update the dynamic rules
    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: oldRuleIds,
        addRules: newRules,
    });
    showSuccessMessage();
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

const getNewRules = async () => {
    const sourceUrl = document.getElementById("sourceUrl").value.trim();
    const redirectUrl = document.getElementById("redirectUrl").value.trim();

    if (!validateUrl(redirectUrl)) {
        alert("Invalid redirect URL.");
        return [];
    }

    return {
        id: generateRandomId(),
        priority: 1,
        action: {
            type: "redirect",
            redirect: { url: redirectUrl },
        },
        condition: {
            urlFilter: sourceUrl,
            resourceTypes: ["main_frame"],
        },
    };
};

const init = async () => {
    const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
    const urls = oldRules.map((x) => x.condition.urlFilter);
    if (urls.length === 0) {
        return;
    }
    urls.forEach((x) => addUrlToList(x));
};

const addUrlToList = (url) => {
    // Find the <ul> element in the DOM
    const ul = document.getElementById("blacklist");

    // Create a new <li> element
    const li = document.createElement("li");

    // Set the text content of the <li> to the provided URL
    li.textContent = url;

    // Append the new <li> to the <ul>
    ul.appendChild(li);
};

init();
