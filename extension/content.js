'use strict';

/* globals Mousetrap */
const $ = document.querySelector.bind(document);

function registerShortcuts() {
	// Go to search
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

	// Go home
	Mousetrap.bind('g h', () => {
		$('a[data-event-name="home"]').click();
	});

	// Toggle dark mode
	Mousetrap.bind('d', () => {
		toggleDarkMode();
	});

	// Open / Close main menu
	Mousetrap.bindGlobal('shift+m', () => {
		const btn = $('a#mw-mf-main-menu-button');

		if (btn) {
			btn.click();
		}
	});

	// Open / Close language selector
	Mousetrap.bindGlobal('shift+l', () => {
		const btn = $('.language-selector');

		if (btn) {
			btn.click();
		}
	});

	// Change to first suggested language after open language selector
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

	// Close search and language selector overlay
	Mousetrap.bindGlobal('esc', () => {
		const cancel = $('button.cancel');

		if (cancel) {
			cancel.click();
		}
	});

	// Go top
	Mousetrap.bind('g t', () => {
		window.scrollTo(0, 0);
	});

	// Scroll up
	Mousetrap.bind('w', () => {
		window.scrollBy(0, -400);
	});

	// Scroll down
	Mousetrap.bind('s', () => {
		window.scrollBy(0, 400);
	});

	// Enable backspace to go back (and shift+left)
	// NOTE: Backspace on search input?
	Mousetrap.bindGlobal(['shift+left'], () => {
		window.history.back();
	});

	// Go to next in browser history
	Mousetrap.bindGlobal('shift+right', () => {
		window.history.go(1);
	});
}

// Toggle Dark Mode
// ============================================================================

function getMode() {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({method: 'getMode'}, res => {
			// Values are being passed back as strings, this converts to accurate boolean
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
			// Values are being passed back as strings, this converts to accurate boolean
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

// Initialization
// ============================================================================

function init() {
	registerShortcuts();

	// Apply dark mode with local storage value
	getMode().then(applyMode);
}

document.addEventListener('DOMContentLoaded', () => {
	init();
});
