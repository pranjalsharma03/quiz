import React, { useState } from "react";
import firebase from "../variables/config";
import NotificationAlert from "react-notification-alert";
import ReactLoading from "react-loading";
import Topbar from "../components/Topbar/Topbar";
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
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ModalFooter,
  Row,
  Col,
  Button,
} from "reactstrap";

let data = [];
let tmp = {};
let id;
class QuizDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Question: [],
      Ques: "",
      Answer: "_",
      A: "",
      B: "",
      C: "",
      D: "",
      Status: "",
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
  async deleteQuestion(index) {
    if (this.state.Status === "Ongoing") {
      this.notify(
        "tc",
        "This action is not allowed.",
        "danger",
        "icon-simple-remove"
      );
    } else {
      data = this.state.Question;
      for (let j = index - 1; j < data.length - 1; j++) {
        data[j] = data[j + 1];
        data[j].index--;
      }
      data.pop();
      this.setState({ Question: data });
      await firebase
        .database()
        .ref("Quiz/" + id)
        .update({
          Questions: this.state.Question,
        });
      this.notify("tc", "Question deleted.", "danger", "icon-trash-simple");
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
      "https://quiz-c74b2-default-rtdb.firebaseio.com/Quiz/" + id + ".json"
    )
      .then((res) => res.json())
      .then((data) => (tmp = data));
    window.$tmp = tmp;
    // console.log(tmp);
    if (tmp.Questions.length > 0) {
      this.setState({
        title: tmp.Title,
        Type: tmp.Type,
        Question: tmp.Questions,
        Status: tmp.Status,
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
  changeFile(tmp) {
    for (let i = 0; i < tmp.length; i++) {
      tmp[i].data["index"] = i + 1;
      data.push(tmp[i].data);
    }
    // console.log(data);
  }
  async saveQuestion(e) {
    if (this.state.Status === "Ongoing") {
      this.notify(
        "tc",
        "This action is not allowed.",
        "danger",
        "icon-simple-remove"
      );
    } else {
      let length = this.state.Question.length;
      this.state.Question.push({
        Question: this.state.Ques,
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
      await firebase
        .database()
        .ref("Quiz/" + id)
        .update({
          Questions: this.state.Question,
        });
      this.notify("tc", "Question saved.", "success", "icon-check-2");
    }
  }
  async processFile() {
    var QuesRef = await firebase
      .database()
      .ref()
      .child("Quiz/" + id);
    QuesRef.update({
      Questions: data,
    });
    this.notify("tc", "Questions added.", "success", "icon-check-2");
    this.componentDidMount();
  }
  render() {
    let QuestionItem = (props) => {
      const [modal, setModal] = useState(false);
      const [Question, setQuestion] = useState(props.main.Question);
      const [Answer, setAnswer] = useState(props.main.Answer);
      const [A] = useState(props.main.A);
      const [B] = useState(props.main.B);
      const [C] = useState(props.main.C);
      const [D] = useState(props.main.D);
      const toggle = () => setModal(!modal);
      const saveQuestion = async (e) => {
        if (this.state.Status === "Ongoing") {
          props.notify(
            "tc",
            "This action is not allowed.",
            "danger",
            "icon-simple-remove"
          );
        } else {
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
        }
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
                {/* <Row>
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
                </Row> */}
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
          <Topbar id={id} isActive={0} />
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <Row>
            <Col md="9" xs="12" className="order-sm-1 order-2">
              <Card>
                <CardHeader>
                  <Row>
                    <Col className="d-flex">
                      <CardTitle tag="h2">Questions&nbsp;</CardTitle>
                    </Col>
                    <Col className="text-right">
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
                      <Button
                        onClick={() => {
                          this.componentDidMount();
                        }}
                      >
                        <i className="tim-icons icon-refresh-01"></i>
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
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Col md="12">
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
                        <i className="tim-icons icon-simple-add text-primary" />{" "}
                        Add question
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Form>
                        <Row>
                          <Col md="12">
                            <FormGroup>
                              <label>Question</label>
                              <Input
                                defaultValue={this.state.Ques}
                                placeholder="Question"
                                type="text"
                                onChange={(e) => {
                                  this.setState({ Ques: e.target.value });
                                }}
                              />
                            </FormGroup>
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
                                <DropdownToggle
                                  className="btn-fill w-100 m-0"
                                  caret
                                >
                                  {this.state.Answer}
                                </DropdownToggle>
                                <DropdownMenu className="bg-dark text-white">
                                  <DropdownItem
                                    onClick={() =>
                                      this.setState({ Answer: "A" })
                                    }
                                    className={
                                      this.state.Answer.trim() === "A"
                                        ? "active text-white"
                                        : "text-white"
                                    }
                                  >
                                    A
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() =>
                                      this.setState({ Answer: "B" })
                                    }
                                    className={
                                      this.state.Answer.trim() === "B"
                                        ? "active text-white"
                                        : "text-white"
                                    }
                                  >
                                    B
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() =>
                                      this.setState({ Answer: "C" })
                                    }
                                    className={
                                      this.state.Answer.trim() === "C"
                                        ? "active text-white"
                                        : "text-white"
                                    }
                                  >
                                    C
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() =>
                                      this.setState({ Answer: "D" })
                                    }
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
                    </CardBody>
                    <CardFooter className="text-right">
                      <Button
                        className="btn-fill"
                        color="primary"
                        type="submit"
                        onClick={(e) => this.saveQuestion(e)}
                      >
                        Save
                      </Button>
                    </CardFooter>
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

export default QuizDetail;
