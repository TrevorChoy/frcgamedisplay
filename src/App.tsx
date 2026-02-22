import { StrictMode, use, useEffect, useState } from 'react'
import './App.css'
import { FRCGame, GameConverter } from './classes/FRCGame'
import { FRCTeam } from './classes/FRCTeam';
import { TeamAddingMenu } from './ui/TeamAddingMenu';
import { generateQMs } from './util/QMGenerator';
import { DisplayState } from './Constants';
import { QMDisplay } from './ui/QMDisplay';
import { FRCMatch } from './classes/FRCMatch';
import MatchTimer from './matchrunning/MatchTimer';
import { AllianceDisplay } from './ui/AllianceDisplay';
//firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, runTransaction, get, onValue, type DatabaseReference } from "firebase/database";
import { collection, doc, Firestore, getDoc, getDocs, getFirestore, onSnapshot } from 'firebase/firestore';
import { persistData } from './firebase/FRCDatabase';
import { TeamRankingDisplay } from './ui/TeamRankingDisplay';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAc5Qkp_u4DuAY_0WG9rHOqJgEehbE1UeY",
  authDomain: "frcgamedisplay.firebaseapp.com",
  projectId: "frcgamedisplay",
  storageBucket: "frcgamedisplay.firebasestorage.app",
  messagingSenderId: "349409939421",
  appId: "1:349409939421:web:2c636b79b95bbd5833b034",
  measurementId: "G-QM4M63T19S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

