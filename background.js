// chrome.runtime.onInstalled.addListener(() => {
//     chrome.storage.sync.get(['blacklist', 'redirectUrl'], (data) => {
//         const rules = data.blacklist.map((domain, index) => ({
//             id: index + 1,
//             priority: 1,
//             action: { type: 'redirect', redirect: { url: data.redirectUrl || "https://www.youtube.com/" } },
//             condition: { urlFilter: `*://${domain}/*`, resourceTypes: ['main_frame'] }
//         }));
        
//         chrome.declarativeNetRequest.updateDynamicRules({
//             addRules: rules,
//             removeRuleIds: rules.map(rule => rule.id)
//         });
//     });
// });
