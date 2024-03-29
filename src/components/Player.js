import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import makeStyles from "@material-ui/styles/makeStyles";
import withStyles from "@material-ui/styles/withStyles";
import PlayIcon from "@material-ui/icons/PlayArrowRounded";
import PlayNextIcon from "@material-ui/icons/SkipNextRounded";
import PlayPreviousIcon from "@material-ui/icons/SkipPreviousRounded";
import PauseIcon from "@material-ui/icons/PauseRounded";
import MUISlider from "@material-ui/core/Slider";
import VolumeOff from "@material-ui/icons/VolumeOff";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeMute from "@material-ui/icons/VolumeMute";
import VolumeUp from "@material-ui/icons/VolumeUp";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { connect } from "react-redux";

import {
  playSong as playSongAction,
  pauseSong as pauseSongAction,
  resumeSong as resumeSongAction,
  playNextSong as playNextSongAction,
  playPrevSong as playPrevSongAction
  // setTotalDuration as setTotalDurationAction
} from "../redux/player/playerActions";

const fs = window.require("fs");

const Slider = withStyles({
  root: {
    color: "#52af77",
    height: 8
  },
  thumb: {
    height: 15,
    width: 15,
    backgroundColor: "#fff",
    // border: "2px solid currentColor",
    transformOrigin: "center",
    transform: "translate(0, 0)",
    boxShadow: "0 0 4px 2px #fff6",
    "&:hover,&$active": {
      boxShadow: "inherit",
      transform: "scale(1.2)"
    }
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)"
  },
  track: {
    height: 4,
    borderRadius: 2
  },
  rail: {
    height: 4,
    borderRadius: 2
  }
})(MUISlider);

const useStyle = makeStyles({
  root: {
    width: "100%",
    maxHeight: 60,
    minHeight: 60,
    backgroundColor: "#222",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    transitionDuration: "1s",
    "&.expandedView": {
      width: "100vw",
      height: "100vh",
      top: 0
    }
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
  },
  volumeContainer: {
    display: "flex",
    "& > svg": {
      marginRight: 10
    }
  },
  songPlaybackProgress: {
    flexGrow: 1,
    display: "flex",
    "& > *": {
      margin: 10,
      alignItems: "center"
    }
  },
  progessSlider: {},
  volumeSlider: {
    width: 100
  }
});

const Player = ({
  song,
  playerState,
  playSong,
  pauseSong,
  playNextSong,
  playPrevSong
}) => {
  const classes = useStyle();
  const player = useRef(null);
  const [totalDuration, setTotalDuration] = useState();
  const [playedDuration, setPlayedDuration] = useState();
  const [expandedView, setExpadedView] = useState(false);
  const [volume, setVolume] = React.useState(30);

  const handleChange = (event, newVolume) => {
    if (player.current) {
      player.current.volume = newVolume / 100;
    }
  };

  const handleSeek = (event, newValue) => {
    if (player.current) {
      player.current.currentTime = totalDuration * (newValue / 100);
    }
  };

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
    if (player.current !== null) {
      player.current.pause();
    }

    fs.readFile(song.location, (err, data) => {
      const songDataURL = song
        ? `data:audio/${song.codec.toLowerCase()};base64,${data.toString(
            "base64"
          )}`
        : null;
      player.current = new Audio(songDataURL);
      player.current.addEventListener("loadeddata", () => {
        setTotalDuration(player.current.duration);
      });
      player.current.addEventListener("timeupdate", () => {
        setPlayedDuration(player.current.currentTime);
      });
      player.current.addEventListener("volumechange", () => {
        setVolume(player.current.volume);
      });
      player.current.addEventListener("ended", () => {
        playNextSong();
      });
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

  const albumArt = song && song.albumArt ? song.albumArt : false;

  const albumArtDataURL = albumArt
    ? `data:image/jpeg;base64,${albumArt.data.toString("base64")}`
    : undefined;

  return (
    <div className={clsx(classes.root, { expandedView })}>
      {song ? (
        <img
          role={"presentation"}
          onClick={() => setExpadedView(!expandedView)}
          className={classes.albumArt}
          src={albumArtDataURL}
          alt={"albumArt"}
        />
      ) : (
        <div className={classes.albumArt} style={{ background: "#000" }} />
      )}
      <button
        type={"button"}
        onClick={playPrevSong}
        className={classes.playBtn}
      >
        <PlayPreviousIcon />
      </button>
      <button
        type={"button"}
        onClick={handlePlayPause}
        className={classes.playBtn}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <button
        type={"button"}
        onClick={playNextSong}
        className={classes.playBtn}
      >
        <PlayNextIcon />
      </button>
      <div className={classes.songPlaybackProgress}>
        <span>
          {moment.duration(totalDuration, "seconds").format("mm:ss", {
            trim: false
          })}
        </span>
        <Slider
          classes={{ root: classes.progessSlider }}
          value={(playedDuration / totalDuration) * 100}
          aria-labelledby={"continuous-slider"}
          onChange={handleSeek}
        />
        <span>
          {moment.duration(playedDuration, "seconds").format("mm:ss", {
            trim: false
          })}
        </span>
      </div>
      <div className={classes.volumeContainer}>
        <VolumeUp />
        <Slider
          classes={{ root: classes.volumeSlider }}
          value={volume * 100}
          onChange={handleChange}
          aria-labelledby={"continuous-slider"}
        />
      </div>
    </div>
  );
};

Player.propTypes = {
  playerState: PropTypes.shape({
    playing: PropTypes.bool
  }).isRequired,
  song: PropTypes.shape({
    codec: PropTypes.string,
    title: PropTypes.string,
    location: PropTypes.string,
    albumArt: PropTypes.string
  }),
  playSong: PropTypes.func.isRequired,
  pauseSong: PropTypes.func.isRequired,
  playNextSong: PropTypes.func.isRequired,
  playPrevSong: PropTypes.func.isRequired
};

Player.defaultProps = {
  song: null
};

const mapDispatchToProps = {
  playSong: playSongAction,
  pauseSong: pauseSongAction,
  resumeSong: resumeSongAction,
  playNextSong: playNextSongAction,
  playPrevSong: playPrevSongAction
};

export default connect(
  null,
  mapDispatchToProps
)(Player);
