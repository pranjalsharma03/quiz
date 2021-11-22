import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import firebase from "../variables/config";
import { Link } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import {
  faShareAlt,
  faGlobeAfrica,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import {
  EmailShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import ReactLoading from "react-loading";
// reactstrap components
import {
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Row,
  Col,
  Button,
} from "reactstrap";
window.$QuizNumber = 0;
window.$tmp = {};
window.$notification = [];
class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Quiz: [],
      Active: "",
      userEmail: "",
      isEmpty: true,
      isLoading: true,
      modal: false,
    };
  }
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
    if (firebase.auth().currentUser) {
      await fetch("https://quiz-c74b2-default-rtdb.firebaseio.com/Quiz.json")
        .then((res) => res.json())
        .then((data) => {
          for (let eachData in data) {
            if (
              data[eachData].Invigilator === firebase.auth().currentUser.email
            )
              Quiz.push(data[eachData]);
          }
        });
      if (Quiz === null || Quiz.length === 0) {
        this.setState({
          isEmpty: true,
          isLoading: false,
          userEmail: firebase.auth().currentUser.email,
        });
      } else if (Quiz.length > 0) {
        this.setState({
          Quiz: Quiz,
          isEmpty: false,
          isLoading: false,
          userEmail: firebase.auth().currentUser.email,
        });
      }
    }
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
  render() {
    let listItems = this.state.Quiz.map((user) => {
      return (
        <Col md="3" className="mb-4">
          <Card className="mb-0">
            <Link to={`/admin/quiz-detail/${user.index}`}>
              <CardHeader>
                <CardTitle tag="h4">
                  {user.Title}{" "}
                  <Link to="/admin/quiz">
                    <i
                      onClick={() => {
                        firebase
                          .database()
                          .ref("Quiz/" + user.index)
                          .remove();
                        this.notify(
                          "tc",
                          "Quiz deleted.",
                          "danger",
                          "icon-trash-simple"
                        );
                      }}
                      className="tim-icons icon-simple-remove font-weight-bold text-warning float-right"
                    ></i>
                  </Link>
                </CardTitle>
                <p
                  className={
                    user.Status === "Completed"
                      ? "category mt-3 text-primary"
                      : user.Status === "Upcoming"
                      ? "category mt-3 text-warning"
                      : "category mt-3 text-success"
                  }
                >
                  {user.Status}
                </p>
              </CardHeader>
            </Link>
            <CardFooter className="text-right">
              <FontAwesomeIcon
                className="mr-2"
                onClick={() => {
                  this.setState({ Active: user.index });
                  this.toggle();
                }}
                title="Copy quiz link"
                size="lg"
                icon={faShareAlt}
              />
              <FontAwesomeIcon
                title={user.Type === "Public" ? "Public" : "Private"}
                size="lg"
                icon={user.Type === "Public" ? faGlobeAfrica : faLock}
              />
            </CardFooter>
          </Card>
        </Col>
      );
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
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <Modal
            isOpen={this.state.modal}
            toggle={() => this.toggle()}
            className="bg-transparent"
          >
            <ModalHeader tag="h2" toggle={() => this.toggle()}>
              Share
            </ModalHeader>
            <ModalBody>
              <Row className="w-100">
                <Col md="10">
                  <Input
                    value={
                      "https://quiz-yaar.vercel.app/auth/proctor/" +
                      this.state.Active
                    }
                    placeholder="Link"
                    type="url"
                    className="bg-transparent text-light rounded"
                  />
                </Col>
                <Col md="2">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => {
                      this.notify(
                        "tc",
                        "Link copied.",
                        "success",
                        "icon-check-2"
                      );
                      navigator.clipboard.writeText(
                        "https://quiz-yaar.vercel.app/auth/proctor/" +
                          this.state.Active
                      );
                    }}
                  >
                    Copy
                  </Button>
                </Col>
              </Row>
              <Row className="mt-4">
                <EmailShareButton
                  className="mx-auto"
                  subject="Code Jobma"
                  body={
                    "You have been invited by " +
                    this.state.userEmail +
                    " to praticipate a quiz. You can participate using the link:"
                  }
                  separator=" "
                  url={
                    "https://quiz-yaar.vercel.app/auth/proctor/" +
                    this.state.Active
                  }
                >
                  <EmailIcon size={32} round={true} />
                </EmailShareButton>
                <LinkedinShareButton
                  source="Code Jobma"
                  className="mx-auto"
                  url={
                    "https://quiz-yaar.vercel.app/auth/proctor/" +
                    this.state.Active
                  }
                >
                  <LinkedinIcon size={32} round={true} />
                </LinkedinShareButton>
                <TelegramShareButton
                  className="mx-auto"
                  title="Code Jobma"
                  url={
                    "https://quiz-yaar.vercel.app/auth/proctor/" +
                    this.state.Active
                  }
                >
                  <TelegramIcon size={32} round={true} />
                </TelegramShareButton>
                <TwitterShareButton
                  title="Code Jobma"
                  hashtags={["quizyaar", "quiz"]}
                  className="mx-auto"
                  url={
                    "https://quiz-yaar.vercel.app/auth/proctor/" +
                    this.state.Active
                  }
                >
                  <TwitterIcon size={32} round={true} />
                </TwitterShareButton>
                <WhatsappShareButton
                  title="Code Jobma"
                  separator=" "
                  className="mx-auto"
                  url={
                    "https://quiz-yaar.vercel.app/auth/proctor/" +
                    this.state.Active
                  }
                >
                  <WhatsappIcon size={32} round={true} />
                </WhatsappShareButton>
              </Row>
            </ModalBody>
          </Modal>
          <Row>
            <Col md="12">
              <Card className="card-plain">
                <CardHeader>
                  <Row>
                    <Col>
                      <CardTitle tag="h2">Your Quizzes</CardTitle>
                    </Col>
                    <Col className="text-right">
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
                  <h6
                    className="text-uppercase text-muted ls-1 mb-1 py-3 text-center"
                    style={{ display: this.state.isEmpty ? "auto" : "none" }}
                  >
                    No Quizzes found
                  </h6>
                  <Row>
                    {listItems}
                    <Col md="3" className="d-flex align-items-center mb-4">
                      <Link to="/admin/add-quiz">
                        <Button className="btn-primary mx-auto">
                          <h5
                            tag="h3"
                            className="m-auto text-dark text-weight-bold"
                          >
                            + Add Quiz
                          </h5>
                        </Button>
                      </Link>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Quiz;
