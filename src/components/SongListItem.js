import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "./SongLIstItem.css";

import {
  playSong as playSongAction,
  pauseSong as pauseSongAction
} from "../redux/player/playerActions";

function SongListItem({ metaData, playing, playSong }) {
  const {
    common: { title, artist, album }
  } = metaData;

  console.log(metaData);
  const picture =
    metaData.common && metaData.common.picture && metaData.common.picture[0]
      ? metaData.common.picture[0]
      : false;
  const albumArtDataURL = picture
    ? "data:image/jpeg;base64," + picture.data.toString("base64")
    : undefined;

  return (
    <div onClick={() => playSong(metaData.id)} className={"root"}>
      <img src={albumArtDataURL} />
      <button className={"playBtn"}>
        <i className="material-icons">{playing ? "pause" : "play_arrow"}</i>
      </button>
      <p>{title}</p>
      <audio src={metaData.location} />
    </div>
  );
}

SongListItem.propTypes = {
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
)(SongListItem);
