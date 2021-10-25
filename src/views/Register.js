import React from "react";
import firebase from "../variables/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import NotificationAlert from "react-notification-alert";
import Lottie from "react-lottie";
import animationData from "../astronaut.json";
import ReactLoading from "react-loading";
import logo from "../logo.png";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  CardFooter,
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

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      conpassword: " ",
      border1: false,
      border2: false,
      border3: false,
      modal: false,
      isLoading: false,
      errorMessage: null,
      redirect: false,
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
        this.notify("tc");
      });
  };
  handleRegister = async () => {
    this.setState({ isLoading: true });
    let { email, password, conpassword } = this.state;
    if (password.trim() === conpassword) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(String(email).toLowerCase())) {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .catch((error) => {
            this.setState({ errorMessage: error.message, isLoading: false });
            this.notify("tc");
          });
        this.handleLogin();
      } else {
        this.notify(
          "tc",
          "Enter a valid email.",
          "danger",
          "icon-simple-remove"
        );
        this.setState({ redirect: false, isLoading: false });
      }
    } else {
      this.notify(
        "tc",
        "Passwords don`t match.",
        "danger",
        "icon-simple-remove"
      );
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
    else if (id === 3) this.setState({ border3: true });
  }
  removeColor(id) {
    if (id === 1) this.setState({ border1: false });
    else if (id === 2) this.setState({ border2: false });
    else if (id === 3) this.setState({ border3: false });
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
          <ModalHeader toggle={() => this.toggle()}>Reset password</ModalHeader>
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
                <span className="text-success">J</span>oin
              </p>
              <br />
              <p className="my-auto text-right text-md text-primary floating rev">
                <span className="text-success">o</span>ur
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
            <Form role="form">
              <Card className="m-auto">
                <CardBody className="px-lg-5 py-lg-5 text-center">
                  <div className="text-center text-muted mb-4">
                    <img src={logo} style={{ width: "4rem" }} alt="Quiz Yaar" />
                  </div>
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
                  <FormGroup className="mb-3">
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
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText
                          className={
                            this.state.border3 ? "input-addon-border" : ""
                          }
                        >
                          <i className="tim-icons icon-refresh-02 text-primary" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        required
                        type="password"
                        placeholder="Confirm Password"
                        autoCompleteType="password"
                        placeholderTextColor="#000"
                        autoCapitalize="none"
                        secureTextEntry
                        onFocus={() => this.changeColor(3)}
                        onBlur={() => this.removeColor(3)}
                        onChange={(conpassword) =>
                          this.setState({
                            conpassword: conpassword.target.value,
                          })
                        }
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
                        this.handleRegister();
                      }}
                      className={
                        !this.state.isLoading ? "my-3 d-auto" : "my-3 d-none"
                      }
                      color={this.state.isLoading ? "success" : "primary"}
                      type="submit"
                    >
                      {this.state.isLoading ? "Signing up" : "Register"}
                    </Button>
                  </div>

                  <Link className="mb-2" to="/auth/sign">
                    Already have one? Sign in
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
                    <Button className="text-primary btn-link"
                    onClick={() => this.handleFacebookLogin()}>
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
            </Form>
          </Col>
        </Row>
      </>
    );
  }
}

export default Register;
