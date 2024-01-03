import React from 'react';
import { RulesModal } from './RulesModal';
import { ProvablyFairModal } from './ProvablyFairModal';

type GameFooterProps = {
  serverSeed: string | undefined;
  gameId: string | undefined;
};

export const GameFooter: React.FC<GameFooterProps> = ({ serverSeed, gameId }) => {
  return (
    <section className="w-full h-10 flex flex-col">
      <span className="w-full h-[3px] bg-secondary dark:bg-dark_secondary"></span>
      <div className="w-full h-10 flex items-center px-2">
        <RulesModal />
        <ProvablyFairModal
          serverSeed={serverSeed}
          gameId={gameId}
        />
      </div>
    </section>
  );
};
