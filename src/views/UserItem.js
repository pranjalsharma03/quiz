import React, { useState } from "react";
import firebase from "../variables/config";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Form,
  Button,
  Input,
  Row,
  Col,
} from "reactstrap";

const QuestionItem = (props) => {
  console.log(props.main);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const allow = async (e) => {
    var UserRef = await firebase
      .database()
      .ref()
      .child(
        "Quiz/" + props.id + "/Users/" + props.main.email.replaceAll(".", ")")
      );
    UserRef.update({
      Status: "Logged",
    });
    toggle()
    props.notify("tc", "User Allowed.", "success", "icon-check-2");
  };
  return (
    <>
      <Modal isOpen={modal} toggle={toggle} className="bg-transparent">
        <ModalHeader tag="h2" toggle={toggle}>
          User Details
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>Name:</label>
                  <Input
                    defaultValue={props.main.Name}
                    placeholder="Name"
                    type="text"
                    className="text-dark bg-transparent"
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label>Number:</label>
                  <Input
                    defaultValue={props.main.Number}
                    placeholder="Number"
                    type="number"
                    className="text-dark bg-transparent"
                    disabled
                  />
                </FormGroup>
              </Col>
            </Row>
            
            <Row>
              <Col md="12">
                <FormGroup>
                  <label>Email:</label>
                  <Input
                    defaultValue={props.main.email}
                    placeholder="Email"
                    type="text"
                    className="text-dark bg-transparent"
                    disabled
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>Status:</label>
                  <Input
                    defaultValue={props.main.Status}
                    placeholder="Status"
                    type="text"
                    className="text-dark bg-transparent"
                    disabled
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <label>Score:</label>
                  <Input
                    defaultValue={props.main.Score}
                    placeholder="Score"
                    type="text"
                    className="text-dark bg-transparent"
                    disabled
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <FormGroup>
                  <label>Logging Date:</label>
                  <Input
                    defaultValue={new Date(props.main.datentime)
                      .toString()
                      .slice(0, 15)}
                    placeholder="Date"
                    type="text"
                    className="text-dark bg-transparent"
                    disabled
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <label>Logging Time:</label>
                  <Input
                    defaultValue={new Date(props.main.datentime)
                      .toString()
                      .slice(15)}
                    placeholder="Time"
                    type="text"
                    className="text-dark bg-transparent"
                    disabled
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>
                    {props.main.Status === "Completed"
                      ? "Completion Date"
                      : "Disqualification Date"}
                    :
                  </label>
                  <Input
                    defaultValue={new Date(props.main.completed_datentime)
                      .toString()
                      .slice(0, 15)}
                    placeholder="Date"
                    type="text"
                    className="text-dark bg-transparent"
                    disabled
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <label>
                    {props.main.Status === "Completed"
                      ? "Completion Time"
                      : "Disqualification Time"}
                    :
                  </label>
                  <Input
                    defaultValue={new Date(props.main.completed_datentime)
                      .toString()
                      .slice(15)}
                    placeholder="Time"
                    type="text"
                    className="text-dark bg-transparent"
                    disabled
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-fill ml-auto"
            color="success"
            type="submit"
            onClick={(e) => allow(e)}
          >
            Reset
          </Button>
        </ModalFooter>
      </Modal>
      <tr>
        <td
          onClick={() => {
            setModal(!modal);
          }}
        >
          {props.main.email}
        </td>
        <td
          onClick={() => {
            setModal(!modal);
          }}
        >
          <p
            className={
              props.main.Status === "Completed"
                ? "text-success text-center"
                : props.main.Status === "Disqualified"
                ? "text-warning text-center"
                : "text-primary text-center"
            }
          >
            {props.main.Status}
          </p>
        </td>
        <td
          className="text-center"
          onClick={() => {
            setModal(!modal);
          }}
        >
          {props.main.Score}
        </td>
      </tr>
    </>
  );
};

export default QuestionItem;
