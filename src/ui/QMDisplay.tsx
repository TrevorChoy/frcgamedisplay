import type { FRCGame } from "../classes/FRCGame";
import { MatchDisplay } from "./MatchDisplay";

type Props = {
  frcGame: FRCGame;
};

export const QMDisplay: React.FC<Props> = ({ frcGame}) => {
  return (
    <div>
      {frcGame.getQMMatches().map((match, index) => (
        <div
            key={index}>
            <MatchDisplay frcMatch={match}></MatchDisplay>
        </div>
      ))}
    </div>
  );
};