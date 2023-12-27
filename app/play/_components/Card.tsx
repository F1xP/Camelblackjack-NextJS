import { CardBackSVG } from '@/app/_components/ui/CardBackSVG';
import { suitIcons } from '@/app/_components/ui/Suits';
import { cn } from '@/lib/utils';

export const Card: React.FC<{
  index: number;
  rank: string;
  suit: string;
  status: { state: string; text: string } | null;
  isCurrent: boolean;
  isSplitted: boolean;
}> = ({ index, rank, suit, status, isCurrent, isSplitted }) => {
  return (
    <div
      className={cn(
        'flip-card w-[3.5rem] h-[5.5rem] md:w-16 md:h-24 xl:w-20 xl:h-32 bg-transparent rounded-md shadow-sm shadow-black p-card-animation border-2 xl:border-3 bg-white',
        isCurrent && !status && isSplitted
          ? 'border-accentBlue'
          : status?.state === 'Push'
          ? 'border-accent'
          : status?.state === 'Lose' || status?.state === 'DBJ'
          ? 'border-accentRed'
          : status?.state === 'Win' || status?.state === 'PBJ'
          ? 'border-accentGreen'
          : 'border-transparent'
      )}
      style={{
        animationDelay: `${index * 250}ms`,
        marginTop: `${index}rem`,
        marginLeft: index > 0 ? '-2.4rem' : '0',
        transform: `translate(0px, 1000px)`,
      }}>
      <div
        className="flip-card-inner card-flip-animation"
        style={{
          animationDelay: `${index * 250}ms`,
        }}>
        <CardFront
          suit={suit}
          rank={rank}
        />
        <CardBack />
      </div>
    </div>
  );
};

const CardFront: React.FC<{ suit: string; rank: string }> = ({ suit, rank }) => {
  const { icon, suitColor } = suitIcons()[suit as keyof typeof suitIcons] || {};

  return (
    <div className="flip-card-front flex self-start">
      <div className="flex flex-col items-center ml-0.5 5 md:ml-1">
        <p
          className={`font-mono text-2xl md:text-4xl xl:text-5xl font-bold`}
          style={{ color: suitColor }}>
          {rank}
        </p>
        <div style={{ color: suitColor }}>{icon}</div>
      </div>
    </div>
  );
};

const CardBack: React.FC = () => {
  return (
    <>
      <div className="flip-card-back h-full w-full overflow-hidden rounded-md relative bg-white">
        <div className="overflow-hidden h-full w-full rounded-md">
          <CardBackSVG
            fill="#ddb814"
            color="#ffffff"
          />
        </div>
      </div>
    </>
  );
};

export const DownCard: React.FC = () => {
  return (
    <div
      className="w-[3.5rem] h-[5.5rem] md:w-16 md:h-24 xl:w-20 xl:h-32 bg-transparent rounded-md shadow-sm shadow-black p-card-animation bg-white border-3 border-transparent"
      style={{
        animationDelay: `${1 * 250}ms`,
        marginTop: `${1}rem`,
        marginLeft: 1 > 0 ? '-2.4rem' : '0',
        transform: `translate(0px, 1000px)`,
      }}>
      <div
        className="flip-card-inner"
        style={{
          animationDelay: `${1 * 250}ms`,
        }}>
        <div className="flip-card-back">
          <CardBack />
        </div>
      </div>
    </div>
  );
};
