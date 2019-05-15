import React,{useReducer} from 'react';
import './Game.css';

function getStatus(squares, xIsNext) {
  const winner = calculateWinner(squares)
  if (winner) {
    return `Winner: ${winner}`
  } else if (squares.every(Boolean)) {
    return `Scratch: Cat's game`
  } else {
    return `Next player: ${xIsNext ? 'X' : '0'}`
  }
}

function gameReducer(state, action) {
  let {history, stepNumber, xIsNext} = state;
  switch (action.type) {
    case 'SELECT_SQUARE': {

      const {square} = action;
       history = history.slice(0, stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const winner = calculateWinner(squares);
      if (winner || squares[square]) {
        return state;
      }
      const squaresCopy = [...squares];
      squaresCopy[square] = xIsNext ? 'X' : '0';
      
      return {
        history: history.concat(
          {
            squares: squaresCopy
          }
        ),
        stepNumber: history.length,
        xIsNext: !xIsNext,
      }
    }
    case 'JUMP_TO':{
      const {step} = action;
      return {
        history: history,
        stepNumber: step,
        xIsNext: (step % 2) === 0
      }
    }
    default: {
      throw new Error(
        `Unhandled action type: ${action.type}. Please fix it. Thank you.`,
      )
    }
  }
}

function Board() {
  const [state, dispatch] = useReducer(gameReducer, {
    history:[{
      squares: Array(9).fill(null)
    }],
    stepNumber: 0,
    xIsNext: true,
  });
  const {history, stepNumber, xIsNext} = state;
  console.log(stepNumber);
  function renderSquare(index) {
    return (
      <button className="square" onClick={() => selectSquare(index)}>
        {history[stepNumber].squares[index]}
      </button>
    );
  }
  function selectSquare(square) {
    dispatch({type: 'SELECT_SQUARE', square})
  }
  const status = getStatus(history[stepNumber].squares, xIsNext);

  
  function jumpTo(step) {
    dispatch({type: 'JUMP_TO', step});
  }
  const moves = history.map((step, move) => {
    const desc = move ?
      'Go to move #' + move :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });
  return (
    <div className="game">
        <div className="game-board">
        <div className="status">{status}</div>
          <div className="board-row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className="board-row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className="board-row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
        </div>
        <div className="game-info">
            <ol>{moves}</ol>
          </div>
      </div>
    );
  
}

function Game() {
   return (    
          <Board />
    );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


export default Game;
