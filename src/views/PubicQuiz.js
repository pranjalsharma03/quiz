import React from "react";
import ReactLoading from "react-loading";
import Lottie from "react-lottie";
import animationData from "../developer.json";
import { Link } from "react-router-dom";
import Footer from "components/Footer/Footer.js";
import NotificationAlert from "react-notification-alert";
import logo from "../logo.jpeg";
import laptop from "../laptop.svg";
// reactstrap components
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Form,
  Input,
  Container,
  Card,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Button,
  CardBody,
} from "reactstrap";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
class PublicQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Quiz: [],
      isEmpty: true,
      isLoading: true,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  toggle = () => this.setState({ modal: !this.state.modal });

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
  async componentDidMount() {
    let Quiz = [];
    if (window.$notification[0]) {
      this.notify(
        "tc",
        window.$notification[1],
        window.$notification[2],
        window.$notification[3]
      );
      window.$notification = false;
    }
    await fetch("https://quiz-c74b2-default-rtdb.firebaseio.com/Quiz.json")
      .then((res) => res.json())
      .then((data) => {
        for (let eachData in data) {
          if (
            data[eachData].Type === "Public" &&
            data[eachData].Status === "Ongoing"
          )
            Quiz.push(data[eachData]);
        }
      });
    if (Quiz === null || Quiz.length === 0) {
      this.setState({ isEmpty: true, isLoading: false });
    } else if (Quiz.length > 0) {
      this.setState({ Quiz: Quiz, isEmpty: false, isLoading: false });
    }
  }
  render() {
    let listItems = this.state.Quiz.map((user) => {
      return (
        <Col md="12" className="mb-4">
          <Link to={`/auth/proctor/${user.index}`}>
            <Card className="mb-0">
              <CardHeader>
                <CardTitle tag="h2">{user.Title}</CardTitle>
                <h4 className="float-left">
                  Total questions:&nbsp;{user.Questions.length}
                </h4>
              </CardHeader>
            </Card>
          </Link>
        </Col>
      );
    });
    return (
      <>
        <Modal
          isOpen={this.state.modal}
          toggle={() => this.toggle()}
          className="bg-transparent"
        >
          <ModalHeader tag="h2" toggle={() => this.toggle()}>
            Reset password
          </ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <label>Email</label>
                    <Input
                      defaultValue={this.state.email}
                      placeholder="Email"
                      type="text"
                      className="text-dark"
                      onChange={(e) => {
                        this.setState({ email: e.target.value });
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-fill ml-auto"
              color="primary"
              type="submit"
              onClick={(e) => this.resetPassword(e)}
            >
              Submit
            </Button>
          </ModalFooter>
        </Modal>
        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
        <Container className="w-100">
          <Row className="my-5 pt-5">
            <Col md="6" className="mb-5">
              <div className="w-100 text-md text-head my-auto">
                <p className="text-left text-primary">
                  <span className="text-lg text-success">C</span>reate,{" "}
                  <span className="text-lg text-success">E</span>dit{" "}
                  <span className="text-lg text-success">&</span> <br />
                  <span className="text-lg text-success">P</span>articipate
                </p>
                <h3 className="text-light mt-5">
                  Create online quizzes in{" "}
                  <span className="text-success">simple</span> steps
                </h3>
              </div>
              <Link to="/auth/register">
                <Button size="lg" className="btn-fill btn-primary my-5">
                  Get started&nbsp;<i className="tim-icons icon-spaceship"></i>
                </Button>
              </Link>
            </Col>
            <Col md="6" className="d-none d-sm-block">
              <Lottie
                isClickToPauseDisabled={true}
                className="w-100"
                width={500}
                height={500}
                options={defaultOptions}
              />
            </Col>
          </Row>
          <Row className="mt-5 ">
            <p className="text-md text-primary mx-auto">
              <span className="text-lg text-success">A</span>bout
            </p>
          </Row>
          <Row>
            <Col md="3" className="text-right d-none d-md-block ">
              <img src={logo} alt="Quiz Yaar" width={100} height={100} />
            </Col>
            <Col md="9">
              <h3 className="text-light text-center text-lg-left my-auto">
                Quizyaar is platform where you can test your understandings and
                evaluate your knowledge. It provides Quizzes by which you can
                implement your learning and learn from your mistakes.
              </h3>
            </Col>
          </Row>
          <Row className="mt-5 text-center">
            <Col md="4" className="mb-4">
              <Card className="pt-4 h-100">
                <CardHeader>
                  <CardTitle tag="h1" className="text-primary">
                    <i className="tim-icons icon-lock-circle" />
                    <br />
                    &nbsp;<span className="text-success">S</span>ecure
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <h4 className="text-left text-justify  text-light mx-4 my-auto">
                    One single vulnerability is all an attacker needs. <br />
                    So here are some secure quizzes, by tracking user`s activity
                    they can be disqualified from the quiz.
                  </h4>
                </CardBody>
              </Card>
            </Col>
            <Col md="4" className="mb-4">
              <Card className="pt-4 h-100">
                <CardHeader>
                  <CardTitle tag="h1" className="text-primary">
                    <i className="tim-icons icon-satisfied" />
                    <br />
                    &nbsp;<span className="text-success">E</span>asy
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <h4 className="text-left text-justify text-light mx-4 my-auto">
                    The journey of thousand miles begins with a single step.{" "}
                    <br />
                    So take a single step and operate a platform which is easy
                    to access and use.
                  </h4>
                </CardBody>
              </Card>
            </Col>
            <Col md="4" className="mb-4">
              <Card className="pt-4 h-100">
                <CardHeader>
                  <CardTitle tag="h1" className="text-primary">
                    <i className="tim-icons icon-money-coins" />
                    <br />
                    &nbsp;<span className="text-success">F</span>ree
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <h4 className="text-left text-justify text-light mx-4 my-auto">
                    "An investment in knowledge pays the best interest".
                    Quizyaar is a free platform where you just need to invest
                    your learnings and explore your knowledge.
                  </h4>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mt-5 ">
            <p className="text-md text-primary mx-auto">
              <span className="text-lg text-success">T</span>ry it
            </p>
          </Row>
          <Row>
            <Col md="12">
              <Row>
                <Col md="7" className="text-center">
                  <h3 className="text-light text-lg-left text-sm-center my-auto">
                    Ready to test your knowledge?
                    <br />
                    Here's some <span className="text-success">
                      quizzes
                    </span>{" "}
                    for you. Go ahead and try some.
                  </h3>
                  <img src={laptop} width={400} height={400} alt="Laptop" />
                </Col>
                <Col md="5">
                  <h6
                    className="text-uppercase text-muted ls-1 mb-1 py-3 text-center"
                    style={{
                      display:
                        this.state.isEmpty && !this.state.isLoading
                          ? "auto"
                          : "none",
                    }}
                  >
                    No Quizzes found
                  </h6>

                  <div
                    className={
                      this.state.isLoading ? "content d-auto" : "content d-none"
                    }
                  >
                    <ReactLoading
                      className="mx-auto mt-5"
                      type="spin"
                      color="#e14eca"
                      height={100}
                      width={50}
                    />
                  </div>
                  <Row className={this.state.isLoading ? "d-none" : "d-auto"}>
                    {listItems}
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        <Footer fluid />
      </>
    );
  }
}

export default PublicQuiz;
