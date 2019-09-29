import {
  ADD_SONGS_TO_QUEUE,
  REMOVE_SONGS_TO_QUEUE,
  PLAY_SONG,
  RESUME_SONG,
  PAUSE_SONG
} from "./playerActionTypes";

export function addSongsToQueue(songs) {
  return {
    type: ADD_SONGS_TO_QUEUE,
    payload: songs
  };
}

export function removeSongsFromQueue(songs) {
  return {
    type: REMOVE_SONGS_TO_QUEUE,
    payload: songs
  };
}

export function playSong(songId) {
  return {
    type: PLAY_SONG,
    payload: songId
  };
}

export function resumeSong() {
  return {
    type: RESUME_SONG
  };
}

export function pauseSong() {
  return {
    type: PAUSE_SONG
  };
}
