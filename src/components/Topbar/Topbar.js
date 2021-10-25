import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  Button,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCogs,
  faMedal,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

const Topbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar className="bg-transparent navbar-dark" expand="md">
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink to={"/admin/quiz-detail/" + props.id}>
                <Button
                  className={
                    props.isActive === 0 ? "mb-2" : "mb-2 btn-link text-white"
                  }
                >
                  <FontAwesomeIcon
                    title="Questions"
                    size="lg"
                    icon={faQuestionCircle}
                  />
                  &nbsp; Questions
                </Button>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to={"/admin/leaderboard/" + props.id}>
                <Button
                  className={
                    props.isActive === 1 ? "mb-2" : "mb-2 btn-link text-white"
                  }
                >
                  <FontAwesomeIcon
                    title="Questions"
                    size="lg"
                    icon={faMedal}
                  />
                  &nbsp; Leaderboard
                </Button>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to={"/admin/settings/" + props.id}>
                <Button
                  className={
                    props.isActive === 2 ? "mb-2" : "mb-2 btn-link text-white"
                  }
                >
                  <FontAwesomeIcon
                    title="Questions"
                    size="lg"
                    icon={faCogs}
                  />
                  &nbsp; Settings
                </Button>
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Topbar;
