import React, { Component } from "react";
import path from "path";
import uuid from "uuid";
import { connect } from "react-redux";

import "./Home.css";
import { addSongs as addSongsAction } from "../redux/songs/songsActions";
import SongListItem from "./SongListItem";
import Player from "./Player";

const fs = window.require("fs");
const mm = window.require("music-metadata");
const { remote } = window.require("electron");

const readFile = filePath => {
  return mm.parseFile(filePath).catch(err => {
    console.error(err.message);
  });
};

class Home extends Component {
  state = {
    folderPath: "",
    files: []
  };

  readTree = entry => {
    fs.lstat(entry, async (err, stat) => {
      if (err) throw err;
      if (stat.isDirectory()) {
        fs.readdir(entry, (err, files) => {
          if (err) throw err;
          files.forEach(file => {
            this.readTree(path.join(entry, file));
          });
        });
      } else {
        const file = await readFile(entry);
        if (file) {
          const { addSongs } = this.props;
          addSongs([{ ...file, id: uuid(), location: entry }]);
        }
      }
    });
  };

  chooseFolderDialog = async () => {
    const { canceled, filePaths } = await remote.dialog.showOpenDialog({
      properties: ["openDirectory"]
    });

    if (!canceled) {
      const [folderPath] = filePaths;

      this.setState({ folderPath });
      this.readTree(folderPath);
    }
  };

  render() {
    const { folderPath } = this.state;
    const {
      songs: { all: allSongs },
      player,
      player: { activeSongId, playing }
    } = this.props;

    const activeSong = allSongs[activeSongId];

    return (
      <div className={"container"} data-tid="container">
        <div>
          <button onClick={this.chooseFolderDialog}>Choose folders</button>
          <p>{folderPath}</p>
        </div>
        <div>
          {Object.values(allSongs).map((metaData, index) => (
            <SongListItem
              playing={metaData.id === activeSongId && playing}
              key={metaData.id}
              metaData={metaData}
            />
          ))}
        </div>
        <Player song={activeSong} playerState={player} />
      </div>
    );
  }
}

const mapStateToProps = ({ songs, player }) => ({
  songs,
  player
});

const mapDispatchToProps = {
  addSongs: addSongsAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
