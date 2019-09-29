import React, { useState } from "react";
import path from "path";
import makeStyles from "@material-ui/styles/makeStyles";
import uuid from "uuid";
import { connect } from "react-redux";

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

const useStyles = makeStyles({
  "@global": {
    body: {
      fontFamily: "Sans Serif"
    }
  },
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#223",
    color: "white",
    height: "100vh"
  },
  songsList: {
    flexGrow: 1
  }
});

const Home = ({ songs, player, addSongs }) => {
  const [folderPath, setFolderPath] = useState("");

  const { all: allSongs } = songs;
  const { activeSongId, playing } = player;

  const classes = useStyles();

  const readTree = entry => {
    fs.lstat(entry, async (err, stat) => {
      if (err) throw err;
      if (stat.isDirectory()) {
        fs.readdir(entry, (readdirErr, files) => {
          if (readdirErr) throw readdirErr;
          files.forEach(file => {
            readTree(path.join(entry, file));
          });
        });
      } else {
        const file = await readFile(entry);
        if (file) {
          addSongs([{ ...file, id: uuid(), location: entry }]);
        }
      }
    });
  };

  const chooseFolderDialog = async () => {
    const { canceled, filePaths } = await remote.dialog.showOpenDialog({
      properties: ["openDirectory"]
    });

    if (!canceled) {
      setFolderPath(filePaths[0]);
      readTree(filePaths[0]);
    }
  };

  const activeSong = allSongs[activeSongId];

  return (
    <div className={classes.container}>
      <div>
        <button type={"button"} onClick={chooseFolderDialog}>
          Choose folders
        </button>
        <p>{folderPath}</p>
      </div>
      <div className={classes.songsList}>
        {Object.values(allSongs).map(metaData => (
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
};

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
