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

const middlewares = [thunk];

if (process.env.NODE_ENV === `development`) {
  // eslint-disable-next-line global-require
  const { logger } = window.require(`redux-logger`);

  middlewares.push(logger);
}

const enhancers = [];

// Apply Middleware & Compose Enhancers
enhancers.push(applyMiddleware(...middlewares));
const enhancer = compose(...enhancers);

const initialState = {};

const store = createStore(rootReducer, initialState, enhancer);

export default store;
