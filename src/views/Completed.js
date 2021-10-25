import React from "react";
// reactstrap components
import Lottie from "react-lottie";
import animationData from "../confetti.json";
import trophyData from "../trophy.json";
import disqualifyData from "../Coffee.json";
import snowData from "../snow.json";
import ReactLoading from "react-loading";
import { Row, Col } from "reactstrap";

let tmp = {};
let id;
let user;

const completedOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const trophyOptions = {
  loop: true,
  autoplay: true,
  animationData: trophyData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const disqualifyOptions = {
  loop: true,
  autoplay: true,
  animationData: disqualifyData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const snowOptions = {
  loop: true,
  autoplay: true,
  animationData: snowData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
class Completed extends React.Component {
  constructor() {
    super();
    this.state = {
      status: "",
      score: "",
      isEmpty: true,
      isLoading: true,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  async componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    id = this.props.match.params.id;
    user = this.props.match.params.user;
    await fetch(
      "https://quizyaar-default-rtdb.firebaseio.com/Quiz/" +
        id +
        "/Users/" +
        user +
        ".json"
    )
      .then((res) => res.json())
      .then((data) => (tmp = data));
    // console.log(tmp);
    this.setState({
      status: tmp.Status,
      score: tmp.Score,
      isEmpty: false,
      isLoading: false,
    });
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  render() {
    return (
      <>
        <div className={this.state.isLoading ? "d-auto" : "d-none"}>
          <ReactLoading
            className="mx-auto mt-5"
            type="spin"
            color="#e14eca"
            height={100}
            width={50}
          />
        </div>
        <div
          className={
            this.state.isLoading
              ? "d-none"
              : "position-relative overflow-hidden d-auto"
          }
        >
          <Row className="w-100 h-100 text-center position-absolute mx-auto">
            <Col lg="9" md="9" xs="12" className="m-auto">
              <Lottie
                className="w-100"
                isClickToPauseDisabled={true}
                style={{ top: 0 }}
                width={200}
                height={200}
                options={
                  this.state.status.trim() === "Completed"
                    ? trophyOptions
                    : disqualifyOptions
                }
              />
              <h1
                className={
                  this.state.status.trim() === "Completed" ? "d-auto" : "d-none"
                }
              >
                Congratulations!! you have completed the quiz.
              </h1>
              <h1
                className={
                  this.state.status.trim() === "Disqualified"
                    ? "d-auto"
                    : "d-none"
                }
              >
                You made a mistake! you have been disqualified from the quiz.
              </h1>
              <h2>Score: {this.state.score}</h2>
            </Col>
          </Row>
          <Lottie
            isClickToPauseDisabled={true}
            style={{ top: 0 }}
            width={this.state.width}
            height={this.state.height}
            options={
              this.state.status.trim() === "Completed"
                ? completedOptions
                : snowOptions
            }
          />
        </div>
      </>
    );
  }
}
export default Completed;
