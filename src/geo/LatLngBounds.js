// @ts-check

import {LatLng} from './LatLng.js';

/**
 * Represents a rectangular geographical area on a map.
 *
 * @example
 *
 * ```js
 * const corner1 = new LatLng(40.712, -74.227),
 * corner2 = new LatLng(40.774, -74.125),
 * bounds = new LatLngBounds(corner1, corner2);
 * ```
 *
 * All Leaflet methods that accept LatLngBounds objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
 *
 * ```js
 * map.fitBounds([
 * 	[40.712, -74.227],
 * 	[40.774, -74.125]
 * ]);
 * ```
 *
 * Caution: if the area crosses the antimeridian (often confused with the International Date Line), you must specify corners _outside_ the [-180, 180] degrees longitude range.
 *
 * Note that `LatLngBounds` does not inherit from Leaflet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */
export class LatLngBounds {
	/**
	 * @overload
	 * Creates a `LatLngBounds` object by defining two diagonally opposite corners of the rectangle.
	 * @param {import('./LatLng').LatLngLiteral | LatLng} corner1
	 * @param {import('./LatLng').LatLngLiteral | LatLng} corner2
	 */

	/**
	 * @overload
	 * Creates a `LatLngBounds` object defined by the geographical points it contains. Very useful for zooming the map to fit a particular set of locations with [`fitBounds`](#map-fitbounds).
	 * @param {LatLng[]} corner1
	 */

	/**
	 * @overload
	 * We can use the same object, no need to clone it.
	 * @param {LatLngBounds} corner1
	 */

	/**
	 * @param {import('./LatLng').LatLngLiteral | LatLng | LatLng[] | LatLngBounds} corner1
	 * @param {import('./LatLng').LatLngLiteral | LatLng} [corner2]
	 */
	constructor(corner1, corner2) {
		if (!corner1) { return; }

		if (corner1 instanceof LatLngBounds) {
			// We can use the same object, no need to clone it
			// eslint-disable-next-line no-constructor-return
			return corner1;
		}

		const latlngs = corner2 ? [corner1, corner2] : corner1;

		for (const latlng of latlngs) {
			this.extend(latlng);
		}

		/**
		 * @type {LatLng}
		 */
		this._southWest;
		/**
		 * @type {LatLng}
		 */
		this._northEast;
	}

	/**
	 * Extend the bounds to contain the given point.
	 * @param {LatLng | LatLngBounds} obj
	 * @returns {this}
	 */
	extend(obj) {
		const sw = this._southWest,
		ne = this._northEast;
		let sw2, ne2;

		if (obj instanceof LatLng) {
			sw2 = obj;
			ne2 = obj;

		} else if (obj instanceof LatLngBounds) {
			sw2 = obj._southWest;
			ne2 = obj._northEast;

			if (!sw2 || !ne2) { return this; }

		} else {
			if (!obj) {
				return this;
			}
			if (LatLng.validate(obj)) {
				return this.extend(new LatLng(obj));
			}
			return this.extend(new LatLngBounds(obj));
		}

		if (!sw && !ne) {
			this._southWest = new LatLng(sw2.lat, sw2.lng);
			this._northEast = new LatLng(ne2.lat, ne2.lng);
		} else {
			sw.lat = Math.min(sw2.lat, sw.lat);
			sw.lng = Math.min(sw2.lng, sw.lng);
			ne.lat = Math.max(ne2.lat, ne.lat);
			ne.lng = Math.max(ne2.lng, ne.lng);
		}

		return this;
	}

