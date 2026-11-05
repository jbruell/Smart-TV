// Text and caret state for the in-app keyboard. Positions count code units, but
// movement and deletion step over surrogate pairs so an emoji acts like one character.

const isHighSurrogate = (code) => code >= 0xD800 && code <= 0xDBFF;
const isLowSurrogate = (code) => code >= 0xDC00 && code <= 0xDFFF;

const stepBefore = (text, position) => {
	if (position <= 0) return 0;
	if (position >= 2 &&
		isLowSurrogate(text.charCodeAt(position - 1)) &&
		isHighSurrogate(text.charCodeAt(position - 2))) {
		return position - 2;
	}
	return position - 1;
};

const stepAfter = (text, position) => {
	if (position >= text.length) return text.length;
	if (position <= text.length - 2 &&
		isHighSurrogate(text.charCodeAt(position)) &&
		isLowSurrogate(text.charCodeAt(position + 1))) {
		return position + 2;
	}
	return position + 1;
};

const clampCursor = (text, cursor) => Math.max(0, Math.min(text.length, cursor));

export const makeState = (text = '', cursor) => ({
	text: String(text),
	cursor: clampCursor(String(text), cursor == null ? String(text).length : cursor)
});

export const insertText = (state, value) => {
	if (!value) return state;
	const text = state.text.slice(0, state.cursor) + value + state.text.slice(state.cursor);
	return {text, cursor: state.cursor + value.length};
};

export const backspace = (state) => {
	if (state.cursor <= 0) return state;
	const from = stepBefore(state.text, state.cursor);
	return {
		text: state.text.slice(0, from) + state.text.slice(state.cursor),
		cursor: from
	};
};

export const moveCursor = (state, direction) => {
	const cursor = direction < 0
		? stepBefore(state.text, state.cursor)
		: stepAfter(state.text, state.cursor);
	if (cursor === state.cursor) return state;
	return {text: state.text, cursor};
};

export const clearText = () => makeState('');

// The remote's number keys type letters the way a phone keypad does. Pressing the same key again
// soon after swaps the letter just typed for the next one on that key.
export const MULTI_TAP = {
	0: ' 0', 1: '.,-\'@1', 2: 'abc2', 3: 'def3', 4: 'ghi4',
	5: 'jkl5', 6: 'mno6', 7: 'pqrs7', 8: 'tuv8', 9: 'wxyz9'
};

// tap is the previous press when it may still be cycled, else null.
export const multiTap = (state, tap, digit, upper) => {
	const letters = MULTI_TAP[digit];
	const repeat = tap && tap.digit === digit;
	const index = repeat ? (tap.index + 1) % letters.length : 0;
	const letter = upper ? letters[index].toUpperCase() : letters[index];
	return {state: insertText(repeat ? backspace(state) : state, letter), tap: {digit, index}};
};
