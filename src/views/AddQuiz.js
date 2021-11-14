import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import firebase from "../variables/config";
import {
  faGlobeAfrica,
  faLock,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import NotificationAlert from "react-notification-alert";
import { Redirect } from "react-router-dom";
import ReactLoading from "react-loading";
import { v1 as uuidv1 } from "uuid";
import { CSVLink } from "react-csv";
import { CSVReader } from "react-papaparse";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
  FormGroup,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  Row,
  Col,
  Button,
} from "reactstrap";

let data = [];
let id;

const info = [
  {
    head: "Randomize",
    body: [
      "On enabling this feature, the questions in your quiz will be shuffled before each quiz attempt.",
    ],
  },
  {
    head: "Uploading csv",
    body: [
      "You can easily upload .csv file of questions but this format must be followed:",
      "Header Keys: Question, Answer, A, B, C and D.",
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
class AddQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Questype:false,
      toggle: false,
      Ques: "",
      Answer: "_",
      A: "",
      B: "",
      C: "",
      D: "",
      Question: [],
      modal: false,
      infoHead: "",
      infoBody: [],
      timerType: "None",
      sec: 0,
      min: 0,
      nscore: 0,
      pscore: 1,
      Status: "Upcoming",
      Type: "Public",
      random: false,
      isEmpty: true,
      isLoading: false,
      redirect: false,
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
  changeFile(tmp) {
    data = [];
    for (let i = 0; i < tmp.length; i++) {
      data.push(tmp[i].data);
    }
    // console.log(data);
  }
  toggleInfo = (index) =>
    this.setState({
      modal: !this.state.modal,
      infoHead: info[index].head,
      infoBody: info[index].body,
    });
  toggle = () => this.setState({ modal: !this.state.modal });
  toggleModal = () => {
    this.setState({ toggle: !this.state.toggle });
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
      this.saveQuiz();
    }
  }
  async saveQuiz() {
    id = uuidv1();
    let i = 1;
    for (let eachData in this.state.Question) {
      this.state.Question[eachData].index = i;
      i++;
    }
    if (this.state.pscore <= 0) {
      this.notify(
        "tc",
        "Positive score should be greater than 1.",
        "danger",
        "icon-trash-simple"
      );
    } else {
      var QuesRef = await firebase
        .database()
        .ref()
        .child("Quiz/" + id);
      QuesRef.update({
        Questions: this.state.Question,
        Invigilator: firebase.auth().currentUser.email,
        Status: this.state.Status,
        timerType: this.state.timerType,
        timer: parseInt(this.state.min * 60) + parseInt(this.state.sec),
        pscore: this.state.pscore,
        nscore: this.state.nscore,
        Title: this.state.title,
        Type: this.state.Type,
        datentime: Date.now(),
        random: this.state.random,
        index: id,
      });
      this.setState({ redirect: true });
    }
  }
  deleteQuestion(index) {
    data = this.state.Question;
    for (let j = index - 1; j < data.length - 1; j++) {
      data[j] = data[j + 1];
      data[j].index--;
    }
    data.pop();
    this.setState({ Question: data });
    this.notify("tc", "Question deleted.", "danger", "icon-trash-simple");
  }
  processFile() {
    let i = this.state.Question.length + 1;
    for (let eachData in data) {
      if (
        typeof data[eachData].Question !== "undefined" ||
        typeof data[eachData].Answer !== "undefined" ||
        typeof data[eachData].A !== "undefined" ||
        typeof data[eachData].B !== "undefined" ||
        typeof data[eachData].C !== "undefined" ||
        typeof data[eachData].D !== "undefined"
      ) {
        data[eachData].index = i;
        this.state.Question.push({
          Question: data[eachData].Question,
          Questype: data[eachData].Questype,
          index: data[eachData].index,
          Answer: data[eachData].Answer,
          A: data[eachData].A,
          B: data[eachData].B,
          C: data[eachData].C,
          D: data[eachData].D,
        });
        i++;
      }
    }
    this.setState({ isEmpty: false });
    this.notify("tc", "Questions added.", "success", "icon-check-2");
  }
  async saveQuestion(e) {
    let length = this.state.Question.length;
    this.state.Question.push({
      Question: this.state.Ques,
      Questype:this.state.Questype,
      A: this.state.A,
      B: this.state.B,
      C: this.state.C,
      D: this.state.D,
      Answer: this.state.Answer,
      index: length + 1,
    });
    data = this.state.Question;
    let i = 1;
    for (let eachData in data) {
      data[eachData].index = i;
      i++;
    }
    this.setState({
      Question: data,
      isEmpty: false,
      Ques: "",
      A: "",
      B: "",
      C: "",
      D: "",
      Answer: "_",
    });
    this.toggleModal();
    this.notify("tc", "Question saved.", "success", "icon-check-2");
  }
  render() {
    let QuestionItem = (props) => {
      const [modal, setModal] = useState(false);
      const [Question, setQuestion] = useState(props.main.Question);
      const [Answer, setAnswer] = useState(props.main.Answer);
      const [A, setA] = useState(props.main.A);
      const [B, setB] = useState(props.main.B);
      const [C, setC] = useState(props.main.C);
      const [D, setD] = useState(props.main.D);
      const toggle = () => setModal(!modal);
      const saveQuestion = async (e) => {
        var QuesRef = await firebase
          .database()
          .ref()
          .child("Quiz/" + props.id + "/Questions/" + props.main.index);
        QuesRef.update({
          index: props.main.index,
          Question: Question,
          Answer: Answer,
          A: A,
          B: B,
          C: C,
          D: D,
        });
        props.notify("tc", "Question saved.", "success", "icon-check-2");
      };
      return (
        <>
          <Modal isOpen={modal} toggle={toggle} className="bg-transparent">
            <ModalHeader tag="h2" toggle={toggle}>
              Question Details
            </ModalHeader>
            <ModalBody>
              <Form>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Question</label>
                      <Input
                        defaultValue={props.main.Question}
                        placeholder="Question"
                        type="text"
                        className="text-dark"
                        onChange={(e) => {
                          setQuestion(e.target.value);
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className={this.state.Questype?"d-none":""}>
                  <Col className="pr-md-1" md="6">
                    <FormGroup>
                      <label>A</label>
                      <Input
                        defaultValue={props.main.A}
                        placeholder="A"
                        type="text"
                        className="text-dark"
                        onChange={(e) => {
                          setA(e.target.value);
                        }}
                      />
                    </FormGroup>
                  </Col>

                  <Col className="pl-md-1" md="6">
                    <FormGroup>
                      <label>B</label>
                      <Input
                        defaultValue={props.main.B}
                        placeholder="B"
                        type="text"
                        className="text-dark"
                        onChange={(e) => {
                          setB(e.target.value);
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-md-1" md="6">
                    <FormGroup>
                      <label>C</label>
                      <Input
                        defaultValue={props.main.C}
                        placeholder="C"
                        type="text"
                        className="text-dark"
                        onChange={(e) => {
                          setC(e.target.value);
                        }}
                      />
                    </FormGroup>
                  </Col>

                  <Col className="pl-md-1" md="6">
                    <FormGroup>
                      <label>D</label>
                      <Input
                        defaultValue={props.main.D}
                        placeholder="D"
                        type="text"
                        className="text-dark"
                        onChange={(e) => {
                          setD(e.target.value);
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-md-1" md="1">
                    <FormGroup>
                      <label>Answer</label>
                      <UncontrolledDropdown setActiveFromChild>
                        <DropdownToggle className="btn-fill w-100 m-0" caret>
                          {Answer}
                        </DropdownToggle>
                        <DropdownMenu className="bg-dark text-white">
                          <DropdownItem
                            onClick={() => setAnswer("A")}
                            className={
                              Answer.trim() === "A"
                                ? "active text-white"
                                : "text-white"
                            }
                          >
                            A
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => setAnswer("B")}
                            className={
                              Answer.trim() === "B"
                                ? "active text-white"
                                : "text-white"
                            }
                          >
                            B
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => setAnswer("C")}
                            className={
                              Answer.trim() === "C"
                                ? "active text-white"
                                : "text-white"
                            }
                          >
                            C
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => setAnswer("D")}
                            className={
                              Answer.trim() === "D"
                                ? "active text-white"
                                : "text-white"
                            }
                          >
                            D
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
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
                onClick={(e) => saveQuestion(e)}
              >
                Save
              </Button>
            </ModalFooter>
          </Modal>
          <tr>
            <td
              className="text-center"
              onClick={() => {
                setModal(!modal);
              }}
            >
              {props.main.index}
            </td>
            <td
              onClick={() => {
                setModal(!modal);
              }}
            >
              {props.main.Question}
            </td>
            <td
              className="text-center"
              onClick={() => {
                setModal(!modal);
              }}
            >
              {props.main.Answer}
            </td>
            <td className="text-right">
              <i
                onClick={() => {
                  this.deleteQuestion(props.main.index);
                }}
                className="tim-icons icon-simple-remove font-weight-bold text-warning float-right"
              ></i>
            </td>
          </tr>
        </>
      );
    };
    let pItems = this.state.infoBody.map((info) => {
      return <p>{info}</p>;
    });
    if (this.state.redirect) {
      return <Redirect push to="/admin/quiz" />;
    }
    let listItems = this.state.Question.map((user) => {
      return <QuestionItem main={user} id={id} notify={this.notify} />;
    });
    return (
      <>
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
          <Modal
            isOpen={this.state.toggle}
            toggle={() => this.toggleModal()}
            className="bg-transparent"
          >
            <ModalHeader tag="h2" toggle={() => this.toggleModal()}>
              Add a Question
            </ModalHeader>
            <ModalBody>
              <Form>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Question</label>
                      <Input
                        defaultValue={this.state.Ques}
                        placeholder="Question"
                        type="text"
                        className="text-dark"
                        onChange={(e) => {
                          this.setState({ Ques: e.target.value });
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                
                <Row>
                  <Col md="12">
                    <UncontrolledDropdown setActiveFromChild>
                        <DropdownToggle className="btn-fill w-100 m-0" caret>
                          {this.state.Questype}
                        </DropdownToggle>
                        <DropdownMenu className="bg-dark text-white">
                          <DropdownItem
                            onClick={() => this.setState({ Questype: false })}
                            className={
                              this.state.Questype
                                ? "active text-white"
                                : "text-white"
                            }
                          >
                            Multi-choice
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => this.setState({ Questype: true })}
                            className={
                              this.state.Questype
                                ? "active text-white"
                                : "text-white"
                            }
                          >
                            Description
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-md-1" md="6">
                    <FormGroup>
                      <label>A</label>
                      <Input
                        defaultValue={this.state.A}
                        placeholder="A"
                        type="text"
                        className="text-dark"
                        onChange={(e) => {
                          this.setState({ A: e.target.value });
                        }}
                      />
                    </FormGroup>
                  </Col>

                  <Col className="pl-md-1" md="6">
                    <FormGroup>
                      <label>B</label>
                      <Input
                        defaultValue={this.state.B}
                        placeholder="B"
                        type="text"
                        className="text-dark"
                        onChange={(e) => {
                          this.setState({ B: e.target.value });
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-md-1" md="6">
                    <FormGroup>
                      <label>C</label>
                      <Input
                        defaultValue={this.state.C}
                        placeholder="C"
                        type="text"
                        className="text-dark"
                        onChange={(e) => {
                          this.setState({ C: e.target.value });
                        }}
                      />
                    </FormGroup>
                  </Col>

                  <Col className="pl-md-1" md="6">
                    <FormGroup>
                      <label>D</label>
                      <Input
                        defaultValue={this.state.D}
                        placeholder="D"
                        type="text"
                        className="text-dark"
                        onChange={(e) => {
                          this.setState({ D: e.target.value });
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="2">
                    <FormGroup>
                      <label>Answer</label>
                      <UncontrolledDropdown setActiveFromChild>
                        <DropdownToggle className="btn-fill w-100 m-0" caret>
                          {this.state.Answer}
                        </DropdownToggle>
                        <DropdownMenu className="bg-dark text-white">
                          <DropdownItem
                            onClick={() => this.setState({ Answer: "A" })}
                            className={
                              this.state.Answer.trim() === "A"
                                ? "active text-white"
                                : "text-white"
                            }
                          >
                            A
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => this.setState({ Answer: "B" })}
                            className={
                              this.state.Answer.trim() === "B"
                                ? "active text-white"
                                : "text-white"
                            }
                          >
                            B
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => this.setState({ Answer: "C" })}
                            className={
                              this.state.Answer.trim() === "C"
                                ? "active text-white"
                                : "text-white"
                            }
                          >
                            C
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => this.setState({ Answer: "D" })}
                            className={
                              this.state.Answer.trim() === "D"
                                ? "active text-white"
                                : "text-white"
                            }
                          >
                            D
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
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
                onClick={(e) => this.saveQuestion(e)}
              >
                Save
              </Button>
            </ModalFooter>
          </Modal>
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <Row>
            <Col md="6" xs="9">
              <FormGroup>
                <Input
                  defaultValue={this.state.title}
                  placeholder="Enter the name of your quiz"
                  bsSize="lg"
                  type="text"
                  className="rounded"
                  onChange={(e) => {
                    this.setState({ title: e.target.value });
                  }}
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6" xs="3">
              <Button
                className="btn-fill float-right"
                size="sm"
                color="primary"
                type="submit"
                onClick={() =>
                  this.isNotEmpty([
                    { field: "Title", val: this.state.title },
                    { field: "Questions", val: this.state.Question },
                  ])
                }
              >
                Save
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md="2" xs="9" className="ml-4 d-flex">
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
                  onClick={(e) => this.setState({ random: !this.state.random })}
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
            <Col md="9" xs="12" className="order-sm-1 order-2">
              <Card>
                <CardHeader>
                  <Row>
                    <Col className="d-flex">
                      <CardTitle tag="h2">Questions&nbsp;</CardTitle>

                      <UncontrolledDropdown size="sm" setActiveFromChild>
                        <DropdownToggle className="w-100 m-0" caret>
                          <FontAwesomeIcon
                            title={
                              this.state.Type === "Public"
                                ? "Public"
                                : "Private"
                            }
                            size="lg"
                            icon={
                              this.state.Type === "Public"
                                ? faGlobeAfrica
                                : faLock
                            }
                          />
                        </DropdownToggle>
                        <DropdownMenu className="bg-dark text-white">
                          <DropdownItem
                            onClick={() => this.setState({ Type: "Public" })}
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
                            onClick={() => this.setState({ Type: "Private" })}
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
                    <Col className="text-right">
                      <Button onClick={() => this.toggleModal()}>
                        <i className="tim-icons icon-simple-add"></i>
                      </Button>
                      <Button
                        onClick={() => {
                          this.componentDidMount();
                        }}
                      >
                        <CSVLink
                          data={this.state.Question}
                          filename={"Questions.csv"}
                        >
                          <i className="tim-icons icon-cloud-download-93 text-white"></i>
                        </CSVLink>
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th className="text-center">S.No.</th>
                        <th>Question</th>
                        <th className="text-center">Answer</th>
                      </tr>
                    </thead>
                    <tbody>{listItems}</tbody>
                  </Table>
                  <h6
                    className="text-uppercase text-muted ls-1 mb-1 py-3 text-center"
                    style={{ display: this.state.isEmpty ? "auto" : "none" }}
                  >
                    No entries found
                  </h6>
                </CardBody>
              </Card>
            </Col>
            <Col md="3" xs="12" className="order-1 mx-auto">
              <Row>
                <Col md="12">
                  <Card className="card-chart">
                    <CardHeader>
                      <CardTitle tag="h3">
                        <i className="tim-icons icon-cloud-upload-94 text-primary" />{" "}
                        Upload questions
                        <FontAwesomeIcon
                          title="Completed"
                          className="float-right"
                          size="sm"
                          icon={faInfoCircle}
                          onClick={() => this.toggleInfo(1)}
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Col md="12" xs="12">
                        <FormGroup>
                          <CSVReader
                            onDrop={this.changeFile}
                            onError={this.handleOnError}
                            config={{ header: true }}
                            addRemoveButton
                          >
                            <span>Drop .CSV file here or click to choose.</span>
                            <h4>Header Keys:</h4>
                            <ul>
                              <Row>
                                <Col>
                                  <li>Question</li>
                                  <li>Answer</li>
                                </Col>
                                <Col>
                                  <li>A</li>
                                  <li>B</li>
                                </Col>
                                <Col>
                                  <li>C</li>
                                  <li>D</li>
                                </Col>
                              </Row>
                            </ul>
                          </CSVReader>
                        </FormGroup>
                      </Col>
                    </CardBody>
                    <CardFooter>
                      <Button
                        className="btn-fill"
                        type="button"
                        onClick={() => this.processFile()}
                      >
                        Upload questions
                      </Button>
                    </CardFooter>
                  </Card>
                </Col>
                <Col md="12">
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h3">
                        <i className="tim-icons icon-chart-bar-32 text-primary" />{" "}
                        Marking
                        <FontAwesomeIcon
                          title="Completed"
                          className="float-right"
                          size="sm"
                          icon={faInfoCircle}
                          onClick={() => this.toggleInfo(2)}
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label>Positive marking:</label>
                            <Input
                              defaultValue={this.state.pscore}
                              placeholder="Positive marking"
                              type="number"
                              onkeypress="return event.charCode >= 48"
                              min="1"
                              onChange={(e) =>
                                this.setState({ pscore: e.target.value })
                              }
                              className="bg-transparent text-light rounded"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
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
                    </CardBody>
                  </Card>
                </Col>
                <Col md="12">
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h3">
                        <i className="tim-icons icon-watch-time text-primary" />{" "}
                        Timer
                        <FontAwesomeIcon
                          title="Completed"
                          className="float-right"
                          size="sm"
                          icon={faInfoCircle}
                          onClick={() => this.toggleInfo(3)}
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col md="12">
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
                          md="6"
                          className={
                            this.state.timerType === "None"
                              ? "d-none"
                              : "d-auto"
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
                          md="6"
                          className={
                            this.state.timerType === "None"
                              ? "d-none"
                              : "d-auto"
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
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default AddQuiz;
