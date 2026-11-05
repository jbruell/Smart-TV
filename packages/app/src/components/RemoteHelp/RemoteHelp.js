// What each remote key does in this build, opened from E-MANUAL wherever the viewer is.

import {useEffect, useState} from 'react';
import $L from '@enact/i18n/$L';
import {isRemoteHelpOpen, subscribeRemoteHelp} from './remoteHelpKeys';
import css from './RemoteHelp.module.less';

const SECTIONS = [
	{title: 'Everywhere', keys: [
		['E-MANUAL', 'This help'],
		['GUIDE', 'Live TV guide'],
		['EXIT', 'Home screen'],
		['RETURN', 'Back'],
		['HOME', 'Samsung Smart Hub, leaves Moonfin']
	]},
	{title: 'Live TV', keys: [
		['CH + / −', 'Next or previous channel in the bouquet'],
		['▲', 'Channel strip'],
		['RED / GREEN', 'Previous or next bouquet, in the guide too'],
		['0 – 9', 'Channel number, in the guide']
	]},
	{title: 'Keyboard', keys: [
		['0 – 9', 'Letters, phone keypad style: press again for the next letter'],
		['PRE-CH', 'OK, submits the text'],
		['TTX/MIX', 'Deletes the last letter'],
		['Hold OK', 'Accents of the focused key']
	]}
];

const RemoteHelp = () => {
	const [shown, setShown] = useState(isRemoteHelpOpen);
	useEffect(() => subscribeRemoteHelp(setShown), []);
	if (!shown) return null;
	return (
		<div className={css.overlay}>
			<div className={css.panel}>
				<div className={css.title}>{$L('Remote keys')}</div>
				{SECTIONS.map((section) => (
					<div key={section.title} className={css.section}>
						<div className={css.sectionTitle}>{$L(section.title)}</div>
						{section.keys.map(([cap, action]) => (
							<div key={section.title + cap} className={css.row}>
								<span className={css.cap}>{cap}</span>
								<span className={css.action}>{$L(action)}</span>
							</div>
						))}
					</div>
				))}
				<div className={css.footer}>{$L('E-MANUAL, RETURN or OK closes this')}</div>
			</div>
		</div>
	);
};

export default RemoteHelp;
