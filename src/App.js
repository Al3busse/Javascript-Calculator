import React from "react";
import "./App.css";
import { evaluate } from "mathjs";

const numbersTest = /\d|\./;
const zeroTest = /^0+/;
const operatorTest = /\W/;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
      prevValue: [],
      formulaScreen: [],
      currentValue: [0],
      prevCalc: 0,
      lastValue: [],
      decimalAllow: true,
      lastOperator: "",
    };
    this.resolve = this.resolve.bind(this);
    this.calculate = this.calculate.bind(this);
    this.clearDisplay = this.clearDisplay.bind(this);
    this.handlePrevResult = this.handlePrevResult.bind(this);
    this.handleCurrentValue = this.handleCurrentValue.bind(this);
  }

  handlePrevResult(valueN) {
    if (numbersTest.test(valueN)) {
      this.setState({
        currentValue: valueN,
        formulaScreen: [valueN],
        prevCalc: 0,
        lastValue: [valueN],
      });
    } else {
      this.setState({
        currentValue: valueN,
        formulaScreen: [this.state.prevCalc, valueN],
        prevCalc: 0,
        lastValue: [],
      });
    }
  }

  handleCurrentValue() {
    let cValue = this.state.lastValue.join("").replace(/^0+(?!\.|$)/, "");
    this.setState({
      currentValue: cValue,
    });
  }

  calculate(e) {
    let valueN = e.target.value;
    if (this.state.prevCalc !== 0) {
      this.handlePrevResult(valueN);
    } else {
      if (numbersTest.test(valueN)) {
        if (valueN === ".") {
          if (this.state.decimalAllow === true) {
            this.setState({ decimalAllow: false, lastOperator: "" });
            this.state.lastValue.push(valueN);
            this.state.formulaScreen.push(valueN);
            this.handleCurrentValue();
          }
        } else {
          this.state.lastValue.push(valueN);
          this.handleCurrentValue();
          this.setState({ lastOperator: "" });

          if (!zeroTest.test(this.state.lastValue)) {
            this.state.formulaScreen.push(valueN);
          } else {
            this.setState({ lastValue: [], lastOperator: "" });
          }
        }
      } else if (!operatorTest.test(valueN)) {
        this.setState({
          currentValue: valueN,
          lastValue: [],
          decimalAllow: true,
          lastOperator: "",
        });
        this.state.formulaScreen.push(valueN);
      } else {
        this.setState({
          currentValue: valueN,
          lastValue: [],
          decimalAllow: true,
        });
        if (!operatorTest.test(this.state.lastOperator)) {
          this.setState({ lastOperator: valueN });
          this.state.formulaScreen.push(valueN);
        } else if (valueN === "-") {
          if (
            this.state.formulaScreen[this.state.formulaScreen.length - 1] ===
            "-"
          ) {
            this.setState({ lastOperator: valueN });
            this.state.formulaScreen.splice(-1, 1, valueN);
          } else {
            this.setState({ lastOperator: valueN });
            this.state.formulaScreen.push(valueN);
          }
        } else if (
          this.state.formulaScreen[this.state.formulaScreen.length - 1] ===
            "-" &&
          operatorTest.test(
            this.state.formulaScreen[this.state.formulaScreen.length - 2]
          )
        ) {
          this.setState({ lastOperator: valueN });
          this.state.formulaScreen.splice(-2, 2, valueN);
        } else {
          this.setState({ lastOperator: valueN });
          this.state.formulaScreen.splice(-1, 1, valueN);
        }
      }
    }
  }

  resolve() {
    let result = this.state.formulaScreen.toString().replace(/,/g, "");
    let answer = evaluate(result);
    this.setState({
      formulaScreen: result + "=" + answer,
      currentValue: answer,
      prevCalc: answer,
      lastValue: [],
      decimalAllow: true,
    });
  }

  clearDisplay() {
    this.setState({
      value: "",
      prevValue: [],
      formulaScreen: [],
      currentValue: [0],
      prevCalc: 0,
      lastValue: [],
      decimalAllow: true,
      lastOperator: "",
    });
  }

  render() {
    return (
      <div id='calculator'>
        <div>
          <div>{this.state.formulaScreen}</div>
          <div id='display'>{this.state.currentValue}</div>
        </div>
        <div>
          <button id='clear' onClick={this.clearDisplay} value='AC'>
            AC
          </button>
          <button id='one' onClick={this.calculate} value='1'>
            1
          </button>
          <button id='two' onClick={this.calculate} value='2'>
            2
          </button>
          <button id='three' onClick={this.calculate} value='3'>
            3
          </button>
          <button id='four' onClick={this.calculate} value='4'>
            4
          </button>
          <button id='five' onClick={this.calculate} value='5'>
            5
          </button>
          <button id='six' onClick={this.calculate} value='6'>
            6
          </button>
          <button id='seven' onClick={this.calculate} value='7'>
            7
          </button>
          <button id='eight' onClick={this.calculate} value='8'>
            8
          </button>
          <button id='nine' onClick={this.calculate} value='9'>
            9
          </button>
          <button id='zero' onClick={this.calculate} value='0'>
            0
          </button>
          <button id='decimal' onClick={this.calculate} value='.'>
            .
          </button>
          <button id='add' onClick={this.calculate} value='+'>
            +
          </button>
          <button id='subtract' onClick={this.calculate} value='-'>
            -
          </button>
          <button id='divide' onClick={this.calculate} value='/'>
            /
          </button>
          <button id='multiply' onClick={this.calculate} value='*'>
            x
          </button>
          <button id='equals' onClick={this.resolve} value='='>
            =
          </button>
        </div>
      </div>
    );
  }
}

export default App;
