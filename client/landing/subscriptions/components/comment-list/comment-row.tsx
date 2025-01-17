import { Gridicon } from '@automattic/components';
import { memo, useMemo } from 'react';
import TimeSince from 'calypso/components/time-since';
import { CommentSettings } from '../settings-popover';
import type { PostSubscription } from '@automattic/data-stores/src/reader/types';

type CommentRowProps = PostSubscription & {
	forwardedRef: React.Ref< HTMLDivElement >;
	style: React.CSSProperties;
};

const CommentRow = ( {
	title,
	excerpt,
	site_title,
	site_icon,
	site_url,
	date_subscribed,
	forwardedRef,
	style,
}: CommentRowProps ) => {
	const hostname = useMemo( () => new URL( site_url ).hostname, [ site_url ] );
	const siteIcon = useMemo( () => {
		if ( site_icon ) {
			return <img className="icon" src={ site_icon } alt={ site_title } />;
		}
		return <Gridicon className="icon" icon="globe" size={ 48 } />;
	}, [ site_icon, site_title ] );
	return (
		<div style={ style } ref={ forwardedRef } className="row-wrapper">
			<div className="row" role="row">
				<span className="post" role="cell">
					<div className="title">{ title }</div>
					<div className="excerpt">{ excerpt }</div>
				</span>
				<a href={ site_url } rel="noreferrer noopener" className="title-box" target="_blank">
					<span className="title-box" role="cell">
						{ siteIcon }
						<span className="title-column">
							<span className="name">{ site_title }</span>
							<span className="url">{ hostname }</span>
						</span>
					</span>
				</a>
				<span className="date" role="cell">
					<TimeSince date={ date_subscribed.toISOString?.() ?? date_subscribed } />
				</span>
				<span className="actions" role="cell">
					<CommentSettings onUnfollow={ () => undefined } unfollowing={ false } />
				</span>
			</div>
		</div>
	);
};

export default memo( CommentRow );
