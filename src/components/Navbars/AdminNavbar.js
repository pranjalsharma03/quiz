import React from "react";
import { Redirect } from "react-router-dom";
// nodejs library that concatenates classes
import classNames from "classnames";
import firebase from "../../variables/config";
import { Link } from "react-router-dom";
import logo from "../../logo.png";

// reactstrap components
import {
  Button,
  Collapse,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
} from "reactstrap";

window.$tmp = {};
window.$notifications = [];
class AdminNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      collapseOpen: false,
      modalSearch: false,
      color: "navbar-transparent",
    };
  }
  componentDidMount() {
    var user = firebase.auth().currentUser;
    if (!user) {
      this.setState({ isLoggedIn: true });
    } else {
      this.setState({ isLoggedIn: false });
    }
    window.addEventListener("resize", this.updateColor);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColor);
  }
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  updateColor = () => {
    if (window.innerWidth < 993 && this.state.collapseOpen) {
      this.setState({
        color: "bg-dark",
      });
    } else {
      this.setState({
        color: "navbar-transparent",
      });
    }
  };
  // this function opens and closes the collapse on small devices
  toggleCollapse = () => {
    if (this.state.collapseOpen) {
      this.setState({
        color: "navbar-transparent",
      });
    } else {
      this.setState({
        color: "bg-dark",
      });
    }
    this.setState({
      collapseOpen: !this.state.collapseOpen,
    });
  };
  // this function is to open the Search modal
  toggleModalSearch = () => {
    this.setState({
      modalSearch: !this.state.modalSearch,
    });
  };
  render() {
    if (this.state.isLoggedIn) {
      return <Redirect push to="/auth/login" />;
    }
    return (
      <>
        <Navbar
          className={classNames("navbar-absolute", this.state.color)}
          expand="xs"
        >
          <Container fluid className="px-0">
            <div className="navbar-wrapper">
              <NavbarBrand
                className="position-relative"
                onClick={(e) => e.preventDefault()}
              >
                <Link to="/admin/quiz">
                  <img src={logo} width="50rem" alt="Quiz Yaar" />
                </Link>
              </NavbarBrand>
            </div>
            <Collapse navbar isOpen={this.state.collapseOpen}>
              <Nav className="ml-auto" navbar>
                <NavLink
                  tag="li"
                  className="nav-item text-white px-0"
                  onClick={() => {
                    firebase.auth().signOut();
                    this.setState({ isLoggedIn: true });
                  }}
                >
                  <Button size="sm" className="btn-primary">
                    <i class="tim-icons icon-user-run"></i>&nbsp;Logout
                  </Button>
                </NavLink>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default AdminNavbar;
