'use strict';
/* globals Mousetrap */
const $ = document.querySelector.bind(document);

function registerShortcuts() {
	// go to search
	Mousetrap.bindGlobal('f', () => {
		const searchInputFaux = $('input#searchInput');
		const overlayEnabled = $('html.overlay-enabled');

		if (!overlayEnabled) {
			if (searchInputFaux) {
				searchInputFaux.click();
				return false;
			}
		}
	});

	// go home
	Mousetrap.bind('g h', () => {
		$('a[data-event-name="home"]').click();
	});

	// toggle dark mode
	Mousetrap.bind('d', () => {
		toggleDarkMode();
	});

	// open / close main menu
	Mousetrap.bindGlobal('shift+m', () => {
		const btn = $('a#mw-mf-main-menu-button');

		if (btn) {
			btn.click();
		}
	});

	// open / close language selector
	Mousetrap.bindGlobal('shift+l', () => {
		const btn = $('.language-selector');

		if (btn) {
			btn.click();
		}
	});

	// change to first suggested language
	// after open language selector
	Mousetrap.bindGlobal('1', () => {
		const suggestedLang = $('.suggested-languages li:first-child a');

		if (suggestedLang) {
			suggestedLang.click();
		}

		const results = $('.overlay-enabled .results');

		if (results) {
			$('.page-list li a').focus();
		}
	});

	// close search and language selector overlay
	Mousetrap.bindGlobal('esc', () => {
		const cancel = $('button.cancel');

		if (cancel) {
			cancel.click();
		}
	});

	// go top
	Mousetrap.bind('g t', () => {
		window.scrollTo(0, 0);
	});

	// scroll up
	Mousetrap.bind('w', () => {
		window.scrollBy(0, -400);
	});

	// scroll down
	Mousetrap.bind('s', () => {
		window.scrollBy(0, 400);
	});

	// enable backspace to go back (and shift+left)
	// NOTE: Backspace on search input?
	Mousetrap.bindGlobal(['shift+left'], () => {
		window.history.back();
	});

	// go to next in browser history
	Mousetrap.bindGlobal('shift+right', () => {
		window.history.go(1);
	});
}

// Toggle Dark Mode
// ============================================================================
function getMode() {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({method: 'getMode'}, res => {
			// values are being passed back as strings, this converts to accurate boolean
			resolve(res.darkMode === 'true');
		});
	});
}

function setMode(newMode) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({
			method: 'setMode',
			darkMode: newMode
		}, res => {
			// values are being passed back as strings, this converts to accurate boolean
			resolve(res.darkMode === 'true');
		});
	});
}

function toggleDarkMode() {
	getMode().then(current => {
		setMode(!current);
	}).then(applyMode());
}

function applyMode(isDark) {
	document.documentElement.classList.toggle('dark-mode', isDark);
}

// INIT
// ============================================================================
function init() {
	registerShortcuts();

	// apply dark mode with local storage value
	getMode().then(applyMode);
}

document.addEventListener('DOMContentLoaded', () => {
	init();
});
