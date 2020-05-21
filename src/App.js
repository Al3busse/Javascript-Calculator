import React from "react";
import "./App.css";
import { evaluate } from "mathjs";
import "bootstrap/dist/css/bootstrap.min.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

const numbersTest = /\d|\./;
const zeroTest = /^0+/;
const operatorTest = /\W/;
const equalSignTest = /=/;

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
    if (!equalSignTest.test(this.state.formulaScreen)) {
      var result = this.state.formulaScreen.toString().replace(/,\W$|,/g, "");
      var answer = evaluate(result);
      this.setState({
        formulaScreen: result + "=" + answer,
        currentValue: answer,
        prevCalc: answer,
        lastValue: [],
        decimalAllow: true,
      });
    } else {
      this.setState({
        formulaScreen: this.state.prevCalc,
        currentValue: this.state.prevCalc,
      });
    }
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
        <Container>
          <Row>
            <Col
              style={{ marginTop: "20px", backgroundColor: "black" }}
              xs={true}
              sm={{ span: 6, offset: 3 }}
              md={{ span: 4, offset: 4 }}
              lg={{ span: 4, offset: 4 }}
              xl={{ span: 4, offset: 4 }}
            >
              <Row>
                <Col style={{ padding: 0, border: "1px black solid" }} xs={12}>
                  <p id='formulaDisplay'>{this.state.formulaScreen}</p>
                </Col>
              </Row>
              <Row>
                <Col style={{ padding: 0, border: "1px black solid" }} xs={12}>
                  <p id='display'>{this.state.currentValue}</p>
                </Col>
              </Row>
              <Row>
                <Col style={{ padding: 0, border: "1px black solid" }} xs={6}>
                  <Button
                    id='clear'
                    onClick={this.clearDisplay}
                    value='AC'
                    className='buttons'
                    variant='danger'
                  >
                    AC
                  </Button>
                </Col>
                <Col style={{ padding: 0, border: "1px black solid" }} xs={3}>
                  <Button
                    id='divide'
                    onClick={this.calculate}
                    value='/'
                    className='buttons'
                    variant='secondary'
                  >
                    /
                  </Button>
                </Col>
                <Col style={{ padding: 0, border: "1px black solid" }} xs={3}>
                  <Button
                    id='multiply'
                    onClick={this.calculate}
                    value='*'
                    className='buttons'
                    variant='secondary'
                  >
                    x
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col style={{ padding: 0, border: "1px black solid" }} xs={3}>
                  <Button
                    id='seven'
                    onClick={this.calculate}
                    value='7'
                    className='buttons'
                  >
                    7
                  </Button>
                </Col>
                <Col style={{ padding: 0, border: "1px black solid" }} xs={3}>
                  <Button
                    id='eight'
                    onClick={this.calculate}
                    value='8'
                    className='buttons'
                  >
                    8
                  </Button>
                </Col>
                <Col style={{ padding: 0, border: "1px black solid" }} xs={3}>
                  <Button
                    id='nine'
                    onClick={this.calculate}
                    value='9'
                    className='buttons'
                  >
                    9
                  </Button>
                </Col>
                <Col style={{ padding: 0, border: "1px black solid" }} xs={3}>
                  <Button
                    id='subtract'
                    onClick={this.calculate}
                    value='-'
                    className='buttons'
                    variant='secondary'
                  >
                    -
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col style={{ padding: 0, border: "1px black solid" }} xs='3'>
                  <Button
                    id='six'
                    onClick={this.calculate}
                    value='6'
                    className='buttons'
                  >
                    6
                  </Button>
                </Col>
                <Col style={{ padding: 0, border: "1px black solid" }} xs='3'>
                  <Button
                    id='five'
                    onClick={this.calculate}
                    value='5'
                    className='buttons'
                  >
                    5
                  </Button>
                </Col>
                <Col style={{ padding: 0, border: "1px black solid" }} xs='3'>
                  <Button
                    id='four'
                    onClick={this.calculate}
                    value='4'
                    className='buttons'
                  >
                    4
                  </Button>
                </Col>
                <Col style={{ padding: 0, border: "1px black solid" }} xs='3'>
                  <Button
                    id='add'
                    onClick={this.calculate}
                    value='+'
                    className='buttons'
                    variant='secondary'
                  >
                    +
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col xs='9'>
                  <Row>
                    <Col
                      style={{ padding: 0, border: "1px black solid" }}
                      xs='4'
                    >
                      <Button
                        id='three'
                        onClick={this.calculate}
                        value='3'
                        className='buttons'
                      >
                        3
                      </Button>
                    </Col>
                    <Col
                      style={{ padding: 0, border: "1px black solid" }}
                      xs='4'
                    >
                      <Button
                        id='two'
                        onClick={this.calculate}
                        value='2'
                        className='buttons'
                      >
                        2
                      </Button>
                    </Col>
                    <Col
                      style={{ padding: 0, border: "1px black solid" }}
                      xs='4'
                    >
                      <Button
                        id='one'
                        onClick={this.calculate}
                        value='1'
                        className='buttons'
                      >
                        1
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      style={{ padding: 0, border: "1px black solid" }}
                      xs='8'
                    >
                      <Button
                        id='zero'
                        onClick={this.calculate}
                        value='0'
                        className='buttons'
                      >
                        0
                      </Button>
                    </Col>
                    <Col
                      style={{ padding: 0, border: "1px black solid" }}
                      xs='4'
                    >
                      <Button
                        id='decimal'
                        onClick={this.calculate}
                        value='.'
                        className='buttons'
                      >
                        .
                      </Button>
                    </Col>
                  </Row>
                </Col>
                <Col style={{ padding: 0, border: "1px black solid" }} xs='3'>
                  <Button
                    id='equals'
                    onClick={this.resolve}
                    value='='
                    className='buttons'
                    variant='success'
                  >
                    =
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
