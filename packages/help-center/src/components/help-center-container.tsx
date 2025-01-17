/**
 * External Dependencies
 */
import { useSupportAvailability } from '@automattic/data-stores';
import { useHappychatAvailable } from '@automattic/happychat-connection';
import { useMobileBreakpoint } from '@automattic/viewport-react';
import { Card } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import classnames from 'classnames';
import { useState, useRef, FC, useEffect } from 'react';
import Draggable, { DraggableProps } from 'react-draggable';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
/**
 * Internal Dependencies
 */
import { FeatureFlagProvider } from '../contexts/FeatureFlagContext';
import { HELP_CENTER_STORE } from '../stores';
import { Container } from '../types';
import HelpCenterContent from './help-center-content';
import HelpCenterFooter from './help-center-footer';
import HelpCenterHeader from './help-center-header';
import type { HelpCenterSelect } from '@automattic/data-stores';

interface OptionalDraggableProps extends Partial< DraggableProps > {
	draggable: boolean;
}

const OptionalDraggable: FC< OptionalDraggableProps > = ( { draggable, ...props } ) => {
	if ( ! draggable ) {
		return <>{ props.children }</>;
	}
	return <Draggable { ...props } />;
};

const RedirectAssigned = ( { status }: { status?: string } ) => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const assigned = status === 'assigned';

	useEffect( () => {
		if ( assigned && ! pathname.startsWith( '/inline-chat' ) ) {
			navigate( '/inline-chat?session=continued', { replace: true } );
		}
	}, [ assigned, navigate, pathname ] );

	return null;
};

const HelpCenterContainer: React.FC< Container > = ( { handleClose, hidden } ) => {
	const { show, isMinimized, initialRoute } = useSelect(
		( select ) => ( {
			show: ( select( HELP_CENTER_STORE ) as HelpCenterSelect ).isHelpCenterShown(),
			isMinimized: ( select( HELP_CENTER_STORE ) as HelpCenterSelect ).getIsMinimized(),
			initialRoute: ( select( HELP_CENTER_STORE ) as HelpCenterSelect ).getInitialRoute(),
		} ),
		[]
	);

	const { setIsMinimized } = useDispatch( HELP_CENTER_STORE );

	const [ isVisible, setIsVisible ] = useState( true );
	const isMobile = useMobileBreakpoint();
	const classNames = classnames( 'help-center__container', isMobile ? 'is-mobile' : 'is-desktop', {
		'is-minimized': isMinimized,
	} );
	const { data: supportAvailability } = useSupportAvailability( 'CHAT' );
	const { data } = useHappychatAvailable( Boolean( supportAvailability?.is_user_eligible ) );

	const onDismiss = () => {
		setIsVisible( false );
	};

	const toggleVisible = () => {
		if ( ! isVisible ) {
			handleClose();
			// after calling handleClose, reset the visibility state to default
			setIsVisible( true );
		}
	};

	const animationProps = {
		style: {
			animation: `${ isVisible ? 'fadeIn' : 'fadeOut' } .5s`,
		},
		onAnimationEnd: toggleVisible,
	};
	// This is a workaround for an issue with Draggable in StrictMode
	// https://github.com/react-grid-layout/react-draggable/blob/781ef77c86be9486400da9837f43b96186166e38/README.md
	const nodeRef = useRef( null );

	if ( ! show || hidden ) {
		return null;
	}

	return (
		<MemoryRouter initialEntries={ initialRoute ? [ initialRoute ] : undefined }>
			<RedirectAssigned status={ data?.status } />
			<FeatureFlagProvider>
				<OptionalDraggable
					draggable={ ! isMobile && ! isMinimized }
					nodeRef={ nodeRef }
					handle=".help-center__container-header"
					bounds="body"
				>
					<Card className={ classNames } { ...animationProps } ref={ nodeRef }>
						<HelpCenterHeader
							isMinimized={ isMinimized }
							onMinimize={ () => setIsMinimized( true ) }
							onMaximize={ () => setIsMinimized( false ) }
							onDismiss={ onDismiss }
						/>
						<HelpCenterContent />
						{ ! isMinimized && <HelpCenterFooter /> }
					</Card>
				</OptionalDraggable>
			</FeatureFlagProvider>
		</MemoryRouter>
	);
};

export default HelpCenterContainer;
