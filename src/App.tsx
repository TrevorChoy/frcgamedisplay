import { StrictMode, use, useState } from 'react'
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
import { doc, Firestore, getDoc, getFirestore } from 'firebase/firestore';
import { persistData } from './firebase/FRCDatabase';

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
  const [currentMatch, setCurrentMatch] = useState(new FRCMatch(new FRCTeam(""), new FRCTeam(""), new FRCTeam(""), new FRCTeam(""), new FRCTeam(""), new FRCTeam(""), ""))

  window.onload = function () {
    setGame(game.withTestTeams());
  }

  return (
    <>
      {displayState === DisplayState.SETUP && (
        <div>
          <button
            onClick={async () => {
              const docRef = doc(firestore, "games", "testgame");
              const docSnap = await getDoc(docRef);

              console.log(docSnap.data());

              setGame(GameConverter.fromFirestore(docSnap))
              setDisplayState(DisplayState.DISPLAYQMS);
            }}>
            Load Existing Game
          </button>
          <button
            onClick={() => {
              setDisplayState(DisplayState.NEWGAMESETUP);
            }}>
            Start New Game
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
          <QMDisplay frcGame={game}></QMDisplay>
          <button
            onClick = {() => {
              setCurrentMatch(game.getQMMatches()[game.getCurrentQMNumber()]);
              setDisplayState(DisplayState.MATCH);

              persistData(firestore, "games", "testgame", GameConverter.toFirestore(game));
            }}>
            Start Match
          </button>
        </div>
      )}

      {displayState === DisplayState.MATCH && (
        <div className="card">
          <StrictMode>
            <MatchTimer />
          </StrictMode>
          <div className = "datatable">
            <AllianceDisplay frcAlliance = {game.getQMMatches()[game.getCurrentQMNumber()].getRedAlliance()} endScreen = {true}></AllianceDisplay>
            <AllianceDisplay frcAlliance = {game.getQMMatches()[game.getCurrentQMNumber()].getBlueAlliance()} endScreen = {true}></AllianceDisplay>
          </div>
        </div>
      )}
    </>
  )
}

export default App
