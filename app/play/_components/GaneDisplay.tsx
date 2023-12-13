'use client';
import { suitIcons } from '@/app/_components/Suits';
import { cn } from '@/lib/utils';
import { Card } from '@/types/types';
import { GameState } from '@prisma/client';
import Image from 'next/image';

type GameDisplayProps = {
  gameState: GameState | null;
  currentHand: number;
  isSplitted: boolean;
  gameStatus1: string | null;
  gameStatus2: string | null;
  gameId: string | undefined;
};

export const GameDisplay: React.FC<GameDisplayProps> = ({
  gameState,
  currentHand,
  isSplitted,
  gameStatus1,
  gameStatus2,
  gameId,
}) => {
  return (
    <>
      <section className="bg-black/30 w-full flex-[2] rounded-r-lg text-text overflow-hidden relative  pointer-events-none">
        <Decoration />
        <div className="flex flex-col justify-between h-full p-2">
          <div className="w-full flex justify-around flex-row-reverse absolute bottom-1">
            <Hand
              cards={gameState?.player[0].cards}
              handValues={
                <>
                  {gameState?.player[0].value[0]}
                  {gameState?.player[0].value[1] && `,${gameState?.player[0].value[1]}`}
                </>
              }
              gameStatus={gameStatus1}
              isCurrent={currentHand === 0}
              isSplitted={isSplitted}
              gameId={gameId}
            />
            {isSplitted && (
              <Hand
                cards={gameState?.player[1].cards}
                handValues={
                  <>
                    {gameState?.player[1].value[0]}
                    {gameState?.player[1].value[1] && `,${gameState?.player[1].value[1]}`}
                  </>
                }
                gameStatus={gameStatus2}
                isCurrent={currentHand === 1}
                isSplitted={isSplitted}
                gameId={gameId}
              />
            )}
          </div>
          <div className="w-full flex justify-around flex-row-reverse absolute top-1">
            <Hand
              cards={gameState?.dealer.cards}
              downCard={gameState?.dealer.cards.length === 1}
              handValues={<>{gameState?.dealer.value}</>}
              gameStatus={null}
              isCurrent={false}
              isSplitted={false}
              gameId={gameId}
            />
          </div>
        </div>
      </section>
    </>
  );
};

type HandProps = {
  cards: Card[] | undefined;
  downCard?: boolean;
  handValues: React.ReactNode;
  gameStatus: string | null;
  isCurrent: boolean;
  isSplitted: boolean;
  gameId: string | undefined;
};

const Hand: React.FC<HandProps> = ({ cards, downCard, handValues, gameStatus, isCurrent, isSplitted, gameId }) => {
  return (
    <div className="flex items-center justify-center flex-col relative">
      <Result
        status={gameStatus}
        values={handValues}
        gameStatus={gameStatus}
        isCurrent={isCurrent}
        isSplitted={isSplitted}
      />
      <div className="flex relative item-start mt-1 min-h-[7.9rem] min-w-[5rem]">
        {cards?.map((card: any, index: number) => (
          <>
            <Card
              key={`${card?.rank}${card?.suit}${index}${gameId}`}
              index={index}
              rank={card?.rank}
              suit={card?.suit}
              gameStatus={gameStatus}
              isCurrent={isCurrent}
              isSplitted={isSplitted}
            />
            {downCard && <DownCard />}
          </>
        ))}
      </div>
    </div>
  );
};

