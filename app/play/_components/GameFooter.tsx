import React from 'react';
import { RulesModal } from './RulesModal';
import { ProvablyFairModal } from './ProvablyFairModal';

type GameFooterProps = {
  serverSeed: string | undefined;
  gameId: string | undefined;
};

export const GameFooter: React.FC<GameFooterProps> = ({ serverSeed, gameId }) => {
  return (
    <section className="w-full flex flex-row items-center p-1.5 border-t-2 border-secondary dark:border-dark_secondary">
      <RulesModal />
      <ProvablyFairModal
        serverSeed={serverSeed}
        gameId={gameId}
      />
    </section>
  );
};
