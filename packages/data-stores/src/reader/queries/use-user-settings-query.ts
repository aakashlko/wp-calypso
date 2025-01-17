import { useQuery } from 'react-query';
import { callApi } from '../helpers';
import { useIsLoggedIn, useIsQueryEnabled } from '../hooks';
import type { SubscriptionManagerUserSettings, EmailSettingsAPIResponse } from '../types';

const useUserSettingsQuery = () => {
	const isLoggedIn = useIsLoggedIn();
	const enabled = useIsQueryEnabled();
	return useQuery< SubscriptionManagerUserSettings >(
		[ 'read', 'email-settings', isLoggedIn ],
		async () => {
			const { settings } = await callApi< EmailSettingsAPIResponse >( {
				path: '/read/email-settings',
				isLoggedIn,
			} );
			return settings;
		},
		{
			enabled,
			refetchOnWindowFocus: false,
		}
	);
};

export default useUserSettingsQuery;
