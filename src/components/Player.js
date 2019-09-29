import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import styles from "./Player.css";

import {
  playSong as playSongAction,
  pauseSong as pauseSongAction
} from "../redux/player/playerActions";

const fs = window.require("fs");

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.player = null;
  }

  componentDidUpdate(prevProps) {
    const { song, playerState } = this.props;
    if (song !== prevProps.song) {
      this.play();
    }

    if (
      this.player !== null &&
      playerState.playing !== prevProps.playerState.playing
    ) {
      if (playerState.playing) {
        this.player.play();
      } else {
        this.player.pause();
      }
    }
  }

  play = () => {
    const { song, playerState } = this.props;

    if (this.player !== null || !playerState.playing) {
      this.player.pause();
    }

    fs.readFile(song.location, (err, data) => {
      const songDataURL = song
        ? `data:audio/${song.format.codec.toLowerCase()};base64,` +
          data.toString("base64")
        : null;
      this.player = new Audio(songDataURL);
      this.player.play();
    });
  };

  handlePlayPause = () => {
    const { playerState, playSong, pauseSong } = this.props;
    console.log({ playSong, pauseSong });
    if (playerState.playing) {
      pauseSong();
    } else {
      playSong();
    }
  };

  render() {
    const {
      song,
      playerState: { playing }
    } = this.props;
    const picture =
      song && song.common && song.common.picture && song.common.picture[0]
        ? song.common.picture[0]
        : false;
    const albumArtDataURL = picture
      ? "data:image/jpeg;base64," + picture.data.toString("base64")
      : undefined;

    return (
      <div className={styles.root}>
        <img src={albumArtDataURL} />
        <button onClick={this.handlePlayPause} className={styles.playBtn}>
          <i className="material-icons">{playing ? "pause" : "play_arrow"}</i>
        </button>
      </div>
    );
  }
}

Player.propTypes = {
  playSong: PropTypes.func.isRequired,
  pauseSong: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  playSong: playSongAction,
  pauseSong: pauseSongAction
};

export default connect(
  null,
  mapDispatchToProps
)(Player);