const Card: React.FC<{
  index: number;
  rank: string;
  suit: string;
  gameStatus: string | null;
  isCurrent: boolean;
  isSplitted: boolean;
}> = ({ index, rank, suit, gameStatus, isCurrent, isSplitted }) => {
  return (
    <div
      className={cn(
        'flip-card w-[3.5rem] h-[5.5rem] md:w-16 md:h-24 xl:w-20 xl:h-32 bg-transparent rounded-md shadow-sm shadow-black p-card-animation border-3 bg-white',
        isCurrent && !gameStatus && isSplitted
          ? 'border-accentBlue'
          : gameStatus === 'PUSH'
          ? 'border-accent'
          : gameStatus === 'Lose' || gameStatus === 'Blackjack Dealer'
          ? 'border-accentRed'
          : gameStatus === 'Win' || gameStatus === 'Blackjack Player'
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

const Result: React.FC<{
  status: string | null;
  values: React.ReactNode;
  gameStatus: string | null;
  isCurrent: boolean;
  isSplitted: boolean;
}> = ({ status, values, gameStatus, isCurrent, isSplitted }) => (
  <div className="flex flex-col gap-0.5">
    {status && (
      <p
        className={cn(
          'px-2 text-black font-bold font-mono rounded-sm text-center',
          isCurrent && !gameStatus && isSplitted
            ? 'bg-accentBlue'
            : gameStatus === 'PUSH'
            ? 'bg-accent'
            : gameStatus === 'Lose' || gameStatus === 'Blackjack Dealer'
            ? 'bg-accentRed'
            : gameStatus === 'Win' || gameStatus === 'Blackjack Player'
            ? 'bg-accentGreen'
            : 'bg-text'
        )}>
        {status}
      </p>
    )}
    <p
      className={cn(
        'px-2 text-black font-bold font-mono rounded-sm text-center',
        isCurrent && !gameStatus && isSplitted
          ? 'bg-accentBlue'
          : gameStatus === 'PUSH'
          ? 'bg-accent'
          : gameStatus === 'Lose' || gameStatus === 'Blackjack Dealer'
          ? 'bg-accentRed'
          : gameStatus === 'Win' || gameStatus === 'Blackjack Player'
          ? 'bg-accentGreen'
          : 'bg-text'
      )}>
      {values}
    </p>
  </div>
);

const Decoration: React.FC = () => {
  return (
    <>
      <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
        <Image
          src="/CamelBlackjackLogo.png"
          className="opacity-5"
          alt=""
          width={400}
          height={400}
        />
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
        <p className="font-bold font-mono text-xl md:text-2xl text-center bg-background px-3 py-1 rounded-md whitespace-nowrap">
          BLACKJACK PAYS 3 TO 2
        </p>
        <p className="font-bold font-mono text-lg md:text-xl text-center bg-transparent px-3 py-1 rounded-md whitespace-nowrap">
          INSURANCE PAYS 2 TO 1
        </p>
      </div>
    </>
  );
};

const CardFront: React.FC<{ suit: string; rank: string }> = ({ suit, rank }) => {
  const { icon, suitColor } = suitIcons(32)[suit as keyof typeof suitIcons] || {};

  return (
    <div className="flip-card-front">
      <p
        className={`font-mono text-3xl md:text-5xl font-bold ml-2`}
        style={{ color: suitColor }}>
        {rank}
      </p>
      <div
        className="ml-1 mt-1"
        style={{ color: suitColor }}>
        {icon}
      </div>
    </div>
  );
};

const CardBack: React.FC = () => {
  return (
    <>
      <div className="flip-card-back h-full w-full overflow-hidden rounded-md relative bg-white">
        <div className="overflow-hidden h-full w-full rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width="1440"
            height="560"
            preserveAspectRatio="none"
            viewBox="0 0 1440 560">
            <g
              clip-path='url("#SvgjsClipPath1088")'
              fill="none">
              <rect
                width="1440"
                height="560"
                x="0"
                y="0"
                fill="rgba(221, 184, 20, 1)"></rect>
              <circle
                r="93.335"
                cx="-27.13"
                cy="76.73"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="93.335"
                cx="352.44"
                cy="318.86"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="93.335"
                cx="657.16"
                cy="806.53"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="120.72"
                cx="365.15"
                cy="286.32"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="99.125"
                cx="935.83"
                cy="535.83"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="75.295"
                cx="1403.61"
                cy="437.76"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="171.2"
                cx="719.93"
                cy="300.5"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="153.045"
                cx="1215.81"
                cy="223.26"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="123.155"
                cx="1423.98"
                cy="547.74"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="168.94"
                cx="503.89"
                cy="249.69"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="142.17"
                cx="1252.75"
                cy="151.78"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="164.485"
                cx="1023.45"
                cy="443.54"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="145.28"
                cx="939.76"
                cy="7.56"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="82.435"
                cx="308.76"
                cy="188.57"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="156.795"
                cx="991.88"
                cy="433.25"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="152.23"
                cx="2.27"
                cy="260.64"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="75.155"
                cx="1264.29"
                cy="386.42"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="128.475"
                cx="128.47"
                cy="502.1"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="129.59"
                cx="1007.37"
                cy="452.97"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="157.525"
                cx="1200.34"
                cy="171.06"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="126.065"
                cx="473.75"
                cy="213.93"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="104.66"
                cx="665.1"
                cy="443.23"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="178.395"
                cx="904.66"
                cy="257.06"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="105.035"
                cx="1001.12"
                cy="18.85"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="51.19"
                cx="499.3"
                cy="278.22"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="154.92"
                cx="199.05"
                cy="526.49"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="164.815"
                cx="1439.01"
                cy="507.29"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="62.83"
                cx="1037.27"
                cy="171.75"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="83.47"
                cx="708.26"
                cy="132.78"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="157.135"
                cx="1275.13"
                cy="396.01"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="118.21"
                cx="1173.21"
                cy="220.06"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="111.54"
                cx="526.59"
                cy="181.7"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="52.49"
                cx="756.01"
                cy="270.9"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="105.325"
                cx="1107.16"
                cy="80.83"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="158.665"
                cx="381.8"
                cy="260.73"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="174.85"
                cx="713.86"
                cy="374.72"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="85.75"
                cx="521.09"
                cy="506.78"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="109.075"
                cx="1403.31"
                cy="162.13"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="124.41"
                cx="559.03"
                cy="240.42"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="68.375"
                cx="205.81"
                cy="327.31"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="106.485"
                cx="64.47"
                cy="174.7"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="56.725"
                cx="349.09"
                cy="159.54"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="135.155"
                cx="354.84"
                cy="175.02"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="89.385"
                cx="1330.19"
                cy="214.89"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="131.735"
                cx="607.07"
                cy="290.45"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="185.43"
                cx="1147.15"
                cy="344.93"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="60.815"
                cx="1323.7"
                cy="315.52"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="165.67"
                cx="1011.71"
                cy="307.4"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="88.86"
                cx="701.88"
                cy="447.05"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="171.095"
                cx="784.65"
                cy="115.44"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="61.97"
                cx="1076.94"
                cy="524.02"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="154.215"
                cx="1408.63"
                cy="337.38"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="99.34"
                cx="475.6"
                cy="65.18"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="90.58"
                cx="639.52"
                cy="453.65"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="160.19"
                cx="1299.19"
                cy="178.22"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="144.25"
                cx="797.76"
                cy="19.47"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="175.95"
                cx="1362.23"
                cy="278.97"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="113"
                cx="790.55"
                cy="419.95"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="88.655"
                cx="85.31"
                cy="169.34"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="115.28"
                cx="1422.73"
                cy="501.32"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="88.135"
                cx="88.15"
                cy="6.97"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="174.79"
                cx="1371.75"
                cy="276.04"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="143.04"
                cx="1295.35"
                cy="454.42"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="80.5"
                cx="437.74"
                cy="91"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="115.725"
                cx="1371.1"
                cy="286.06"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="100"
                cx="1257.38"
                cy="180.89"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="98.795"
                cx="1116.43"
                cy="146.72"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="180.815"
                cx="117.96"
                cy="551.69"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="135.67"
                cx="1371.46"
                cy="446.92"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="76.17"
                cx="1334"
                cy="138.44"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="121.78"
                cx="349.18"
                cy="210.7"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="122.51"
                cx="242.27"
                cy="144.61"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="145.845"
                cx="460.16"
                cy="285.41"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="61.625"
                cx="261.59"
                cy="498.75"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="91.815"
                cx="849.25"
                cy="280.25"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="109.69"
                cx="1336.95"
                cy="360.33"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="154.525"
                cx="1359.35"
                cy="381.84"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="125.055"
                cx="163.66"
                cy="82.19"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="65.735"
                cx="592.36"
                cy="278.24"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="175.565"
                cx="138.42"
                cy="106.18"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="179.575"
                cx="329.7"
                cy="41.35"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="95.28"
                cx="501.3"
                cy="71.63"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="100.065"
                cx="215.62"
                cy="488.29"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="68.35"
                cx="1251.73"
                cy="339.42"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="175.54"
                cx="650.47"
                cy="198.93"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="61.035"
                cx="1394.05"
                cy="177.73"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="175.815"
                cx="89.84"
                cy="118.45"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="106.64"
                cx="30.59"
                cy="37.12"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="125.345"
                cx="824.91"
                cy="522.79"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="165.57"
                cx="552.27"
                cy="243.36"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="152.22"
                cx="915"
                cy="81.56"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="162.915"
                cx="746.92"
                cy="548.13"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="110.95"
                cx="1148.09"
                cy="51.68"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="127.51"
                cx="213.81"
                cy="305"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="179.895"
                cx="1077.63"
                cy="411.21"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="151.805"
                cx="1398.06"
                cy="549.39"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="172.09"
                cx="1018.49"
                cy="305.7"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="66.015"
                cx="1108.27"
                cy="191.95"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="73.655"
                cx="1307.62"
                cy="270.41"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="184.985"
                cx="802.7"
                cy="148.02"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="89.445"
                cx="1363.55"
                cy="258.04"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="73.375"
                cx="1341.17"
                cy="214.06"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="143.695"
                cx="545.8"
                cy="120.95"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="103.285"
                cx="65.57"
                cy="350"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="183.125"
                cx="276.08"
                cy="6.14"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="101.09"
                cx="1428.71"
                cy="133.33"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="138.23"
                cx="119.48"
                cy="394.39"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="63.765"
                cx="1038.18"
                cy="281.15"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="102.76"
                cx="1025.08"
                cy="201.28"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="63.395"
                cx="1253.9"
                cy="178.31"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="149.095"
                cx="1397.29"
                cy="272.79"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="95.625"
                cx="448.71"
                cy="159.43"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="181.73"
                cx="1156.6"
                cy="359.19"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="164.03"
                cx="881.34"
                cy="378"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="141"
                cx="73.26"
                cy="373.36"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="136.43"
                cx="173.09"
                cy="25.3"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="128.485"
                cx="269.1"
                cy="108.1"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="122.82"
                cx="237.36"
                cy="485.79"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="71.405"
                cx="474.13"
                cy="354.55"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="68.86"
                cx="805.7"
                cy="290.73"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="107.25"
                cx="991.29"
                cy="166.18"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="179.48"
                cx="601.06"
                cy="491.29"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="85.955"
                cx="528.02"
                cy="277.33"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="122.765"
                cx="1292.38"
                cy="156.58"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="147.635"
                cx="1080.03"
                cy="202.86"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="135.765"
                cx="1008.44"
                cy="409.66"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="167.165"
                cx="951.11"
                cy="184.52"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="166.065"
                cx="742.79"
                cy="475.19"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="163.215"
                cx="892.5"
                cy="467.89"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="111.825"
                cx="1182.68"
                cy="526.59"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="124.36"
                cx="696.64"
                cy="378.28"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="74.94"
                cx="365.34"
                cy="417.24"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="119.95"
                cx="181.31"
                cy="444.52"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="155.28"
                cx="1427.37"
                cy="148.75"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="181.735"
                cx="303.12"
                cy="100.76"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="156.94"
                cx="748.49"
                cy="399.85"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="97.315"
                cx="771.89"
                cy="371.19"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="64.905"
                cx="440.99"
                cy="155.88"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="162.185"
                cx="150.02"
                cy="85.18"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="179.43"
                cx="75.02"
                cy="202.66"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="89.61"
                cx="1184.3"
                cy="437.36"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="121.21"
                cx="971.76"
                cy="557.57"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="102.395"
                cx="1111.9"
                cy="425.37"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="176.95"
                cx="1312.04"
                cy="521.56"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="83.845"
                cx="689.26"
                cy="48.57"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="178.205"
                cx="1357.47"
                cy="172.25"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="75.405"
                cx="937.55"
                cy="400.92"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="102.045"
                cx="188.26"
                cy="226.37"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="179.47"
                cx="472.93"
                cy="46.17"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
              <circle
                r="99.635"
                cx="853.68"
                cy="310.63"
                stroke="#ffffff"
                stroke-opacity="1"
                stroke-width="2"></circle>
            </g>
            <defs>
              <clipPath id="SvgjsClipPath1088">
                <rect
                  width="1440"
                  height="560"
                  x="0"
                  y="0"></rect>
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    </>
  );
};

const DownCard: React.FC = () => {
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