function App() {
  const [displayState, setDisplayState] = useState<DisplayState>(DisplayState.SETUP);
  const [game, setGame] = useState(new FRCGame);
  const [teamToBeAdded, setTeamToBeAdded] = useState(new FRCTeam(""));
  const [gameID, setGameID] = useState("");
  //for handling trying to create a game that already exists or trying to load a game that doesnt exist
  const [gameExists, setGameExists] = useState(false);
  //const [currentMatch, setCurrentMatch] = useState(new FRCMatch(new FRCTeam(""), new FRCTeam(""), new FRCTeam(""), new FRCTeam(""), new FRCTeam(""), new FRCTeam(""), ""))

  window.onload = function () {
    
  }

  function loadCurrentGame(){
    console.log("loadcurrentgame");
    const docRef = doc(firestore, "games", gameID);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log("snapshot updated");
        const updatedGame = GameConverter.fromFirestore(snapshot);
        setGame(updatedGame);
      }
    });
  }

  useEffect(() => {
    if (!gameID) return;

    const docRef = doc(firestore, "games", gameID);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log("snapshot updated");
        const updatedGame = GameConverter.fromFirestore(snapshot);
        setGame(updatedGame);
      }
    });

    return () => unsubscribe(); // cleanup
  }, [gameID]);

  return (
    <>
      {displayState === DisplayState.SETUP && (
        <div>
          <button
            onClick={() => {
              setDisplayState(DisplayState.ENTEROLDID);
            }}>
            Load Existing Game
          </button>
          <button
            onClick={() => {
              setDisplayState(DisplayState.ENTERNEWID);
            }}>
            Start New Game
          </button>
        </div>
      )}

      {displayState === DisplayState.ENTEROLDID && (
        <div>
          <input
            type="text"
            value={gameID}
            onChange={async (e) => {
              const name = e.target.value.trim();
              setGameID(name);

              if (!name) {
                setGameExists(false);
                return;
              }

              const docRef = doc(firestore, "games", name);
              const docSnap = await getDoc(docRef);

              setGameExists(docSnap.exists()); // true if duplicate
            }}
            placeholder="game name"
          />

          {!gameExists && (
            <p style={{ color: "red" }}>
              Enter in an existing game name
            </p>
          )}

          <button
            // disable button if trying to create a repeat game
            disabled={!gameExists}
            onClick={async () => {
              const docRef = doc(firestore, "games", gameID);
              const docSnap = await getDoc(docRef);

              console.log(docSnap.data());

              setGame(GameConverter.fromFirestore(docSnap))
              setDisplayState(DisplayState.DISPLAYQMS);
            }}>
            Start Game
          </button>
        </div>
      )}

      {displayState === DisplayState.ENTERNEWID && (
        <div>
          <input
            type="text"
            value={gameID}
            onChange={async (e) => {
              const name = e.target.value.trim();
              setGameID(name);

              if (!name) {
                setGameExists(false);
                return;
              }

              const docRef = doc(firestore, "games", name);
              const docSnap = await getDoc(docRef);

              setGameExists(docSnap.exists()); // true if duplicate
            }}
            placeholder="name of your game"
          />

          {gameExists && (
            <p style={{ color: "red" }}>
              That game name is already in use. Try a different one.
            </p>
          )}

          <button
            // disable button if trying to create a repeat game
            disabled={gameExists}
            onClick={() => {
              setGame(game.withTestTeams());
              setDisplayState(DisplayState.NEWGAMESETUP);
            }}>
            Start Game
          </button>
        </div>
      )}

      {displayState === DisplayState.NEWGAMESETUP && (
        <div className="card">
          <h1>Setup</h1>
          {/** set number of qms */}
          <input
            type="number"
            onChange={(e) => {
              game.setNumQMs(parseInt(e.target.value) | 0);

              console.log(e.target.value);
              console.log("game qms: " + game.getNumQMs());
            }}
            placeholder="number of QMs"
          />

          <div
            className = "menu">
            <h3>add team</h3>
            {/** set team name of team to be added */}
            <input
              type="string"
              onChange={(e) => {
                teamToBeAdded.setTeamName(e.target.value);
              }}
              placeholder="team name"
            />

            {/** set hex color of team to be added */}
            <input
              type="string"
              onChange={(e) => {
                teamToBeAdded.setTeamColor(e.target.value);
              }}
              placeholder="team color (hex)"
            />

            {/** button to add team and reset fields */}
            <button
                onClick={() => {
                  setGame(game.withTeam(teamToBeAdded));
                  setTeamToBeAdded(new FRCTeam(""));
                  console.log(game.getTeams());
                }}>
                Add Team
            </button>
          </div>

          <button
            onClick={() => {
              setGame(game.withQMMatches(generateQMs(game)))
              setDisplayState(DisplayState.DISPLAYQMS);
            }}>
            Start Game
          </button>

          <TeamAddingMenu 
            frcGame={game}
            onRemove={(index: number) => setGame(prev => prev.withTeamRemovedAtIndex(index))}>
          </TeamAddingMenu>
        </div>
      )}

      {displayState === DisplayState.DISPLAYQMS && (
        <div className="card">
          <h1>QMs</h1>
          <div className='sidebyside'>
            <QMDisplay frcGame={game}></QMDisplay>
            <TeamRankingDisplay frcGame={game}></TeamRankingDisplay>
          </div>
          <button
            onClick = {() => {
              setDisplayState(DisplayState.RUNMATCH);
              persistData(firestore, "games", gameID, GameConverter.toFirestore(game));
            }}>
            Start Match
          </button>
        </div>
      )}

      {displayState === DisplayState.RUNMATCH && (
        <div className="card">
          <StrictMode>
            <MatchTimer onFinished={
              function (): void {
                const match = game.getCurrentQMMatch();
                match.setPlayed(true);
                const updatedGame = game.withUpdatedCurrentMatch(match);
                persistData(firestore, "games", gameID, GameConverter.toFirestore(updatedGame));
                setDisplayState(DisplayState.FINISHMATCH);
            }}/>
          </StrictMode>
          <div className = "datatable">
            <AllianceDisplay frcAlliance = {game.getQMMatches()[game.getCurrentQMNumber() - 1].getRedAlliance()} endScreen = {true}></AllianceDisplay>
            <AllianceDisplay frcAlliance = {game.getQMMatches()[game.getCurrentQMNumber() - 1].getBlueAlliance()} endScreen = {true}></AllianceDisplay>
          </div>
        </div>
      )}

      {displayState === DisplayState.FINISHMATCH && (
        <div className="card">
          <div style={{backgroundColor: game.getCurrentQMMatch().getColor()}}>
            <h2>Winner: {game.getCurrentQMMatch().getWinnerState()}</h2>
          </div>
          <button
            onClick = {() => {
              const updatedGame = game.iterateQM()
              setGame(updatedGame);
              persistData(firestore, "games", gameID, GameConverter.toFirestore(updatedGame));
              setDisplayState(DisplayState.DISPLAYQMS);
            }}>
            Display QMs
          </button>
          <div className = "datatable">
            <AllianceDisplay frcAlliance = {game.getQMMatches()[game.getCurrentQMNumber() - 1].getRedAlliance()} endScreen = {true}></AllianceDisplay>
            <AllianceDisplay frcAlliance = {game.getQMMatches()[game.getCurrentQMNumber() - 1].getBlueAlliance()} endScreen = {true}></AllianceDisplay>
          </div>
        </div>
      )}
    </>
  )
}

export default App
