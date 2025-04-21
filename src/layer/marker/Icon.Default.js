import {Icon} from './Icon.js';

/*
 * @miniclass Icon.Default (Icon)
 * @aka L.Icon.Default
 * @section
 *
 * A trivial subclass of `Icon`, represents the icon to use in `Marker`s when
 * no icon is specified. Points to the blue marker image distributed with Leaflet
 * releases.
 *
 * In order to customize the default icon, just change the properties of `L.Icon.Default.prototype.options`
 * (which is a set of `Icon options`).
 *
 * If you want to _completely_ replace the default icon, override the
 * `L.Marker.prototype.options.icon` with your own icon instead.
 */

const iconUrl = await svgToPng([25, 41], '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round" viewBox="0 0 500 820"><defs><linearGradient id="a" x1="0" x2="1" y1="0" y2="0" gradientTransform="rotate(-90 478.727 62.272)scale(37.566)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#126FC6"/><stop offset="1" stop-color="#4C9CD1"/></linearGradient><linearGradient id="b" x1="0" x2="1" y1="0" y2="0" gradientTransform="rotate(-90 468.484 54.002)scale(19.053)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2E6C97"/><stop offset="1" stop-color="#3883B7"/></linearGradient></defs><path fill="#FFF" d="M341.864 266.306c0 50.809-41.038 91.846-91.846 91.846s-91.846-41.037-91.846-91.846c0-50.808 41.038-91.846 91.846-91.846s91.846 41.038 91.846 91.846"/><path fill="url(#a)" stroke="url(#b)" stroke-width="1.1" d="M416.544 503.612c-6.573 0-12.044 5.691-12.044 11.866 0 2.778 1.564 6.308 2.694 8.746l9.306 17.872 9.262-17.872c1.13-2.438 2.738-5.791 2.738-8.746 0-6.175-5.383-11.866-11.956-11.866Zm0 7.155a4.714 4.714 0 0 1 4.679 4.71c0 2.588-2.095 4.663-4.679 4.679-2.584-.017-4.679-2.09-4.679-4.679a4.714 4.714 0 0 1 4.679-4.71Z" transform="translate(-7889.1 -9807.44)scale(19.5417)"/></svg>');
const shadowUrl = await svgToPng([41, 41], '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 817.2 820"><radialGradient id="a" cx="526.6" cy="486.836" r="478.154" fx="275.876" fy="893.983" gradientUnits="userSpaceOnUse"><stop offset="0" style="stop-color:#5c5c5c;stop-opacity:.9477"/><stop offset=".112" style="stop-color:#474747;stop-opacity:.7805"/><stop offset=".34" style="stop-color:#202020;stop-opacity:.4413"/><stop offset=".523" style="stop-color:#090909;stop-opacity:.1692"/><stop offset=".637" style="stop-color:#000;stop-opacity:0"/></radialGradient><path d="M778.8 483.2c-34.3 52.8-101.9 94.1-150.3 124.6L255.7 820 169 522l170.8-299.6v-.1l9.8-17.3C421.3 94.6 585 56.3 702.5 132.5s147.8 240.3 76.3 350.7" style="fill-rule:evenodd;clip-rule:evenodd;fill:url(#a);fill-opacity:.7;filter:blur(15px)"/></svg>');

function svgToPng([width, height], svg) {
	return new Promise((resolve) => {
		const url = URL.createObjectURL(new Blob([svg], {type: 'image/svg+xml'}));
		const svgImage = document.createElement('img');
		svgImage.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			const canvasCtx = canvas.getContext('2d');
			canvasCtx.drawImage(svgImage, 0, 0, canvas.width, canvas.height);
			const imgData = canvas.toDataURL('image/png');
			resolve(imgData);
			URL.revokeObjectURL(url);
			canvas.remove();
			svgImage.remove();
		};
		svgImage.src = url;
	});
}

export const IconDefault = Icon.extend({

	options: {
		iconUrl:       'marker-icon.svg',
		iconRetinaUrl: 'marker-icon.svg',
		shadowUrl:     'marker-shadow.svg',
		iconSize:    [25, 41],
		iconAnchor:  [12, 41],
		popupAnchor: [1, -34],
		tooltipAnchor: [16, -28],
		shadowSize:  [41, 41]
	},

	_getIconUrl(name) {
		if (name === 'icon') {
			return iconUrl;
		} else if (name === 'shadow') {
			return shadowUrl;
		}
		return Icon.prototype._getIconUrl.call(this, name);
	},
});
