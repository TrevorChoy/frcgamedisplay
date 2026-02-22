import type { FRCMatch } from "../classes/FRCMatch";
import { TeamDisplay } from "./TeamDisplay";

type Props = {
  frcMatch: FRCMatch;
};

export const MatchDisplay: React.FC<Props> = ({ frcMatch}) => {
  return (
    <div
        className="datatable"
        style = {{backgroundColor: frcMatch.getColor()}}>
        <>{console.log(frcMatch)}</>
        <h3> {frcMatch.getName()} </h3>
        <TeamDisplay frcTeam={frcMatch.getRed1()}></TeamDisplay>
        <TeamDisplay frcTeam={frcMatch.getRed2()}></TeamDisplay>
        <TeamDisplay frcTeam={frcMatch.getRed3()}></TeamDisplay>
        <TeamDisplay frcTeam={frcMatch.getBlue1()}></TeamDisplay>
        <TeamDisplay frcTeam={frcMatch.getBlue2()}></TeamDisplay>
        <TeamDisplay frcTeam={frcMatch.getBlue3()}></TeamDisplay>
        <h3> {frcMatch.getWinnerState()} </h3>
    </div>
  );
};