import React from "react";
import firebase from "../variables/config";
import UserItem from "./UserItem.js";
import NotificationAlert from "react-notification-alert";
import ReactLoading from "react-loading";
import { Pie } from "react-chartjs-2";
import Topbar from "../components/Topbar/Topbar";
import { CSVLink } from "react-csv";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
} from "reactstrap";

let data = [];
let tmp = [];
let id;
const statusChartOptions = {
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  tooltips: {
    backgroundColor: "#f5f5f5",
    titleFontColor: "#333",
    bodyFontColor: "#666",
    bodySpacing: 4,
    xPadding: 12,
    mode: "nearest",
    intersect: 0,
    position: "nearest",
  },
  responsive: true,
  scales: {
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    ],
    xAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    ],
  },
};
class LeaderBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Users: [],
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
    data = this.state.Question;
    for (let j = index - 1; j < data.length - 1; j++) {
      data[j] = data[j + 1];
      data[j].index--;
    }
    this.setState({ Question: data });
    await firebase
      .database()
      .ref("Quiz/" + id + "/Users/" + index)
      .remove();
    await firebase
      .database()
      .ref("Quiz/" + id)
      .update({
        Users: this.state.Question,
      });
    this.notify("tc", "Question deleted.", "danger", "icon-trash-simple");
  }
  async setType(type) {
    this.setState({ Type: type });
    await firebase
      .database()
      .ref("Quiz/" + id)
      .update({
        Type: type,
      });
    this.notify("tc", "Quiz made " + type + ".", "success", "icon-check-2");
  }
  async componentDidMount() {
    tmp = [];
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
      "https://quizyaar-default-rtdb.firebaseio.com/Quiz/" + id + "/Users.json"
    )
      .then((res) => res.json())
      .then((data) => {
        for (let eachData in data) tmp.push(data[eachData]);
      });
    if (tmp.length > 0) {
      tmp = this.sort_by_key(tmp, "Score");

      let chartUserData = [0, 0, 0];
      for (let eachData in tmp) {
        if (tmp[eachData].Status === "Completed") chartUserData[1]++;
        else if (tmp[eachData].Status === "Disqualified") chartUserData[2]++;
        else chartUserData[0]++;
      }
      this.setState({
        Users: tmp,
        isEmpty: false,
        isLoading: false,
        chartStatus: (canvas) => {
          let ctx = canvas.getContext("2d");
          let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

          gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
          gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
          gradientStroke.addColorStop(0, "rgba(119,52,169,0)");

          return {
            labels: ["Logged", "Completed", "Disqualified"],
            datasets: [
              {
                label: "Total",
                fill: true,
                backgroundColor: gradientStroke,
                hoverBackgroundColor: ["#e14eca", "#00f2c3", "#ff8d72"],
                borderColor: ["#e14eca", "#00f2c3", "#ff8d72"],
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                data: chartUserData,
              },
            ],
          };
        },
      });
    } else {
      this.setState({
        isEmpty: true,
        isLoading: false,
      });
    }
  }
  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  render() {
    let listItems = this.state.Users.slice()
      .reverse()
      .map((user) => {
        return <UserItem main={user} id={id} notify={this.notify} />;
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
          <Topbar id={id} isActive={1} />
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <Row>
            <Col md="9" xs="12" className="order-sm-1 order-2">
              <Card>
                <CardHeader>
                  <Row>
                    <Col className="d-flex">
                      <CardTitle tag="h2">Users&nbsp;</CardTitle>
                    </Col>
                    <Col className="text-right">
                      <Button
                        onClick={() => {
                          this.componentDidMount();
                        }}
                      >
                        <CSVLink data={this.state.Users} filename={"Users.csv"}>
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
                        <th>Email</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Score</th>
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
            <Col md="3" xs="12" className="order-1">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle tag="h3">
                    <i className="tim-icons icon-chart-pie-36 text-primary" />{" "}
                    User Status
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Pie
                      data={this.state.chartStatus}
                      options={statusChartOptions}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default LeaderBoard;
