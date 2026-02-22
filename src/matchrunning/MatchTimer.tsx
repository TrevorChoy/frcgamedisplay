import { useEffect, useState, useRef } from "react";
import { AUTOLENGTH, ENDGAMETIME, MatchState, PAUSELENGTH, TELEOPLENGTH } from "../Constants";

type MatchTimerProps = {
  onFinished: () => void;
};

export default function MatchTimer({ onFinished } : MatchTimerProps) {
  const [matchState, setMatchState] = useState<MatchState>(MatchState.IDLE);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const autoStartRef = useRef<HTMLAudioElement>(null);
  const autoEndRef = useRef<HTMLAudioElement>(null);
  const endgameRef = useRef<HTMLAudioElement>(null);
  const teleopEndRef = useRef<HTMLAudioElement>(null);

  // 🔥 Single timer engine
  useEffect(() => {
    if (matchState === MatchState.IDLE || matchState === MatchState.FINISHED) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);

          if (matchState === MatchState.AUTO) setMatchState(MatchState.PAUSE);
          else if (matchState === MatchState.PAUSE) setMatchState(MatchState.TELEOP);
          else if (matchState === MatchState.TELEOP) setMatchState(MatchState.FINISHED);

          return 0;
        }

        if (matchState === MatchState.TELEOP && prev === ENDGAMETIME + 1) {
          endgameRef.current?.play();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [matchState]);

  // 🔥 Handle matchState transitions
  useEffect(() => {
    if (matchState === MatchState.AUTO) {
      autoStartRef.current?.play();
      setTimeRemaining(AUTOLENGTH);
    }

    if (matchState === MatchState.PAUSE) {
      autoEndRef.current?.play();
      setTimeRemaining(PAUSELENGTH);
    }

    if (matchState === MatchState.TELEOP) {
      setTimeRemaining(TELEOPLENGTH);
    }

    if (matchState === MatchState.FINISHED) {
      teleopEndRef.current?.play();
      onFinished();
    }
  }, [matchState]);

  return (
    <div>
      <h1>{matchState.toUpperCase()}</h1>
      <h2>{timeRemaining}</h2>

      <button onClick={() => setMatchState(MatchState.AUTO)}>
        Start Match
      </button>

      <audio ref={autoStartRef} src="src\assets\audio\AutoStart.mp3"/>
      <audio ref={autoEndRef} src="src\assets\audio\AutoEnd.mp3" />
      <audio ref={endgameRef} src="src\assets\audio\EndgameStart.mp3" />
      <audio ref={teleopEndRef} src="src\assets\audio\TeleopEnd.mp3" />
    </div>
  );
}