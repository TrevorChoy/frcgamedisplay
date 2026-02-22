import type { FRCAlliance } from "../classes/FRCAlliance";
import { TeamDisplay } from "./TeamDisplay";

type Props = {
  frcAlliance: FRCAlliance;
  endScreen: boolean
};

export const AllianceDisplay: React.FC<Props> = ({ frcAlliance, endScreen = false}) => {
  return (
    <div
        style = {{backgroundColor: frcAlliance.getColor()}}>
        {/* <>{console.log(frcAlliance)}</> */}
        <h2> {frcAlliance.getTotalPoints()} </h2>
        <div 
          className = "datatable"
          style = {{backgroundColor: "transparent"}}>
          <TeamDisplay frcTeam={frcAlliance.getTeam1()}></TeamDisplay>
          <TeamDisplay frcTeam={frcAlliance.getTeam3()}></TeamDisplay>
          <TeamDisplay frcTeam={frcAlliance.getTeam2()}></TeamDisplay>
        </div>
        <h3>{"Energized RP: " + (frcAlliance.getEnergizedRP() ? "✅" : "❌")}</h3>
        <h3>{"Supercharged RP: " + (frcAlliance.getSuperchargedRP() ? "✅" : "❌")}</h3>
        <h3>{"Traversal RP: " + (frcAlliance.getTraversalRP() ? "✅" : "❌")}</h3>

        {endScreen &&(
          <div>
            <h3>{"Fuels: " + (frcAlliance.getAutoFuels() + frcAlliance.getTeleopFuels())}</h3>
            <h3>{"Climb: " + (frcAlliance.getAutoClimbPoints() + frcAlliance.getEndgameClimbPoints())}</h3>
            <h3>{"Fouls: " + (frcAlliance.getFouls() + frcAlliance.getTechFouls())}</h3>
          </div>
        )}
    </div>
  );
};