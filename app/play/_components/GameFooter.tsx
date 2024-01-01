import React from 'react';
import { GameRulesModal } from './GameRulesModal';
import { ProvablyFairModal } from './ProvablyFairModal';

type GameFooterProps = {
  serverSeed: string | undefined;
};

export const GameFooter: React.FC<GameFooterProps> = ({ serverSeed }) => {
  return (
    <section className="bg-black/30 w-full h-10 flex flex-col">
      <span className="w-full h-[3px] bg-secondary dark:bg-dark_secondary"></span>
      <div className="w-full h-10 flex items-center px-2">
        <GameRulesModal />
        <ProvablyFairModal serverSeed={serverSeed} />
      </div>
    </section>
  );
};
