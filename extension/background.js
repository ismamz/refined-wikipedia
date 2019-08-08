'use strict';

const browser = chrome || browser;

browser.runtime.onMessage.addListener((req, sender, respond) => {
	if (req.method === 'getMode') {
		respond({darkMode: localStorage.darkMode});
	}

	if (req.method === 'setMode') {
		localStorage.darkMode = req.darkMode;
		respond({darkMode: localStorage.darkMode});
	}
});

browser.webRequest.onBeforeRequest.addListener(details => {
	if (details.method !== 'GET') {
		return;
	}

	const url = new URL(details.url);

	if (url.host.includes('.m.')) {
		return;
	}

	let lang = url.hostname.split('.')[0];

	if (lang === 'www') {
		return;
	}

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
