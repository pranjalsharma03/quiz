import React from "react";
// reactstrap components
import Lottie from "react-lottie";
import animationData from "../Puzzle.json";
import { Row, Col } from "reactstrap";

const errorOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

class Error extends React.Component {
  constructor() {
    super();
    this.state = {
      score: "",
      isEmpty: true,
      isLoading: true,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  notify = (place, message, type, icon) => {
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>{message}</div>
        </div>
      ),
      type: type,
      icon: "tim-icons " + icon,
      autoDismiss: 7,
    };
    this.refs.notificationAlert.notificationAlert(options);
    window.$notifications.push([message, "", icon]);
  };
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
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
          <Row className="w-100 text-center mt-5">
            <Col lg="9" md="9" xs="12" className="m-auto">
              <Lottie
                className="w-100"
                isClickToPauseDisabled={true}
                style={{ top: 0 }}
                width={300}
                height={300}
                options={errorOptions}
              />
              <h1>Something is missing</h1>
            </Col>
          </Row>
      </>
    );
  }
}
export default Error;
