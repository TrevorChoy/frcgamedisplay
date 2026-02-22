import React, { useState } from "react";
import type { FRCTeam } from "../classes/FRCTeam";
import type { FRCGame } from "../classes/FRCGame";

type Props = {
  frcGame: FRCGame;
};

export const TeamRankingDisplay: React.FC<Props> = ({ frcGame }) => {
  return (
    <div>
      {
      frcGame.getTeams().sort((a, b) => b.getAverageRP(frcGame.getQMMatches()) - a.getAverageRP(frcGame.getQMMatches())).map((team, index) => (
        <div
            style = {{ backgroundColor: team.getTeamColor()}}
            key={index} 
            className="row">
            <h3>{team.getTeamName()}</h3>
            <h3>{team.getAverageRP(frcGame.getQMMatches())}</h3>
        </div>
      ))}
    </div>
  );
};