import React, { useEffect, useState } from 'react';
import Login from "./Login";
import SpotifyWebApi from "spotify-web-api-js";
import './App.css';
import { getTokenFromUrl } from './spotify';
import Player from "./Player";
import { useStateValue } from "./StateProvider";

const spotify = new SpotifyWebApi();

function App() {
  
  const [{ user, token }, dispatch ] = useStateValue();

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = "";

    const _token = hash.access_token;
    if(_token) {
       dispatch({
         type:"SET_TOKEN",
         token: _token,
       })
      
      spotify.setAccessToken(_token);
      spotify.getMe().then((user) => {
        dispatch({
          type: 'SET_USER',
          user: user,
        });
      });
      spotify.getUserPlaylists().then((playlists) => {
        dispatch({
          type: "SET_PLAYLISTS",
          playlists,
        });
      });

      spotify.getPlaylist('37i9dQZF1DX44F1QWqYoaV').then((response) => 
        dispatch({
          type: "SET_DISCOVER_WEEKLY",
          discover_weekly: response,
        })
   
      );
    }
    

  }, []);
  //console.log( "this is me", user);
  //console.log("this is token", token);
  return (
    <div className="App">
      {token ? <Player spotify={spotify} /> : <Login /> }
    </div>
  );
}

export default App;
