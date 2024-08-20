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

    console.log(oldRuleIds, newRules);
});

const generateRandomId = () => {
    // Generate a random number between 1 and 1,000,000
    // +1 shifts the range to be between 1 and 1,000,000, ensuring the id is a positive integer.
    // Math.random() generates a number between 0 (inclusive) and 1 (exclusive), like 0.123456789
    // Multiplying by 1000000 stretches this range to 0 to 999,999. Which reduces the likelihood of generating the same id on consecutive calls.
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
    const item1 = document.getElementById("item1").value.trim();
    const item2 = document.getElementById("item2").value.trim();
    const redirectUrl = document.getElementById("redirectUrl").value.trim();

    if (!validateUrl(redirectUrl)) {
        alert("Invalid redirect URL.");
        return [];
    }

    const blacklist = [item1, item2].filter((url) => url !== "");

    return blacklist.map((x) => {
        return {
            id: generateRandomId(),
            priority: 1,
            action: {
                type: "redirect",
                redirect: { url: redirectUrl },
            },
            condition: {
                urlFilter: x,
                resourceTypes: ["main_frame"],
            },
        };
    });
};
