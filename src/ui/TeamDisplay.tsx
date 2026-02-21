import type { FRCTeam } from "../classes/FRCTeam";

type Props = {
  frcTeam: FRCTeam;
};

export const TeamDisplay: React.FC<Props> = ({ frcTeam}) => {
  return (
    <div
        className = "team"
        style = {{backgroundColor: frcTeam.getTeamColor()}}>
        <h3>{frcTeam.getTeamName()}</h3>
    </div>
  );
};