	/**
	 * Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
	 * For example, a ratio of 0.5 extends the bounds by 50% in each direction.
	 * Negative values will retract the bounds.
	 * @param {number} bufferRatio
	 * @returns {LatLngBounds}
	 */
	pad(bufferRatio) {
		const sw = this._southWest,
		ne = this._northEast,
		heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
		widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

		return new LatLngBounds(
			new LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
			new LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
	}

	/**
	 * Returns the center point of the bounds.
	 * @returns {LatLng}
	 */
	getCenter() {
		return new LatLng(
			(this._southWest.lat + this._northEast.lat) / 2,
			(this._southWest.lng + this._northEast.lng) / 2);
	}

	/**
	 * Returns the south-west point of the bounds.
	 * @returns {LatLng}
	 */
	getSouthWest() {
		return this._southWest;
	}

	/**
	 * Returns the north-east point of the bounds.
	 * @returns {LatLng}
	 */
	getNorthEast() {
		return this._northEast;
	}

	/**
	 * Returns the north-west point of the bounds.
	 * @returns {LatLng}
	 */
	getNorthWest() {
		return new LatLng(this.getNorth(), this.getWest());
	}

	/**
	 * Returns the south-east point of the bounds.
	 * @returns {LatLng}
	 */
	getSouthEast() {
		return new LatLng(this.getSouth(), this.getEast());
	}

	/**
	 * Returns the west longitude of the bounds.
	 * @returns {number}
	 */
	getWest() {
		return this._southWest.lng;
	}

	/**
	 * Returns the south latitude of the bounds.
	 * @returns {number}
	 */
	getSouth() {
		return this._southWest.lat;
	}

	/**
	 * Returns the east longitude of the bounds.
	 * @returns {number}
	 */
	getEast() {
		return this._northEast.lng;
	}

	/**
	 * Returns the north latitude of the bounds.
	 * @returns {number}
	 */
	getNorth() {
		return this._northEast.lat;
	}

	/**
	 * Returns `true` if the rectangle contains the given one.
	 * @param {LatLngBounds | LatLng} obj
	 * @returns {boolean}
	 */
	contains(obj) {
		if (LatLng.validate(obj)) {
			obj = new LatLng(obj);
		} else {
			obj = new LatLngBounds(obj);
		}

		const sw = this._southWest,
		ne = this._northEast;
		let sw2, ne2;

		if (obj instanceof LatLngBounds) {
			sw2 = obj.getSouthWest();
			ne2 = obj.getNorthEast();
		} else {
			sw2 = ne2 = obj;
		}

		return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
		       (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
	}

	/**
	 * Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
	 * @param {LatLngBounds} bounds
	 * @returns {boolean}
	 */
	intersects(bounds) {
		bounds = new LatLngBounds(bounds);

		const sw = this._southWest,
		ne = this._northEast,
		sw2 = bounds.getSouthWest(),
		ne2 = bounds.getNorthEast(),

		latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
		lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

		return latIntersects && lngIntersects;
	}

	/**
	 * Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
	 * @param {LatLngBounds} bounds
	 * @returns {boolean}
	 */
	overlaps(bounds) {
		bounds = new LatLngBounds(bounds);

		const sw = this._southWest,
		ne = this._northEast,
		sw2 = bounds.getSouthWest(),
		ne2 = bounds.getNorthEast(),

		latOverlaps = (ne2.lat > sw.lat) && (sw2.lat < ne.lat),
		lngOverlaps = (ne2.lng > sw.lng) && (sw2.lng < ne.lng);

		return latOverlaps && lngOverlaps;
	}

	/**
	 * Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format.
	 * Useful for sending requests to web services that return geo data.
	 * @returns {string}
	 */
	toBBoxString() {
		return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
	}

	/**
	 * Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds.
	 * The margin of error can be overridden by setting `maxMargin` to a small number.
	 * @param {LatLngBounds} bounds
	 * @param {number} [maxMargin]
	 * @returns {boolean}
	 */
	equals(bounds, maxMargin) {
		if (!bounds) { return false; }

		bounds = new LatLngBounds(bounds);

		return this._southWest.equals(bounds.getSouthWest(), maxMargin) &&
		       this._northEast.equals(bounds.getNorthEast(), maxMargin);
	}

	/**
	 * Returns `true` if the bounds are properly initialized.
	 * @returns {boolean}
	 */
	isValid() {
		return !!(this._southWest && this._northEast);
	}
}
