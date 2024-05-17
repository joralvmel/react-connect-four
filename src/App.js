import { useState, useEffect } from "react";
import soundP1 from "./sounds/soundP1.mp3";
import soundP2 from "./sounds/soundP2.mp3";

const PLAYER_1 = "p1";
const PLAYER_2 = "p2";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [tiles, setTiles] = useState(Array(42).fill(null));
  const [playerTurn, setPlayerTurn] = useState(PLAYER_1);
  const [winner, setWinner] = useState(null);
  const [winCount, setWinCount] = useState([0, 0]);

  function playAudio() {
    if (playerTurn === PLAYER_1) new Audio(soundP1).play();
    if (playerTurn === PLAYER_2) new Audio(soundP2).play();
  }

  function resetGame() {
    setTiles(Array(42).fill(null));
    setPlayerTurn(PLAYER_1);
    setWinner(null);
  }

  function checkForWinner(tiles) {
    // check horizontal
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        const i = row * 7 + col;
        if (
          tiles[i] &&
          tiles[i] === tiles[i + 1] &&
          tiles[i] === tiles[i + 2] &&
          tiles[i] === tiles[i + 3]
        ) {
          return tiles[i];
        }
      }
    }

    // check vertical
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 7; col++) {
        const i = row * 7 + col;
        if (
          tiles[i] &&
          tiles[i] === tiles[i + 7] &&
          tiles[i] === tiles[i + 14] &&
          tiles[i] === tiles[i + 21]
        ) {
          return tiles[i];
        }
      }
    }

    // Check diagonal (top-left to bottom-right)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const i = row * 7 + col;
        if (
          tiles[i] &&
          tiles[i] === tiles[i + 8] &&
          tiles[i] === tiles[i + 16] &&
          tiles[i] === tiles[i + 24]
        ) {
          return tiles[i];
        }
      }
    }

    // Check diagonal (bottom-left to top-right)
    for (let row = 0; row < 3; row++) {
      for (let col = 3; col < 7; col++) {
        const i = row * 7 + col;
        if (
          tiles[i] &&
          tiles[i] === tiles[i + 6] &&
          tiles[i] === tiles[i + 12] &&
          tiles[i] === tiles[i + 18]
        ) {
          return tiles[i];
        }
      }
    }

    if (!tiles.includes(null)) {
      return "Draw";
    }

    return null;
  }

  useEffect(() => {
    const winner = checkForWinner(tiles);
    if (winner) {
      setWinner(winner);
      setWinCount((winCount) => {
        if (winner === PLAYER_1) {
          return [winCount[0] + 1, winCount[1]];
        } else if (winner === PLAYER_2) {
          return [winCount[0], winCount[1] + 1];
        } else {
          return winCount;
        }
      });
      setPlayerTurn(null);
    }
  }, [tiles]);

  function handleTileClick(i) {
    if (tiles[i] !== null) return;
    if (winner !== null) return;

    const newTiles = [...tiles];
    for (let j = i; j < tiles.length; j += 7) {
      if (tiles[j + 7] !== null || j >= 35) {
        newTiles[j] = playerTurn;
        break;
      }
    }
    setTiles(newTiles);
    playAudio();
    setPlayerTurn(playerTurn === PLAYER_1 ? PLAYER_2 : PLAYER_1);
  }

  return (
    <div className="App">
      <h1>Connect Four</h1>
      {gameStarted ? (
        <Board
          tiles={tiles}
          playerTurn={playerTurn}
          onTileClick={handleTileClick}
        />
      ) : (
        <>
          <Button onClick={() => setGameStarted((gameStarted) => !gameStarted)}>
            Start Game
          </Button>
        </>
      )}
      {winner && (
        <div>
          <GameOver winner={winner} winCount={winCount} />
          <Button onClick={resetGame}>Play Again</Button>
        </div>
      )}
    </div>
  );
}

function Board({ tiles, playerTurn, onTileClick }) {
  return (
    <div className="board">
      {tiles.map((tile, i) => (
        <Tile
          key={i}
          value={tile}
          playerTurn={playerTurn}
          onClick={() => onTileClick(i)}
        >
          {tile}
        </Tile>
      ))}
    </div>
  );
}

function Tile({ value, playerTurn, onClick }) {
  const tileClass = `tile ${value === null ? `${playerTurn}-hover` : ""} ${
    value === PLAYER_1 ? "p1-tyle" : value === PLAYER_2 ? "p2-tyle" : ""
  }`;
  return <div value={value} onClick={onClick} className={tileClass}></div>;
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function GameOver({ winner, winCount }) {
  return (
    <div className="game-over">
      <h3>{winner === "Draw" ? "It's a Draw!" : `${winner} Wins`}</h3>
      <div>{`Score:  p1: ${winCount[0]} | p2:${winCount[1]}`}</div>
    </div>
  );
}
