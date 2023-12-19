import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { DateTime } from "luxon";
import { useSpring, animated } from "react-spring";
import "./CountdownTimer.css"; // Arquivo CSS externo para estilos

const CountdownTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [celebrationProps, setCelebrationProps] = useSpring(() => ({
    opacity: 0,
    scale: 1,
  }));

  useEffect(() => {
    const targetTime = DateTime.local()
      .setZone("America/Sao_Paulo")
      .set({ hour: 19, minute: 0, second: 0 });

    const updateTimer = () => {
      const now = DateTime.local().setZone("America/Sao_Paulo");
      const diff = targetTime
        .diff(now, ["hours", "minutes", "seconds"])
        .toObject();

      setTimeRemaining({
        hours: Math.max(0, Math.floor(diff.hours)),
        minutes: Math.max(0, Math.floor(diff.minutes)),
        seconds: Math.max(0, Math.floor(diff.seconds)),
      });
    };

    const timerInterval = setInterval(updateTimer, 1000);

    // Limpar intervalo quando o componente for desmontado
    return () => clearInterval(timerInterval);
  }, []); // O segundo parâmetro vazio assegura que o useEffect só seja executado uma vez no montar do componente

  useEffect(() => {
    if (
      timeRemaining.hours <= 0 &&
      timeRemaining.minutes <= 0 &&
      timeRemaining.seconds <= 0 &&
      celebrationProps.opacity !== 1
    ) {
      // Se já passou das 19 horas e a animação de celebração não foi ativada, ativa-a
      setCelebrationProps({ opacity: 1, scale: 1.2 });
    }
  }, [timeRemaining, celebrationProps, setCelebrationProps]);

  return (
    <div className="countdown-container">
      {timeRemaining.hours <= 0 &&
      timeRemaining.minutes <= 0 &&
      timeRemaining.seconds <= 0 ? (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={2000}
            recycle={false}
          />
          <animated.div
            className="celebration"
            style={{
              opacity: celebrationProps.opacity,
              transform: celebrationProps.scale.interpolate(
                (s) => `scale(${s})`
              ),
            }}
          >
            🎉 Parabéns! 🎉
          </animated.div>
        </>
      ) : (
        <>
          <h1>Grande dia</h1>
          <p className="countdown-text">{`${timeRemaining.hours} horas, ${timeRemaining.minutes} minutos, ${timeRemaining.seconds} segundos`}</p>
        </>
      )}
    </div>
  );
};

export default CountdownTimer;
