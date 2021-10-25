import React from "react";
import { Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHome,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
// nodejs library that concatenates classes
import classNames from "classnames";
import { Link, NavLink } from "react-router-dom";
import logo from "../../logo.png";

// reactstrap components
import {
  Collapse,
  NavbarBrand,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  Container,
} from "reactstrap";

window.$tmp = {};
window.$notifications = [];
class AuthNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      collapseOpen: false,
      modalSearch: false,
      color: "navbar-transparent",
    };
  }
  toggle() {
    this.setState({
      collapseOpen: !this.state.collapseOpen,
    });
  }
  render() {
    if (this.state.isLoggedIn) {
      return <Redirect push to="/auth/login" />;
    }
    return (
      <>
        <Navbar
          className={classNames(
            "navbar-absolute navbar-dark",
            this.state.color
          )}
          expand="md"
        >
          <Container fluid className="px-0">
            <div className="navbar-wrapper">
              <NavbarBrand
                className="position-relative"
                onClick={(e) => e.preventDefault()}
              >
                <Link to="/auth/home">
                  <img src={logo} width="50rem" alt="Quiz Yaar" />
                </Link>
              </NavbarBrand>
            </div>
            <NavbarToggler onClick={() => this.toggle()} />
            <Collapse
              className={this.state.collapseOpen ? "bg-dark rounded" : ""}
              navbar
              isOpen={this.state.collapseOpen}
            >
              <Nav className="ml-auto" navbar>
                <NavItem className="mx-3 my-2">
                  <NavLink
                    tag="li"
                    className={
                      window.location.pathname.slice(
                        window.location.pathname.length - 4
                      ) === "home"
                        ? "nav-item px-0 btn-link text-primary"
                        : "nav-item px-0 btn-link"
                    }
                    to="/auth/home"
                  >
                    <FontAwesomeIcon title="Home" size="lg" icon={faHome} />
                    &nbsp;Home
                  </NavLink>
                </NavItem>
                <NavItem className="mx-3 my-2 btn-link">
                  <NavLink
                    tag="li"
                    className={
                      window.location.pathname.slice(
                        window.location.pathname.length - 7
                      ) === "contact"
                        ? "nav-item px-0 btn-link text-primary"
                        : "nav-item px-0 btn-link"
                    }
                    to="/auth/contact"
                  >
                    <FontAwesomeIcon
                      title="Contact"
                      size="lg"
                      icon={faPaperPlane}
                    />
                    &nbsp;Contact
                  </NavLink>
                </NavItem>
                <NavItem className="mx-3 my-2">
                  <NavLink
                    tag="li"
                    className={
                      window.location.pathname.slice(
                        window.location.pathname.length - 5
                      ) === "login"
                        ? "nav-item px-0 btn-link text-primary"
                        : "nav-item px-0 btn-link"
                    }
                    to="/auth/login"
                  >
                    <FontAwesomeIcon title="Login" size="lg" icon={faUser} />
                    &nbsp;Login
                  </NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default AuthNavbar;
