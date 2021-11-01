/*eslint-disable*/
import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";

// reactstrap components
import { Container, Row, Nav, NavItem, NavLink } from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Container fluid>
          <div className="copyright">
            © {new Date().getFullYear()} made with{" "}
            <i className="tim-icons icon-heart-2" /> by{" "}
            <a
              href="https://www.linkedin.com/in/pranjal-sharma-79aa4019b/"
              target="_blank"
            >
              Pranjal&sagar
            </a>
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;
