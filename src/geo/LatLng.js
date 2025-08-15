// @ts-check

import * as Util from '../core/Util.js';
import {Earth} from './crs/CRS.Earth.js';
import {LatLngBounds} from './LatLngBounds.js';

/**
 * @typedef {[number, number] | [number, number, number] | {lat: number, lng: number, alt?: number} | {lat: number, lon: number, alt?: number}} LatLngLiteral
 */

/**
 * Represents a geographical point with a certain latitude and longitude.
 *
 * @example
 *
 * ```
 * const latlng = new LatLng(50.5, 30.5);
 * ```
 *
 * All Leaflet methods that accept LatLng objects also accept them in a simple Array form and simple object form (unless noted otherwise), so these lines are equivalent:
 *
 * ```
 * map.panTo([50, 30]);
 * map.panTo({lat: 50, lng: 30});
 * map.panTo({lat: 50, lon: 30});
 * map.panTo(new LatLng(50, 30));
 * ```
 *
 * Note that `LatLng` does not inherit from Leaflet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */
export class LatLng {
	/**
	 * @overload
	 * Creates an object representing a geographical point with the given latitude and longitude (and optionally altitude).
	 * @param {number} lat
	 * @param {number} lng
	 * @param {number} [alt]
	 */

	/**
	 * @overload
	 * Creates an object representing a geographical point with the given latitude and longitude (and optionally altitude).
	 * @param {LatLngLiteral} lat
	 */

	/**
	 * @overload
	 * We can use the same object, no need to clone it.
	 * @param {LatLng} lat
	 */

	/**
	 * @param {number | LatLngLiteral | LatLng} lat
	 * @param {number} [lng]
	 * @param {number} [alt]
	 */
	constructor(lat, lng, alt) {
		const valid = LatLng.validate(lat, lng, alt);
		if (!valid) {
			throw new Error(`Invalid LatLng object: (${lat}, ${lng})`);
		}

		/**
		 * @type {number}
		 */
		let _lat;
		/**
		 * @type {number}
		 */
		let _lng;
		/**
		 * @type {number | undefined}
		 */
		let _alt;
		if (lat instanceof LatLng) {
			// We can use the same object, no need to clone it
			// eslint-disable-next-line no-constructor-return
			return lat;
		} else if (Array.isArray(lat)) {
			if (typeof lat[0] === 'object') {
				throw new Error(`Invalid LatLng object: (${lat}, ${lng})`);
			} else if (lat.length === 3) {
				_lat = lat[0];
				_lng = lat[1];
				_alt = lat[2];
			} else if (lat.length === 2) {
				_lat = lat[0];
				_lng = lat[1];
			} else {
				throw new Error(`Invalid LatLng object: (${lat}, ${lng})`);
			}
		} else if (typeof lat === 'object' && 'lat' in lat) {
			_lat = lat.lat;
			_lng = 'lng' in lat ? lat.lng : lat.lon;
			_alt = lat.alt;
		} else {
			_lat = lat;
			_lng = lng;
			_alt = alt;
		}


		/**
		 * Latitude in degrees
		 * @type {number}
		 */
		this.lat = +_lat;

		/**
		 * Longitude in degrees
		 * @type {number}
		 */
		this.lng = +_lng;

		if (_alt !== undefined) {
			/**
			 * Altitude in meters (optional)
			 * @type {number | undefined}
			 */
			this.alt = +_alt;
		}
	}

	// @section
	// There are several static functions which can be called without instantiating LatLng:

	/**
	 * Returns `true` if the LatLng object can be properly initialized.
	 * @param {number | LatLngLiteral | LatLng} lat
	 * @param {number} [lng]
	 * @param {number} [alt]
	 * @returns {boolean}
	*/
	// eslint-disable-next-line no-unused-vars
	static validate(lat, lng, alt) {
		if (lat instanceof LatLng || (typeof lat === 'object' && 'lat' in lat)) {
			return true;
		} else if (lat && Array.isArray(lat) && typeof lat[0] !== 'object') {
			if (lat.length === 3 || lat.length === 2) {
				return true;
			}
			return false;
		} else if ((lat || lat === 0) && (lng || lng === 0)) {
			return true;
		}
		return false;
	}


	/**
	 * Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
	 * @param {LatLngLiteral | LatLng} obj
	 * @param {number} [maxMargin]
	 * @returns {boolean}
	 */
	equals(obj, maxMargin) {
		if (!obj) { return false; }

		obj = new LatLng(obj);

		const margin = Math.max(
			Math.abs(this.lat - obj.lat),
			Math.abs(this.lng - obj.lng));

		return margin <= (maxMargin ?? 1.0E-9);
	}

	/**
	 * Returns a string representation of the point (for debugging purposes).
	 * @param {number} [precision]
	 * @returns {string}
	 */
	toString(precision) {
		return `LatLng(${Util.formatNum(this.lat, precision)}, ${Util.formatNum(this.lng, precision)})`;
	}

	/**
	 * Returns the distance (in meters) to the given `LatLng` calculated using the [Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula).
	 * @param {LatLng} other
	 * @returns {number}
	 */
	distanceTo(other) {
		return Earth.distance(this, new LatLng(other));
	}

	/**
	 * Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
	 * @returns {LatLng}
	 */
	wrap() {
		return Earth.wrapLatLng(this);
	}

	/**
	 * Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
	 * @param {number} sizeInMeters
	 * @returns {LatLngBounds}
	 */
	toBounds(sizeInMeters) {
		const latAccuracy = 180 * sizeInMeters / 40075017,
		lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

		return new LatLngBounds(
		        [this.lat - latAccuracy, this.lng - lngAccuracy],
		        [this.lat + latAccuracy, this.lng + lngAccuracy]);
	}

	/**
	 * Returns a copy of the current LatLng.
	 * @returns {LatLng}
	 */
	clone() {
		// to skip the validation in the constructor we need to initialize with 0 and then set the values later
		const latlng = new LatLng(0, 0);
		latlng.lat = this.lat;
		latlng.lng = this.lng;
		latlng.alt = this.alt;
		return latlng;
	}
};

