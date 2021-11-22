import React from "react";
import firebase from "../variables/config";
import NotificationAlert from "react-notification-alert";
import ReactLoading from "react-loading";
import emailjs from "emailjs-com";
import passwordGenerator from "generate-otp";
// reactstrap components
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Form,
  FormGroup,
  Input,
  Row,
  Col,
  Button,
} from "reactstrap";

import { Redirect } from "react-router-dom";
import Fullscreen from "react-fullscreen-crossbrowser";
let tmp = {};
let warn = 3;
let id;
let answers = [];
let timer = 0;
class Proctor extends React.Component {
  constructor() {
    super();
    this.state = {
      otp: "",
      desans: "",
      userOtp: "",
      otpTimer: 60,
      getOtp: false,
      Score: 0,
      rotate: true,
      screenFull: false,
      disabled: true,
      timerType: "None",
      users: [],
      answer: false,
      invigilator: "",
      optionSelected: "",
      questions: [{ Question: "", A: "", B: "", C: "", D: "" }],
      positiveMarking: 1,
      neagtiveMarking: 0,
      activeQuestion: 1,
      getEmail: true,
      userEmail: "",
      userName: "",
      userNum: "",
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
  async componentDidMount() {
    warn = 3;
    answers = [];
    id = this.props.match.params.id;
    await fetch(
      "https://quiz-c74b2-default-rtdb.firebaseio.com/Quiz/" + id + ".json"
    )
      .then((res) => res.json())
      .then((data) => (tmp = data));
    //Initializing answers
    for (let eachData in tmp.Questions) {
      answers.push({
        Answer: tmp.Questions[eachData].Answer,
        givenAnswer: "S",
      });
    }
    //Randomize
    if (tmp.random)
      for (var i = tmp.Questions.length - 1; i > 0 && tmp.random; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = tmp.Questions[i];
        tmp.Questions[i] = tmp.Questions[j];
        tmp.Questions[j] = temp;
      }
    if (tmp.Questions.length > 0) {
      timer = tmp.timer;
      this.setState({
        title: tmp.Title,
        Type: tmp.Type,
        timerType: tmp.timerType,
        timer: tmp.timer,
        users: tmp.Users,
        invigilator: tmp.Invigilator,
        questions: tmp.Questions,
        positiveMarking: tmp.pscore,
        neagtiveMarking: tmp.nscore,
        isEmpty: false,
        isLoading: false,
      });
    } else {
      this.setState({
        isEmpty: true,
        isLoading: false,
      });
    }
    this.timer();
  }
  answer(e) {
    this.setState({ optionSelected: e.target.value, disabled: false });
    answers[
      this.state.questions[this.state.activeQuestion - 1].index - 1
    ].givenAnswer = e.target.value;
  }
  nextQuestion() {
    if (this.state.timerType === "Quiz") {
      if (this.state.activeQuestion >= this.state.questions.length)
        this.setState({
          activeQuestion: 1,
          optionSelected: "",
        });
      else
        this.setState({
          activeQuestion: parseInt(this.state.activeQuestion) + 1,
        });
      document.getElementById("quiz-form").reset();
    } else {
      if (this.state.activeQuestion >= this.state.questions.length) {
        if (this.state.timerType === "Question") this.submitQuiz();
        else
          this.setState({
            activeQuestion: 1,
            optionSelected: "",
            timer: timer,
          });
      } else
        this.setState({
          activeQuestion: parseInt(this.state.activeQuestion) + 1,
          timer: timer,
        });
      document.getElementById("quiz-form").reset();
    }
  }
  prevQuestion() {
    if (this.state.timerType === "Quiz") {
      if (this.state.activeQuestion === 1)
        this.setState({
          activeQuestion: this.state.questions.length,
          optionSelected: "",
        });
      else
        this.setState({
          activeQuestion: parseInt(this.state.activeQuestion) - 1,
        });
      document.getElementById("quiz-form").reset();
    } else {
      if (this.state.activeQuestion === 1)
        this.setState({
          activeQuestion: this.state.questions.length,
          optionSelected: "",
          timer: timer,
        });
      else
        this.setState({
          activeQuestion: parseInt(this.state.activeQuestion) - 1,
          timer: timer,
        });
      document.getElementById("quiz-form").reset();
    }
  }
  sendEmail() {
    if (this.state.userEmail.length === 0) {
      this.notify("tc", "Email required.", "danger", "icon-simple-remove");
    } else {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(String(this.state.userEmail).toLowerCase())) {
        let otp = passwordGenerator.generate(6);
        emailjs
          .send(
            "service_wzyprt5",
            "template_g7z6mid",
            { email: this.state.userEmail, otp: otp },
            "user_LfD1MmORm43Y9XWG1kfNs"
          )
          .then(
            (result) => {
              // console.log(result.text);
              this.setState({ otpTimer: 60, getOtp: true, otp: otp });
              this.otpTimer();
              this.notify("tc", "OTP sent!", "success", "icon-check-2");
            },
            (error) => {
              // console.log(error.text);
            }
          );
      } else {
        this.notify(
          "tc",
          "Enter a valid email.",
          "danger",
          "icon-simple-remove"
        );
      }
    }
  }

  async handleUser(e) {
    if (this.state.otp === this.state.userOtp.trim()) {
      if (
        typeof this.state.users === "undefined" ||
        !this.state.users.hasOwnProperty(
          this.state.userEmail.replaceAll(".", ")")
        ) ||
        this.state.users[this.state.userEmail.replaceAll(".", ")")].Status ===
        "Logged"
      ) {
        await firebase
          .database()
          .ref("Quiz/" + id + "/Users/")
          .child(this.state.userEmail.replaceAll(".", ")"))
          .update({
            Name: this.state.userName,
            Number: this.state.userNum,
            Status: "Logged",
            email: this.state.userEmail,
            Score: this.state.Score,
            datentime: Date.now(),
          });
        this.setState({ getEmail: false, screenFull: true });
      } else {
        this.setState({ redirect: true });
      }
    } else {
      this.notify("tc", "Invalid OTP", "danger", "icon-simple-remove");
    }
  }
  async submitQuiz() {
    for (let eachData in answers) {
      if (answers[eachData].givenAnswer === answers[eachData].Answer)
        this.state.Score += this.state.positiveMarking;
      else if (answers[eachData].givenAnswer === "S") {
      } else this.state.Score -= this.state.neagtiveMarking;
    }
    await firebase
      .database()
      .ref("Quiz/" + id + "/Users/")
      .child(this.state.userEmail.replaceAll(".", ")"))
      .update({
        Name: this.state.userName,
        Number: this.state.userNum,
        Score: this.state.Score,
        Status: "Completed",
        Answers: answers,
        completed_datentime: Date.now(),
      });
    this.setState({ redirect: true });
  }
  async disqualify() {
    await firebase
      .database()
      .ref("Quiz/" + id + "/Users/")
      .child(this.state.userEmail.replaceAll(".", ")"))
      .update({
        Name: this.state.userName,
        Number: this.state.userNum,
        Score: this.state.Score,
        Status: "Disqualified",
        Answers: answers,
        completed_datentime: Date.now(),
      });
  }
  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h === 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " minute " : " minutes ") : "";
    var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
    return (hDisplay + mDisplay + sDisplay).trim();
  }
  timer() {
    if (this.state.timerType !== "None") {
      let c = setInterval(() => {
        if (!this.state.getEmail) {
          if (this.state.timer === 0) {
            if (this.state.timerType === "Question") {
              clearInterval(c);
              this.nextQuestion();
              this.setState({ timer: timer });
              this.timer();
            } else {
              this.submitQuiz();
            }
          } else {
            this.setState({
              timer: this.state.timer - 1,
            });
          }
        }
      }, 1000);
    }
  }

  otpTimer() {
    let c = setInterval(() => {
      if (this.state.otpTimer === 0) {
        clearInterval(c);
      } else {
        this.setState({
          otpTimer: this.state.otpTimer - 1,
        });
      }
    }, 1000);
  }
  render() {
    let indexList = this.state.questions.map((ques, index) => {
      return (
        <Button
          onClick={() => {
            if (this.state.timerType === "None") {
              this.setState({
                activeQuestion: index + 1,
                optionSelected: "",
                timer: timer,
              });
              document.getElementById("quiz-form").reset();
            } else if (this.state.timerType === "Quiz") {
              this.setState({
                activeQuestion: index + 1,
                optionSelected: "",
              });
              document.getElementById("quiz-form").reset();
            } else if (this.state.timerType === "Question") {
              this.notify(
                "tc",
                "This action is not allowed.",
                "danger",
                "icon-simple-remove"
              );
            }
          }}
          className={
            parseInt(index + 1) === parseInt(this.state.activeQuestion)
              ? "text-center p-2 btn-primary"
              : "text-center p-2"
          }
          style={{ minWidth: "2rem" }}
          disabled={this.state.getEmail}
        >
          {index + 1}
        </Button>
      );
    });
    window.addEventListener("blur", () => {
      this.setState({ rotate: false });
    });
    window.addEventListener("focus", () => {
      this.setState({ rotate: true });
    });
    const { redirect } = this.state;
    if (redirect) {
      return (
        <Redirect
          push
          to={
            "/auth/completed/" +
            id +
            "/" +
            this.state.userEmail.replaceAll(".", ")")
          }
        />
      );
    }
    if (
      this.state.screenFull &&
      this.state.rotate &&
      document.visibilityState === "visible"
    ) {
      // console.log("Full");
    } else {
      if (!this.state.getEmail) {
        warn -= 1;
        this.setState({ screenFull: true });
        this.notify(
          "tc",
          "This action is not allowed. Warnings left:" + warn,
          "danger",
          "icon-simple-remove"
        );
      }
      if (!this.state.getEmail && warn <= 0) {
        this.disqualify();
        return (
          <Redirect
            push
            to={
              "/auth/completed/" +
              id +
              "/" +
              this.state.userEmail.replaceAll(".", ")")
            }
          />
        );
      }
    }
    return (
      <>
        {/* Page content */}
        <Fullscreen
          className="bg-main"
          enabled={this.state.screenFull}
          onChange={(screenFull) => this.setState({ screenFull })}
        >
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
              this.state.isLoading ? "m-5 pt-5 d-none" : "m-5 pt-5 d-auto"
            }
          >
            <div className="react-notification-alert-container">
              <NotificationAlert ref="notificationAlert" />
            </div>
            <Row>
              <Col lg="3" md="3" xs="12">
                <Card>
                  <CardHeader>
                    <Row>
                      <Col>
                        <CardTitle tag="h2">Progress</CardTitle>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>&nbsp;{indexList}</CardBody>
                  <CardFooter className="text-right">
                    <Button
                      onClick={() => {
                        this.submitQuiz();
                      }}
                      className="btn-primary border-success text-white"
                      disabled={this.state.getEmail}
                    >
                      Submit
                    </Button>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg="9" md="9" xs="12">
                <Card>
                  <CardHeader>
                    <Row>
                      <Col>
                        <CardTitle tag="h2">{this.state.title}</CardTitle>
                      </Col>
                      <Col>
                        <CardTitle
                          className={
                            this.state.getEmail ||
                              this.state.timerType === "None"
                              ? "text-right d-none"
                              : "text-right"
                          }
                          tag="h2"
                        >
                          {this.state.timer}s
                        </CardTitle>
                      </Col>
                    </Row>
                  </CardHeader>
                  <div className={this.state.getEmail ? "d-auto" : "d-none"}>
                    <CardBody>
                      <FormGroup>
                        <Row className="mb-3">
                          <Col md="6">
                            <Input
                              defaultValue=""
                              placeholder="Enter your name here"
                              bsSize="lg"
                              type="text"
                              className={
                                this.state.getOtp ? "d-none" : "rounded"
                              }
                              onChange={(e) => {
                                this.setState({
                                  userName: e.target.value.trim(),
                                });
                              }}
                              required
                            />
                          </Col>

                          <Col md="6">
                            <Input
                              defaultValue=""
                              placeholder="Enter your mobile no. here"
                              bsSize="lg"
                              type="number"
                              className={
                                this.state.getOtp ? "d-none" : "rounded"
                              }
                              onChange={(e) => {
                                this.setState({
                                  userNum: e.target.value.trim(),
                                });
                              }}
                              required
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col md="12">
                            <Input
                              defaultValue=""
                              placeholder="Enter your email here"
                              bsSize="lg"
                              type="text"
                              className={
                                this.state.getOtp ? "d-none" : "rounded"
                              }
                              onChange={(e) => {
                                this.setState({
                                  userEmail: e.target.value.trim(),
                                });
                              }}
                              required
                            />
                          </Col>
                        </Row>
                        <Input
                          defaultValue=""
                          placeholder="Enter your OTP here"
                          bsSize="lg"
                          type="text"
                          className={this.state.getOtp ? "rounded" : "d-none"}
                          onChange={(e) => {
                            this.setState({ userOtp: e.target.value });
                          }}
                          required
                        />
                      </FormGroup>
                      <div className={this.state.getOtp ? "d-flex" : "d-none"}>
                        <p
                          className={
                            this.state.otpTimer > 0 ? "mr-3 my-auto" : "d-none"
                          }
                        >
                          {this.state.otpTimer}s
                        </p>
                        <Button
                          onClick={() => {
                            this.sendEmail();
                          }}
                          size="sm"
                          disabled={this.state.otpTimer > 0}
                          className="btn-primary text-white"
                        >
                          Resend
                        </Button>
                      </div>
                    </CardBody>
                    <CardFooter
                      className={this.state.getOtp ? "d-none" : "text-right"}
                    >
                      <Button
                        onClick={(e) => {
                          this.sendEmail(e);
                        }}
                        className="btn-primary text-white"
                      >
                        Verify
                      </Button>
                    </CardFooter>
                    <CardFooter
                      className={this.state.getOtp ? "text-right" : "d-none"}
                    >
                      <Button
                        onClick={(e) => {
                          this.handleUser(e);
                        }}
                        className="btn-success text-white"
                      >
                        Start
                      </Button>
                    </CardFooter>
                  </div>
                  <div className={this.state.getEmail ? "d-none" : "d-auto"}>
                    <CardBody>
                      <h3>
                        {
                          this.state.questions[this.state.activeQuestion - 1]
                            .Question
                        }
                      </h3>
                      <Form className="mx-5" id="quiz-form">
                        <FormGroup className={this.state.questions[this.state.activeQuestion - 1]
                          .Questype ? "" : "d-none"}>

                          <Input
                            cols="80"
                            required
                            rows="4"
                            type="textarea"
                            placeholder="Enter your answer here..."
                            placeholderTextColor="#000"
                            autoCapitalize="none"
                            onChange={(e) => {
                              this.answer(e);
                            }}
                          />
                        </FormGroup>
                        <FormGroup className={this.state.questions[this.state.activeQuestion - 1]
                          .Questype ? "d-none" : ""} >
                          <Input
                            type="radio"
                            onChange={(e) => {
                              this.answer(e);
                            }}
                            id="A"
                            name="Answer"
                            value="A"
                          />
                          <label for="A">
                            <h4>
                              {
                                this.state.questions[
                                  this.state.activeQuestion - 1
                                ].A
                              }
                            </h4>
                          </label>
                        </FormGroup>
                        <FormGroup>
                          <Input
                            type="radio"
                            onChange={(e) => {
                              this.answer(e);
                            }}
                            id="B"
                            name="Answer"
                            value="B"
                          />
                          <label for="B">
                            <h4>
                              {
                                this.state.questions[
                                  this.state.activeQuestion - 1
                                ].B
                              }
                            </h4>
                          </label>
                        </FormGroup>
                        <FormGroup>
                          <Input
                            type="radio"
                            onChange={(e) => {
                              this.answer(e);
                            }}
                            id="C"
                            name="Answer"
                            value="C"
                          />
                          <label for="C">
                            <h4>
                              {
                                this.state.questions[
                                  this.state.activeQuestion - 1
                                ].C
                              }
                            </h4>
                          </label>
                        </FormGroup>
                        <FormGroup>
                          <Input
                            type="radio"
                            onChange={(e) => {
                              this.answer(e);
                            }}
                            id="D"
                            name="Answer"
                            value="D"
                          />
                          <label for="D">
                            <h4>
                              {
                                this.state.questions[
                                  this.state.activeQuestion - 1
                                ].D
                              }
                            </h4>
                          </label>
                        </FormGroup>
                      </Form>
                    </CardBody>
                    <CardFooter className="text-right">
                      <Button
                        onClick={() => {
                          this.prevQuestion();
                        }}
                        className={
                          this.state.timerType === "Question"
                            ? "d-none"
                            : "btn-primary border-success text-white"
                        }
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => {
                          this.nextQuestion();
                        }}
                        className="btn-success border-success text-white"
                      >
                        Next
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
                <Card className={this.state.getEmail ? "d-auto" : "d-none"}>
                  <CardHeader>
                    <Row>
                      <Col>
                        <CardTitle tag="h2">Instructions</CardTitle>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <ul className="text-light h4">
                      <li>
                        <span className="text-warning">
                          Do not try to close full screen, minimize the browser,
                          don’t use keyboard shortcuts, don’t press back button
                          or reload button
                        </span>{" "}
                        as it will lead to immediate{" "}
                        <span className="text-warning">disqualification!</span>
                      </li>
                      <li>
                        Total number of questions will be{" "}
                        <span className="text-success">
                          {this.state.questions.length}
                        </span>
                        .
                      </li>
                      <li
                        className={
                          this.state.timerType === "Quiz" ? "d-auto" : "d-none"
                        }
                      >
                        The quiz will be of{" "}
                        <span className="text-warning">
                          {this.secondsToHms(this.state.timer)}
                        </span>
                        .
                      </li>
                      <li
                        className={
                          this.state.timerType === "Question"
                            ? "d-auto"
                            : "d-none"
                        }
                      >
                        Time allotted per question is{" "}
                        <span className="text-success">
                          {this.secondsToHms(this.state.timer)}
                        </span>{" "}
                        a total of{" "}
                        <span className="text-success">
                          {this.secondsToHms(
                            this.state.timer * this.state.questions.length
                          )}
                        </span>
                        .
                      </li>
                      <li>
                        For every correct answer you will be rewarded{" "}
                        <span className="text-success">
                          {this.state.positiveMarking} points
                        </span>
                        .
                      </li>
                      <li
                        className={
                          this.state.neagtiveMarking === 0 ? "d-none" : "d-auto"
                        }
                      >
                        For every incorrect answer{" "}
                        <span className="text-warning">
                          -{this.state.neagtiveMarking} points
                        </span>
                        .
                      </li>
                      <li>
                        In case of any issue / problem,{" "}
                        <span className="text-success">
                          contact the invigilator<br></br>
                        </span>
                        via chatbot or email:{" "}
                        <span className="text-success">
                          {this.state.invigilator}
                        </span>
                        .
                      </li>
                    </ul>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Fullscreen>
      </>
    );
  }
}
export default Proctor;