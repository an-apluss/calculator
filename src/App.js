import { useReducer } from 'react';
import './styles.css';
import DigitButton from './Components/DigitButton';
import OperationButton from './Components/OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }

      if (payload.digit === '0' && state.currentOperand === '0') {
        return state;
      }

      if (payload.digit === '.' && state.currentOperand.includes(".")) {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (!state.previousOperand && !state.currentOperand) {
        return state;
      }

      if (!state.currentOperand) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (!state.previousOperand) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: payload.operation,
          currentOperand: null,
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }
    
    case ACTIONS.CLEAR: 
      return {};
    
    case ACTIONS.EVALUATE:
      if (!state.currentOperand || !state.previousOperand || !state.operation) {
        return state;
      }

      return {
        ...state,
        currentOperand: evaluate(state),
        operation: null,
        previousOperand: null,
        overwrite: true,
      }

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }

      if (!state.currentOperand) {
        return state;
      }

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }
    default:
      break;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const previous = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(previous) || isNaN(current)) {
    return '';
  }

  let computation = '';
  switch (operation) {
    case '-':
      computation = previous - current;
      break;
    case '*':
      computation = previous * current;
      break;
    case '÷':
      computation = previous / current;
      break;
    case '+':
      computation = previous + current;
      break;
    default:
      break;
  }
  
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
    maximumFractionDigits: 0,
  });

function formatOperand(operand) {
  if (!operand) {
    return;
  }

  const [integer, decimal] = operand.split('.');

  if (!decimal) return INTEGER_FORMATTER.format(integer);

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-2" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton dispatch={dispatch} operation='÷' />
      <DigitButton dispatch={dispatch} digit='1' />
      <DigitButton dispatch={dispatch} digit='2' />
      <DigitButton dispatch={dispatch} digit='3' />
      <OperationButton dispatch={dispatch} operation='*' />
      <DigitButton dispatch={dispatch} digit='4' />
      <DigitButton dispatch={dispatch} digit='5' />
      <DigitButton dispatch={dispatch} digit='6' />
      <OperationButton dispatch={dispatch} operation='+' />
      <DigitButton dispatch={dispatch} digit='7' />
      <DigitButton dispatch={dispatch} digit='8' />
      <DigitButton dispatch={dispatch} digit='9' />
      <OperationButton dispatch={dispatch} operation='-' />
      <DigitButton dispatch={dispatch} digit='.' />
      <DigitButton dispatch={dispatch} digit='0' />
      <button className="span-2" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
