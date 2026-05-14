"use client";

import { useEffect, useRef, useState } from "react";

const symbols = ["x", "+"];
const roundOptions = [10, 20, 30, 40, 50];
const pauseOptions = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];

function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

export default function HomePage() {
  const [screen, setScreen] = useState("start");
  const [target, setTarget] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [averageReactionMs, setAverageReactionMs] = useState(0);
  const [selectedRounds, setSelectedRounds] = useState(10);
  const [pauseMs, setPauseMs] = useState(1000);
  const shownAtRef = useRef(Date.now());
  const totalReactionMsRef = useRef(0);

  useEffect(() => {
    if (!isWaiting || screen !== "playing") {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setTarget(getRandomSymbol());
      shownAtRef.current = Date.now();
      setIsWaiting(false);
    }, pauseMs);

    return () => window.clearTimeout(timeoutId);
  }, [isWaiting, pauseMs, screen]);

  function startGame() {
    totalReactionMsRef.current = 0;
    setScreen("playing");
    setCorrect(0);
    setTotal(0);
    setAverageReactionMs(0);
    setIsWaiting(false);
    setTarget(getRandomSymbol());
    shownAtRef.current = Date.now();
  }

  function nextRound(choice) {
    if (screen !== "playing" || isWaiting || !target) {
      return;
    }

    const isCorrect = choice === target;
    const reactionMs = Date.now() - shownAtRef.current;
    const nextTotal = total + 1;

    totalReactionMsRef.current += reactionMs;
    setTotal(nextTotal);
    setAverageReactionMs(Math.round(totalReactionMsRef.current / nextTotal));
    if (isCorrect) {
      setCorrect((currentCorrect) => currentCorrect + 1);
    }

    if (nextTotal >= selectedRounds) {
      setTarget("");
      setIsWaiting(false);
      setScreen("finished");
      return;
    }

    setTarget("");
    setIsWaiting(true);
  }

  if (screen === "start") {
    return (
      <main className="game-screen">
        <div className="game-card game-setup">
          <h1 className="game-title">Juego de Reaccion</h1>
          <label className="game-field" htmlFor="round-count">
            <span className="game-field-label">Rondas</span>
            <select
              id="round-count"
              className="game-select"
              value={selectedRounds}
              onChange={(event) => setSelectedRounds(Number(event.target.value))}
            >
              {roundOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="game-field" htmlFor="pause-duration">
            <span className="game-field-label">Pausa entre rondas</span>
            <select
              id="pause-duration"
              className="game-select"
              value={pauseMs}
              onChange={(event) => setPauseMs(Number(event.target.value))}
            >
              {pauseOptions.map((option) => (
                <option key={option} value={option}>
                  {option} ms
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="game-start-button" onClick={startGame}>
            Empezar
          </button>
        </div>
      </main>
    );
  }

  if (screen === "finished") {
    return (
      <main className="game-screen">
        <div className="game-card game-setup">
          <h1 className="game-title">Terminado</h1>
          <p className="game-message">
            Total: <span className="game-result-value">{correct} / {selectedRounds}</span>
          </p>
          <p className="game-message">
            Tiempo promedio: <span className="game-result-value">{averageReactionMs} ms</span>
          </p>
          <label className="game-field" htmlFor="finished-round-count">
            <span className="game-field-label">Rondas</span>
            <select
              id="finished-round-count"
              className="game-select"
              value={selectedRounds}
              onChange={(event) => setSelectedRounds(Number(event.target.value))}
            >
              {roundOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="game-field" htmlFor="finished-pause-duration">
            <span className="game-field-label">Pausa entre rondas</span>
            <select
              id="finished-pause-duration"
              className="game-select"
              value={pauseMs}
              onChange={(event) => setPauseMs(Number(event.target.value))}
            >
              {pauseOptions.map((option) => (
                <option key={option} value={option}>
                  {option} ms
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="game-start-button" onClick={startGame}>
            Jugar de Nuevo
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="game-screen">
      <div className="game-card">
        <p className="game-message">Ronda: {total + 1} / {selectedRounds}</p>
        <p className="game-message">Tiempo promedio: {averageReactionMs} ms</p>
        <div className="game-symbol" aria-label="Simbolo actual">
          {target}
        </div>
        <div className="game-buttons">
          <button type="button" onClick={() => nextRound("+")} disabled={isWaiting}>
            +
          </button>
          <button type="button" onClick={() => nextRound("x")} disabled={isWaiting}>
            x
          </button>
        </div>
      </div>
    </main>
  );
}
