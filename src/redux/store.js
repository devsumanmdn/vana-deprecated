import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";

import player from "./player/playerReducer";
import songs from "./songs/songsReducer";
import playlists from "./playlists/playlistsReducer";

const rootReducer = combineReducers({
  player,
  songs,
  playlists
});

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable no-underscore-dangle */

const enhancers = [];

// Apply Middleware & Compose Enhancers
enhancers.push(applyMiddleware(thunk));
const enhancer = composeEnhancers(...enhancers);

const initialState = {};

const store = createStore(rootReducer, initialState, enhancer);

export default store;
