// The help sheet's open state, and the keys that open, close and are held by it.

import {KEYS, isBackKey, isExitKey} from '../../utils/keys';

let open = false;
const listeners = new Set();

export const isRemoteHelpOpen = () => open;

export const subscribeRemoteHelp = (listener) => {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
};

const setOpen = (value) => {
	open = value;
	listeners.forEach((listener) => listener(open));
};

// Registered at startup, ahead of every other window listener, so stopping a key here keeps it
// from all of them.
export const installRemoteHelpKeys = (target = window) => {
	let held = null;
	const swallow = (e) => {
		e.preventDefault();
		e.stopImmediatePropagation();
	};
	target.addEventListener('keydown', (e) => {
		const code = e.keyCode || e.which;
		if (code === KEYS.E_MANUAL) {
			swallow(e);
			held = code;
			setOpen(!open);
			return;
		}
		if (!open) return;
		swallow(e);
		held = code;
		if (isBackKey(e) || isExitKey(e) || code === KEYS.ENTER) setOpen(false);
	}, true);
	// The key that closed the sheet lets go after it's gone, and that release stays here too.
	target.addEventListener('keyup', (e) => {
		const code = e.keyCode || e.which;
		if (!open && code !== held) return;
		swallow(e);
		if (code === held) held = null;
	}, true);
};
