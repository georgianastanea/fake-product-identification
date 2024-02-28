import { createSelector } from "reselect";
import { get, reject } from 'lodash';
import moment from "moment";

const allData = (state) => get(state, 'product_tracker.allProducts.data', []);
const events = (state) => get(state, 'product_tracker.events');

export const myEventsSelector = createSelector(events, (events) => {
    return events;
});