import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/styles/makeStyles";
import PlayArrowRounded from "@material-ui/icons/PlayArrowRounded";
import PauseRounded from "@material-ui/icons/PauseRounded";
import { connect } from "react-redux";

import {
  playSong as playSongAction,
  pauseSong as pauseSongAction,
  resumeSong as resumeSongAction
} from "../redux/player/playerActions";

const fs = window.require("fs");

const useStyle = makeStyles({
  root: {
    position: "sticky",
    bottom: 0,
    minHeight: 60,
    width: "100vw",
    backgroundColor: "#222",
    display: "flex",
    alignItems: "center",
    padding: "0 20px"
  },
  albumArt: {
    height: 50,
    width: 50,
    backgroundColor: "#222",
    marginRight: 20
  },
  playBtn: {
    backgroundColor: "transparent",
    color: "#fff",
    border: "1px solid #fff",
    borderRadius: "50%",
    height: 30,
    width: 30,
    marginRight: 10,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
    cursor: "pointer",
    "& > svg": {
      fontSize: 18
    }
  }
});

const Player = ({ song, playerState, playSong, pauseSong }) => {
  const player = useRef(null);

  const classes = useStyle();

  useEffect(() => {
    if (player.current) {
      if (playerState.playing) {
        player.current.play();
      } else {
        player.current.pause();
      }
    }
  }, [playerState.playing]);

  const play = () => {
    if (player.current !== null || !playerState.playing) {
      player.current.pause();
    }

    fs.readFile(song.location, (err, data) => {
      const songDataURL = song
        ? `data:audio/${song.format.codec.toLowerCase()};base64,${data.toString(
            "base64"
          )}`
        : null;
      player.current = new Audio(songDataURL);
      player.current.play();
    });
  };

  const handlePlayPause = () => {
    if (playerState.playing) {
      pauseSong();
    } else {
      playSong();
    }
  };

  useEffect(() => {
    if (song) {
      play();
    }
  }, [song]);

  const { playing } = playerState;

  const picture =
    song && song.common && song.common.picture && song.common.picture[0]
      ? song.common.picture[0]
      : false;
  const albumArtDataURL = picture
    ? `data:image/jpeg;base64,${picture.data.toString("base64")}`
    : undefined;

  return (
    <div className={classes.root}>
      {song ? (
        <img
          className={classes.albumArt}
          src={albumArtDataURL}
          alt={"albumArt"}
        />
      ) : (
        <div className={classes.albumArt} style={{ background: "#000" }} />
      )}
      <button
        type={"button"}
        onClick={handlePlayPause}
        className={classes.playBtn}
      >
        {playing ? <PauseRounded /> : <PlayArrowRounded />}
      </button>
    </div>
  );
};

Player.propTypes = {
  playerState: PropTypes.shape({
    playing: PropTypes.bool
  }).isRequired,
  song: PropTypes.shape({
    format: PropTypes.objectOf(PropTypes.string),
    common: PropTypes.objectOf(PropTypes.string),
    location: PropTypes.string
  }),
  playSong: PropTypes.func.isRequired,
  pauseSong: PropTypes.func.isRequired
};

Player.defaultProps = {
  song: null
};

const mapDispatchToProps = {
  playSong: playSongAction,
  pauseSong: pauseSongAction,
  resumeSong: resumeSongAction
};

export default connect(
  null,
  mapDispatchToProps
)(Player);
