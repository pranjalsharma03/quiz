import React from "react";
import firebase from "../variables/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import NotificationAlert from "react-notification-alert";
import Lottie from "react-lottie";
import animationData from "../cow.json";
import ReactLoading from "react-loading";
import logo from "../logo.png";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import { Redirect } from "react-router-dom";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      border1: false,
      border2: false,
      isLoading: false,
      errorMessage: null,
      redirect: false,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  toggle = () => this.setState({ modal: !this.state.modal });
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
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

  resetPassword = async () => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(this.state.email).toLowerCase())) {
      await firebase.auth().sendPasswordResetEmail(this.state.email);
      this.notify(
        "tc",
        "Reset password link has been sent!",
        "success",
        "icon-check-2"
      );
      this.setState({ email: "", password: "", modal: false });
    } else {
      this.notify("tc", "Enter a valid email.", "danger", "icon-simple-remove");
    }
  };
  handleLogin = async () => {
    this.setState({ isLoading: true });
    let { email, password } = this.state;

    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase())) {
      await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          var user = firebase.auth().currentUser;
          if (user) {
            this.setState({ redirect: true });
          } else {
            this.setState({ redirect: false, isLoading: false });
          }
        })
        .catch((error) => {
          this.setState({ errorMessage: error.message, isLoading: false });
          this.notify("tc", error.message, "danger", "icon-trash-simple");
        });
    } else {
      this.notify("tc", "Enter a valid email.", "danger", "icon-simple-remove");
      this.setState({ redirect: false, isLoading: false });
    }
  };
  handleGoogleLogin = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        this.setState({ redirect: true });
        // ...
      })
      .catch((error) => {
        this.setState({ errorMessage: error.message, isLoading: false });

        this.notify("tc", error.message, "danger", "icon-trash-simple");
      });
  };
  handleFacebookLogin = () => {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        this.setState({ redirect: true });
      })
      .catch((error) => {
        this.setState({ errorMessage: error.message, isLoading: false });

        this.notify("tc", error.message, "danger", "icon-trash-simple");
      });
  };

  changeColor(id) {
    if (id === 1) this.setState({ border1: true });
    else if (id === 2) this.setState({ border2: true });
  }
  removeColor(id) {
    if (id === 1) this.setState({ border1: false });
    else if (id === 2) this.setState({ border2: false });
  }
  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect push to="/admin/quiz" />;
    }
    return (
      <>
        <Modal
          isOpen={this.state.modal}
          toggle={() => this.toggle()}
          className="bg-transparent"
        >
          <Form>
            <ModalHeader tag="h2" toggle={() => this.toggle()}>
              Reset password
            </ModalHeader>
            <ModalBody>
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
          </Form>
        </Modal>
        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
        <Row
          className="mt-4 side-panel"
          style={{ height: this.state.height * 0.9 }}
        >
          <Col lg="7" md="7" className="d-none d-sm-flex">
            <Lottie
              isClickToPauseDisabled={true}
              className="w-75"
              options={defaultOptions}
            />
            <div className="w-25 text-lg my-auto">
              <p className="my-auto text-right text-primary floating">
                <span className="text-success">E</span>nter
              </p>
              <br />
              <p className="my-auto text-right text-md  text-primary floating rev">
                <span className="text-success">y</span>our
              </p>
              <br />
              <p className="my-auto text-right text-primary floating">
                <span className="text-success">s</span>pace
              </p>
            </div>
          </Col>
          <Col
            lg="4"
            md="4"
            xs="10"
            className="pr-lg-5 pt-5 pt-md-0 mx-auto my-auto"
          >
            <Card className="m-auto">
              <CardBody className="px-lg-5 py-lg-5 text-center">
                <div className="text-center text-muted mb-4">
                  <img src={logo} style={{ width: "4rem" }} alt="Quiz Yaar" />
                </div>
                <Form role="form">
                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText
                          className={
                            this.state.border1 ? "input-addon-border" : ""
                          }
                        >
                          <i className="tim-icons icon-email-85 text-primary" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        required
                        type="email"
                        placeholder="Email Address"
                        autoCompleteType="email"
                        placeholderTextColor="#000"
                        autoCapitalize="none"
                        onFocus={() => this.changeColor(1)}
                        onBlur={() => this.removeColor(1)}
                        onChange={(email) =>
                          this.setState({ email: email.target.value })
                        }
                        // value={this.state.email}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText
                          className={
                            this.state.border2 ? "input-addon-border" : ""
                          }
                        >
                          <i className="tim-icons icon-lock-circle text-primary" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        required
                        type="password"
                        placeholder="Password"
                        autoCompleteType="password"
                        placeholderTextColor="#000"
                        autoCapitalize="none"
                        secureTextEntry
                        onFocus={() => this.changeColor(2)}
                        onBlur={() => this.removeColor(2)}
                        onChange={(password) =>
                          this.setState({ password: password.target.value })
                        }
                        // value={this.state.password}
                      />
                    </InputGroup>
                  </FormGroup>
                  <div className="text-center">
                    <ReactLoading
                      className={
                        this.state.isLoading ? "mx-auto my-4  d-auto" : "d-none"
                      }
                      type="spin"
                      color="#e14eca"
                      height={35}
                      width={35}
                    />
                    <Button
                      onClick={() => {
                        this.handleLogin();
                      }}
                      className={
                        !this.state.isLoading ? "my-3 d-auto" : "my-3 d-none"
                      }
                      color={this.state.isLoading ? "success" : "primary"}
                      type="button"
                    >
                      {this.state.isLoading ? "Signing in" : "Sign in"}
                    </Button>
                  </div>
                </Form>

                <Link className="mb-2" to="/auth/register">
                  Don`t have one? Sign up
                </Link>
                <br />
                <Link className="text-warning" onClick={() => this.toggle()}>
                  Forgot password?
                </Link>
              </CardBody>
              <CardFooter className="text-center mb-3">
                <small>Sign in using</small>
                <Row>
                  <Col>
                    <Button
                      className="text-primary btn-link"
                      onClick={() => this.handleGoogleLogin()}
                    >
                      <FontAwesomeIcon
                        title="Public"
                        size="lg"
                        icon={faGoogle}
                      />
                      oogle
                    </Button>
                  </Col>
                  {/* <Col>
                    <Button
                      className="text-primary btn-link"
                      onClick={() => this.handleFacebookLogin()}
                    >
                      <FontAwesomeIcon
                        title="Public"
                        size="lg"
                        icon={faFacebookF}
                      />
                      acebook
                    </Button>
                  </Col> */}
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

export default Login;
