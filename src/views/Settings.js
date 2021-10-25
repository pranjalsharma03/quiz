import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import firebase from "../variables/config";
import NotificationAlert from "react-notification-alert";
import {
  faGlobeAfrica,
  faLock,
  faCalendarCheck,
  faClock,
  faCalendarDay,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import ReactLoading from "react-loading";
import Topbar from "../components/Topbar/Topbar";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
  Modal,
  ModalBody,
  ModalHeader,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Form,
  Input,
  Label,
  Row,
  Col,
  Button,
} from "reactstrap";

let tmp = {};
let id;
const info = [
  {
    head: "Randomize",
    body: [
      "On enabling this feature, the questions in your quiz will be shuffled before each quiz attempt.",
    ],
  },
  {
    head: "Reach",
    body: [
      "This section covers who and when one can take part in the quiz:",
      "Status: It defines the current state in which the quiz is declared and when it will be available to its specific audience.",
      "Type: This field determines if the quiz will be available for everyone(Public) or to only those who have its link(Private)",
    ],
  },
  {
    head: "Marking",
    body: [
      "This section covers the positive and negative marking that will be granted to the participants on correct and wrong response respectively.",
    ],
  },
  {
    head: "Timer",
    body: [
      "This section covers the time retrictions that is granted to the participants for the quiz. It can be either be done for each question, the whole quiz or no restriction at all. You can try these types of timing restrictions by experiencing it in demo quizzes",
    ],
  },
];
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Question: [],
      Type: "",
      title: "",
      infoHead: "",
      infoBody: [],
      random: false,
      Status: "",
      timerType: "None",
      timer: 0,
      modal: false,
      isEmpty: true,
      isLoading: true,
    };
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
  isNotEmpty(fields) {
    let fieldEmpty = false;
    for (let eachData in fields) {
      if (typeof(fields[eachData].val)==="undefined"||fields[eachData].val.length === 0) {
        fieldEmpty = true;
        this.notify(
          "tc",
          fields[eachData].field + " is empty.",
          "danger",
          "icon-trash-simple"
        );
      }
    }
    if (!fieldEmpty) {
      this.saveSettings();
    }
  }
  async saveSettings() {
    var QuizRef = await firebase
      .database()
      .ref()
      .child("Quiz/" + id);
    if (this.state.pscore <= 0) {
      this.notify(
        "tc",
        "Positive score should be greater than 1.",
        "danger",
        "icon-trash-simple"
      );
    } else {
      QuizRef.update({
        Status: this.state.Status,
        Title: this.state.title,
        Type: this.state.Type,
        timerType: this.state.timerType,
        timer: parseInt(this.state.min * 60) + parseInt(this.state.sec),
        pscore: this.state.pscore,
        nscore: this.state.nscore,
        datentime: Date.now(),
        random: this.state.random,
        index: id,
      });
      this.notify("tc", "Settings saved.", "success", "icon-check-2");
    }
  }
  async componentDidMount() {
    if (window.$notification[0]) {
      this.notify(
        "tc",
        window.$notification[1],
        window.$notification[2],
        window.$notification[3]
      );
      window.$notification = false;
    }

    id = this.props.match.params.id;
    await fetch(
      "https://quizyaar-default-rtdb.firebaseio.com/Quiz/" + id + ".json"
    )
      .then((res) => res.json())
      .then((data) => (tmp = data));
    // console.log(tmp);
    let min = Math.floor(tmp.timer / 60);
    let sec = tmp.timer % 60;
    if (tmp.Questions.length > 0) {
      this.setState({
        title: tmp.Title,
        Type: tmp.Type,
        random: tmp.random,
        Status: tmp.Status,
        timerType: tmp.timerType,
        sec: sec,
        min: min,
        pscore: tmp.pscore,
        nscore: tmp.nscore,
        isEmpty: false,
        isLoading: false,
      });
    } else {
      this.setState({
        isEmpty: true,
        isLoading: false,
      });
    }
  }
  toggleInfo = (index) =>
    this.setState({
      modal: !this.state.modal,
      infoHead: info[index].head,
      infoBody: info[index].body,
    });
  toggle = () => this.setState({ modal: !this.state.modal });
  render() {
    let pItems = this.state.infoBody.map((info) => {
      return <p>{info}</p>;
    });
    return (
      <>
        <Modal
          isOpen={this.state.modal}
          toggle={() => this.toggle()}
          className="bg-transparent"
        >
          <ModalHeader tag="h2" toggle={() => this.toggle()}>
            {this.state.infoHead}
          </ModalHeader>
          <ModalBody>{pItems}</ModalBody>
        </Modal>
        <div
          className={this.state.isLoading ? "content d-auto" : "content d-none"}
        >
          <ReactLoading
            className="mx-auto mt-5"
            type="spin"
            color="#e14eca"
            height={100}
            width={50}
          />
        </div>
        <div
          className="content"
          style={{ visibility: this.state.isLoading ? "hidden" : "visible" }}
        >
          <Topbar id={id} isActive={2} />
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <Row>
                    <Col className="d-flex">
                      <CardTitle tag="h2">Settings&nbsp;</CardTitle>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label>Quiz title:</label>
                          <Input
                            defaultValue={this.state.title}
                            placeholder="Name"
                            size="lg"
                            type="text"
                            onChange={(e) =>
                              this.setState({ title: e.target.value })
                            }
                            className="bg-transparent text-light rounded"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12" className="d-flex">
                        <p className="mr-2" onClick={() => this.toggleInfo(0)}>
                          <FontAwesomeIcon
                            title="Completed"
                            size="sm"
                            icon={faInfoCircle}
                          />
                        </p>
                        <FormGroup>
                          <Label
                            for="randomize"
                            check
                            onClick={(e) =>
                              this.setState({ random: !this.state.random })
                            }
                          >
                            Randomize: &nbsp;
                            <Input
                              className="ml-auto"
                              type="checkbox"
                              checked={this.state.random}
                              name="check"
                            />
                          </Label>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <Row className="mt-3">
                          <Col>
                            <h4>
                              Reach&nbsp;
                              <FontAwesomeIcon
                                title="Completed"
                                size="sm"
                                icon={faInfoCircle}
                                onClick={() => this.toggleInfo(1)}
                              />
                            </h4>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="6">
                            <label>Status:</label>
                            <UncontrolledDropdown setActiveFromChild>
                              <DropdownToggle className="w-100 m-0" caret>
                                <FontAwesomeIcon
                                  title={this.state.Status}
                                  size="md"
                                  icon={
                                    this.state.Status === "Upcoming"
                                      ? faCalendarDay
                                      : this.state.Status === "Ongoing"
                                      ? faClock
                                      : faCalendarCheck
                                  }
                                />
                                &nbsp;{this.state.Status}
                              </DropdownToggle>
                              <DropdownMenu className="bg-dark text-white">
                                <DropdownItem
                                  onClick={() =>
                                    this.setState({ Status: "Upcoming" })
                                  }
                                  className={
                                    this.state.Status.trim() === "Upcoming"
                                      ? "active text-white"
                                      : "text-white"
                                  }
                                >
                                  <FontAwesomeIcon
                                    title="Upcoming"
                                    size="lg"
                                    icon={faCalendarDay}
                                  />
                                  &nbsp;Upcoming
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() =>
                                    this.setState({ Status: "Ongoing" })
                                  }
                                  className={
                                    this.state.Status.trim() === "Ongoing"
                                      ? "active text-white"
                                      : "text-white"
                                  }
                                >
                                  <FontAwesomeIcon
                                    title="Ongoing"
                                    size="lg"
                                    icon={faClock}
                                  />
                                  &nbsp;Ongoing
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() =>
                                    this.setState({ Status: "Completed" })
                                  }
                                  className={
                                    this.state.Status.trim() === "Completed"
                                      ? "active text-white"
                                      : "text-white"
                                  }
                                >
                                  <FontAwesomeIcon
                                    title="Completed"
                                    size="lg"
                                    icon={faCalendarCheck}
                                  />
                                  &nbsp;Completed
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </Col>
                          <Col md="6">
                            <label>Availability:</label>
                            <UncontrolledDropdown setActiveFromChild>
                              <DropdownToggle className="w-100 m-0" caret>
                                <FontAwesomeIcon
                                  title={this.state.Type}
                                  size="md"
                                  icon={
                                    this.state.Type === "Public"
                                      ? faGlobeAfrica
                                      : faLock
                                  }
                                />
                                &nbsp;{this.state.Type}
                              </DropdownToggle>
                              <DropdownMenu className="bg-dark text-white">
                                <DropdownItem
                                  onClick={() =>
                                    this.setState({ Type: "Public" })
                                  }
                                  className={
                                    this.state.Type.trim() === "Public"
                                      ? "active text-white"
                                      : "text-white"
                                  }
                                >
                                  <FontAwesomeIcon
                                    title="Public"
                                    size="lg"
                                    icon={faGlobeAfrica}
                                  />
                                  &nbsp;Public
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() =>
                                    this.setState({ Type: "Private" })
                                  }
                                  className={
                                    this.state.Type.trim() === "Private"
                                      ? "active text-white"
                                      : "text-white"
                                  }
                                >
                                  <FontAwesomeIcon
                                    title="Private"
                                    size="lg"
                                    icon={faLock}
                                  />
                                  &nbsp;Private
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </Col>
                        </Row>
                      </Col>
                      <Col md="6">
                        <Row className="mt-3">
                          <Col>
                            <h4>
                              Marking&nbsp;
                              <FontAwesomeIcon
                                title="Completed"
                                size="sm"
                                icon={faInfoCircle}
                                onClick={() => this.toggleInfo(2)}
                              />
                            </h4>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="5">
                            <FormGroup>
                              <label>Positive marking:</label>
                              <Input
                                defaultValue={this.state.pscore}
                                placeholder="Positive marking"
                                type="number"
                                onChange={(e) =>
                                  this.setState({ pscore: e.target.value })
                                }
                                className="bg-transparent text-light rounded"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="5">
                            <FormGroup>
                              <label>Negative marking:</label>
                              <Input
                                defaultValue={this.state.nscore}
                                placeholder="Negative marking"
                                type="number"
                                onChange={(e) =>
                                  this.setState({ nscore: e.target.value })
                                }
                                className="bg-transparent text-light rounded"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col>
                        <h4>
                          Timer&nbsp;
                          <FontAwesomeIcon
                            title="Completed"
                            size="sm"
                            icon={faInfoCircle}
                            onClick={() => this.toggleInfo(3)}
                          />
                        </h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="3">
                        <FormGroup>
                          <label>Type:</label>
                          <UncontrolledDropdown setActiveFromChild>
                            <DropdownToggle className="w-100 m-0" caret>
                              {this.state.timerType === "Question"
                                ? "Individual question"
                                : this.state.timerType === "Quiz"
                                ? "Full Quiz"
                                : "None"}
                            </DropdownToggle>
                            <DropdownMenu className="bg-dark text-white">
                              <DropdownItem
                                onClick={() =>
                                  this.setState({ timerType: "None" })
                                }
                                className={
                                  this.state.timerType.trim() === "None"
                                    ? "active text-white"
                                    : "text-white"
                                }
                              >
                                None
                              </DropdownItem>
                              <DropdownItem
                                onClick={() =>
                                  this.setState({ timerType: "Question" })
                                }
                                className={
                                  this.state.timerType.trim() === "Question"
                                    ? "active text-white"
                                    : "text-white"
                                }
                              >
                                Individual question
                              </DropdownItem>
                              <DropdownItem
                                onClick={() =>
                                  this.setState({ timerType: "Quiz" })
                                }
                                className={
                                  this.state.timerType.trim() === "Quiz"
                                    ? "active text-white"
                                    : "text-white"
                                }
                              >
                                Full Quiz
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </FormGroup>
                      </Col>
                      <Col
                        md="1"
                        className={
                          this.state.timerType === "None" ? "d-none" : "d-auto"
                        }
                      >
                        <FormGroup>
                          <label>Minutes:</label>
                          <Input
                            defaultValue={this.state.min}
                            placeholder="Minutes"
                            type="number"
                            onChange={(e) =>
                              this.setState({ min: e.target.value })
                            }
                            className="bg-transparent text-light rounded"
                          />
                        </FormGroup>
                      </Col>
                      <Col
                        md="1"
                        className={
                          this.state.timerType === "None" ? "d-none" : "d-auto"
                        }
                      >
                        <FormGroup>
                          <label>Seconds:</label>
                          <Input
                            defaultValue={this.state.sec}
                            placeholder="Seconds"
                            type="number"
                            onChange={(e) =>
                              this.setState({ sec: e.target.value })
                            }
                            className="bg-transparent text-light rounded"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
                <CardFooter className="text-right">
                  <Button
                    type="button"
                    className="btn-fill btn-success"
                    onClick={() => {
                      this.isNotEmpty([
                        { field: "Title", val: this.state.title },
                      ])
                    }}
                  >
                    Save
                  </Button>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Settings;
