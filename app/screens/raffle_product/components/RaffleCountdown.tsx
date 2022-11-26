import React, { useState, useEffect, useRef } from 'react';
import { Box, Text } from 'app/components/base';

const RaffleCountdown = ({
  setIsRaffleEnded,
  raffleStatus,
  productEndDate,
  timerTextColor,
}: {
  setIsRaffleEnded: React.Dispatch<React.SetStateAction<boolean>>;
  raffleStatus: 'upcoming' | 'running' | 'ended';
  productEndDate: string;
  timerTextColor: 'textBlack' | 'gray3';
}) => {
  const [timerDays, setTimerDays] = useState('00');
  const [timerHours, setTimerHours] = useState('00');
  const [timerMinutes, setTimerMinutes] = useState('00');
  const [timerSeconds, setTimerSeconds] = useState('00');

  const interval = useRef<NodeJS.Timer | null>();

  const startTimer = () => {
    const countDownDate = new Date(productEndDate).getTime();

    interval.current = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      const days = Math.floor(distance / (24 * 60 * 60 * 1000)).toLocaleString(undefined, {
        minimumIntegerDigits: 2,
      });

      const hours = Math.floor(
        (distance % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60)
      ).toLocaleString(undefined, { minimumIntegerDigits: 2 });

      const minutes = Math.floor((distance % (60 * 60 * 1000)) / (1000 * 60)).toLocaleString(
        undefined,
        { minimumIntegerDigits: 2 }
      );

      const seconds = Math.floor((distance % (60 * 1000)) / 1000).toLocaleString(undefined, {
        minimumIntegerDigits: 2,
      });

      if (distance < 0) {
        clearInterval(interval.current as NodeJS.Timeout);
        setIsRaffleEnded(true);
      } else {
        setTimerDays(days);
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }
    }, 1000);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (raffleStatus === 'running') {
      startTimer();
    } else {
      setTimerDays('00');
      setTimerHours('00');
      setTimerMinutes('00');
      setTimerSeconds('00');
    }
  });

  return (
    <Box flexDirection="row" justifyContent="center">
      <Box flexDirection="column" center px={4}>
        <Text fontSize={7} fontFamily="medium" color={timerTextColor}>
          {timerDays}
        </Text>
        <Text fontSize={1} mt={2} color={timerTextColor}>
          DAYS
        </Text>
      </Box>
      <Text fontSize={6} mt={1} fontFamily="medium" color={timerTextColor}>
        :
      </Text>
      <Box flexDirection="column" center px={4}>
        <Text fontSize={7} fontFamily="medium" color={timerTextColor}>
          {timerHours}
        </Text>
        <Text fontSize={1} mt={2} color={timerTextColor}>
          HOURS
        </Text>
      </Box>
      <Text fontSize={6} mt={1} fontFamily="medium" color={timerTextColor}>
        :
      </Text>
      <Box flexDirection="column" center px={4}>
        <Text fontSize={7} fontFamily="medium" color={timerTextColor}>
          {timerMinutes}
        </Text>
        <Text fontSize={1} mt={2} color={timerTextColor}>
          MINUTES
        </Text>
      </Box>
      <Text fontSize={6} mt={1} fontFamily="medium" color={timerTextColor}>
        :
      </Text>
      <Box flexDirection="column" center px={4}>
        <Text fontSize={7} fontFamily="medium" color={timerTextColor}>
          {timerSeconds}
        </Text>
        <Text fontSize={1} mt={2} color={timerTextColor}>
          SECONDS
        </Text>
      </Box>
    </Box>
  );
};

export default RaffleCountdown;
