import { Event } from "synthetic-event";

/**
 * Common events.
 */

export interface BaseEventMap {

	/**
	 * The key design has changed.
	 */

	change: Event<"change">;

}
