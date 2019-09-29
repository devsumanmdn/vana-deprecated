import {
  ADD_SONGS_TO_QUEUE,
  REMOVE_SONGS_TO_QUEUE,
  PLAY_SONG,
  PAUSE_SONG
} from "./playerActionTypes";

const initialState = {
  queue: [],
  activeSongId: null,
  playing: false
};

const playerReducer = (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case ADD_SONGS_TO_QUEUE:
      return {
        ...state,
        queue: [...state.queue, ...payload]
      };
    case PLAY_SONG:
      return {
        ...state,
        ...(!!payload && { activeSongId: payload }),
        playing: true
      };
    case PAUSE_SONG:
      return {
        ...state,
        playing: false
      };
    default:
      return state;
  }
};

export default playerReducer;
