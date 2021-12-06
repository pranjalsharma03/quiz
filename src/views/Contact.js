import React from "react";
import firebase from "../variables/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotificationAlert from "react-notification-alert";
import Lottie from "react-lottie";
import { v1 as uuidv1 } from "uuid";
import animationData from "../satelite.json";
// reactstrap components
import {
  Button,
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
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
let id;
class Contact extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      message: "",
      border1: false,
      border2: false,
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
  changeColor(id) {
    if (id === 1) this.setState({ border1: true });
    else if (id === 2) this.setState({ border2: true });
  }
  removeColor(id) {
    if (id === 1) this.setState({ border1: false });
    else if (id === 2) this.setState({ border2: false });
  }
  handleMessage = async () => {
    id = uuidv1();

    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(this.state.email).toLowerCase())) {
      await firebase
        .database()
        .ref()
        .child("Contact/" + id)
        .update({
          email: this.state.email,
          message: this.state.message,
          datentime: Date.now(),
          index: id,
        });
      document.getElementById("contact-form").reset();
      this.notify("tc", "Message sent.", "success", "icon-check-2");
    } else {
      this.notify("tc", "Enter a valid email.", "danger", "icon-simple-remove");
      this.setState({ redirect: false, isLoading: false });
    }
  };
  render() {
    return (
      <>
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
                <span className="text-success">T</span>alk
              </p>
              <br />
              <p className="my-auto text-right text-md  text-primary floating rev">
                <span className="text-success">t</span>o
              </p>
              <br />
              <p className="my-auto text-right text-primary floating">
                <span className="text-success">u</span>s
              </p>
            </div>
          </Col>
          <Col
            lg="4"
            md="4"
            xs="10"
            className="pr-lg-5 pt-5 pt-md-0 mx-auto my-auto"
          >
            <Form role="form" id="contact-form">
              <Card className="m-auto">
                <CardBody className="px-lg-5 py-lg-5 text-center">
                  {/* <div className="text-center text-muted mb-4">
                    <img src={logo} style={{ width: "4rem" }} alt="Quiz Yaar" />
                  </div> */}
                  <h3 className="mb-4 text-primary">Send us a message</h3>
                  <FormGroup className="mb-3 input-glow">
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
                          <i className="tim-icons icon-chat-33 text-primary mb-auto mt-1" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        cols="80"
                        required
                        rows="4"
                        type="textarea"
                        placeholder="Enter your message here..."
                        autoCompleteType="message"
                        placeholderTextColor="#000"
                        autoCapitalize="none"
                        secureTextEntry
                        onFocus={() => this.changeColor(2)}
                        onBlur={() => this.removeColor(2)}
                        onChange={(message) =>
                          this.setState({ message: message.target.value })
                        }
                      />
                    </InputGroup>
                  </FormGroup>
                </CardBody>
                <CardFooter className="text-right">
                  <Button
                    size="sm"
                    type="submit"
                    className="btn-primary"
                    onClick={() => this.handleMessage()}
                  >
                    <FontAwesomeIcon
                      title="Public"
                      size="lg"
                      icon={faPaperPlane}
                    />
                    &nbsp;Send
                  </Button>
                </CardFooter>
              </Card>
            </Form>
          </Col>
        </Row>
      </>
    );
  }
}

export default Contact;
