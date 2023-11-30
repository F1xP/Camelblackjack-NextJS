import { BsFillSuitClubFill, BsFillSuitHeartFill, BsFillSuitDiamondFill, BsFillSuitSpadeFill } from 'react-icons/bs';

export const suitIcons = (size: number) => ({
  Clubs: {
    icon: <BsFillSuitClubFill size={size} />,
    suitColor: '#000000',
  },
  Spades: {
    icon: <BsFillSuitSpadeFill size={size} />,
    suitColor: '#000000',
  },
  Diamonds: {
    icon: <BsFillSuitDiamondFill size={size} />,
    suitColor: '#FF0000',
  },
  Hearts: {
    icon: <BsFillSuitHeartFill size={size} />,
    suitColor: '#FF0000',
  },
});
