import React, { useState } from "react";
import type { FRCTeam } from "../classes/FRCTeam";
import type { FRCGame } from "../classes/FRCGame";

type Props = {
  frcGame: FRCGame;
  onRemove: (index: number) => void;
};

export const TeamAddingMenu: React.FC<Props> = ({ frcGame, onRemove }) => {
  return (
    <div>
      {frcGame.getTeams().map((team, index) => (
        <div
            style = {{ backgroundColor: team.getTeamColor()}}
            key={index} 
            className="row">
            {team.getTeamName()}
            <button
                className = "removeButton"
                onClick={() => onRemove(index)}>
                remove
            </button>
        </div>
      ))}
    </div>
  );
};