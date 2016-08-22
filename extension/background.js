'use strict';

chrome.runtime.onMessage.addListener((req, sender, respond) => {
	if (req.method === 'getMode') {
		respond({darkMode: localStorage.darkMode});
	}

	if (req.method === 'setMode') {
		localStorage.darkMode = req.darkMode;
		respond({darkMode: localStorage.darkMode});
	}
});

chrome.webRequest.onBeforeRequest.addListener(details => {
	if (details.method !== 'GET') {
		return;
	}

	const url = new URL(details.url);
	let lang = url.hostname.split('.')[0];

	if (lang === 'm' || lang === 'www' || lang === 'wikipedia') {
		lang = 'www';
	} else {
		lang += '.m';
	}

	url.hostname = lang + '.wikipedia.org';

	return {
		redirectUrl: url.href
	};
}, {
	urls: [
		'https://wikipedia.org/*',
		'https://*.wikipedia.org/*'
	],
	types: [
		'main_frame'
	]
}, [
	'blocking'
]);
