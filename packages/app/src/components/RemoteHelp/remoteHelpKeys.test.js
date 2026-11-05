jest.mock('../../platform', () => ({...jest.requireActual('../../platform'), getPlatform: () => 'tizen'}));

import {installRemoteHelpKeys} from './remoteHelpKeys';

const press = (target, type, keyCode) => {
	const event = new window.KeyboardEvent(type, {bubbles: true, cancelable: true});
	Object.defineProperty(event, 'keyCode', {value: keyCode});
	target.dispatchEvent(event);
	return event.defaultPrevented;
};

test('E-MANUAL opens the sheet, which holds every key until Back closes it', () => {
	const target = document.createElement('div');
	installRemoteHelpKeys(target);
	const behind = jest.fn();
	target.addEventListener('keydown', behind, true);
	target.addEventListener('keyup', behind, true);

	press(target, 'keydown', 37);
	expect(behind).toHaveBeenCalledTimes(1);

	expect(press(target, 'keydown', 10146)).toBe(true);
	press(target, 'keyup', 10146);
	press(target, 'keydown', 37);
	press(target, 'keydown', 10009);
	press(target, 'keyup', 10009);
	expect(behind).toHaveBeenCalledTimes(1);

	press(target, 'keydown', 37);
	expect(behind).toHaveBeenCalledTimes(2);
});
