import React from "react";
import "./App.css";
import { evaluate } from "mathjs";

const numbersTest = /\d|\./;
const zeroTest = /^0+/;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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

  handlePrevResult(e) {
    if (numbersTest.test(e.target.value)) {
      this.setState({
        currentValue: e.target.value,
        formulaScreen: [e.target.value],
        prevCalc: 0,
        lastValue: [e.target.value],
      });
    } else {
      this.setState({
        currentValue: e.target.value,
        formulaScreen: [this.state.prevCalc, e.target.value],
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
    if (this.state.prevCalc !== 0) {
      this.handlePrevResult(e);
    } else {
      if (numbersTest.test(e.target.value)) {
        if (e.target.value === ".") {
          if (this.state.decimalAllow === true) {
            this.setState({ decimalAllow: false, lastOperator: "" });
            this.state.lastValue.push(e.target.value);
            this.state.formulaScreen.push(e.target.value);
            this.handleCurrentValue();
          }
        } else {
          this.state.lastValue.push(e.target.value);
          this.handleCurrentValue();

          if (!zeroTest.test(this.state.lastValue)) {
            this.state.formulaScreen.push(e.target.value);
            console.log(this.state.lastValue);
          } else {
            this.setState({ lastValue: [], lastOperator: "" });
          }
          console.log(this.state.decimalAllow);
        }
      } else {
        this.setState({
          currentValue: e.target.value,
          lastValue: [],
          decimalAllow: true,
        });

        this.state.formulaScreen.push(e.target.value);
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
    console.log(this.state.lastValue);
    console.log(this.state.formulaScreen);
  }

  clearDisplay() {
    this.setState({
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
