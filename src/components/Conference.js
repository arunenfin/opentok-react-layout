import React, { Component } from 'react';

const initLayoutContainer = window.initLayoutContainer;
const OT = window.OT;
const options = {
  maxRatio: 3/2,          // The narrowest ratio that will be used (default 2x3)
  minRatio: 9/16,         // The widest ratio that will be used (default 16x9)
  fixedRatio: false,      // If this is true then the aspect ratio of the video is maintained and minRatio and maxRatio are ignored (default false)
  bigClass: "OT_big",     // The class to add to elements that should be sized bigger
  bigPercentage: 0.8,      // The maximum percentage of space the big ones should take up
  bigFixedRatio: false,   // fixedRatio for the big ones
  bigMaxRatio: 3/2,       // The narrowest ratio to use for the big elements (default 2x3)
  bigMinRatio: 9/16,      // The widest ratio to use for the big elements (default 16x9)
  bigFirst: true,         // Whether to place the big one in the top left (true) or bottom right
  animate: false           // Whether you want to animate the transitions
};

class Conference extends Component {
  layoutContainer = null;
  layout = null;
  session = null;
  resizeTimeout = null;

  handleError(error) {
    if (error) {
      console.log(error.message);
    }
  }
  
  initializeSession(apiKey, sessionId, token) {
    this.session = OT.initSession(apiKey, sessionId);
  
    // Create a publisher
    const publisher = OT.initPublisher('publisherContainer', {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }, this.handleError);
  
    // Connect to the session
    this.session.connect(token, (error) => {
      // If the connection is successful, publish to the session
      if (error) {
        this.handleError(error);
      } else {
        this.session.publish(publisher, this.handleError);
        this.layout();
      }
    });
  }

  handleStreamCreated = (event) => {
    this.session.subscribe(event.stream, "layoutContainer", {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }, this.handleError);
    this.layout();
  }

  handleStreamDestroyed = (event) => {
    setTimeout(this.layout, 100)
  }

  handleWindowResize = () => {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => { this.layout(); }, 20);
  }

  handleDblClick = (e) => {
    const layoutDivs = document.querySelectorAll(".ot-layout");
    const el = e.target.closest(".ot-layout");

    for (let i = 0; i < layoutDivs.length; i++) {
      layoutDivs[i].classList.remove('OT_big');
    }
    el.classList.add('OT_big');

    this.layout();
  }

  componentDidMount() {
    const apiKey = "46438512";
    const sessionId = "2_MX40NjQzODUxMn5-MTU3NDg2ODk4Mzg2Mn4wVndScjZMZ053ZVNEV1NaWUVRRnF1UFh-fg";
    const token = "T1==cGFydG5lcl9pZD00NjQzODUxMiZzaWc9NmViNjZmZjM0ZTY3YWUzMWU1MGFkMWIyMTQ2N2U0YjY3MDI4YjVlZTpzZXNzaW9uX2lkPTJfTVg0ME5qUXpPRFV4TW41LU1UVTNORGcyT0RrNE16ZzJNbjR3Vm5kU2NqWk1aMDUzWlZORVYxTmFXVVZSUm5GMVVGaC1mZyZjcmVhdGVfdGltZT0xNTc0ODY5MDQ0Jm5vbmNlPTAuNjI4MDI3NjMzMTM3MzY0NCZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTc3NDYxMDQzJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";

    this.layoutContainer = document.getElementById("layoutContainer");
    this.layout = initLayoutContainer(this.layoutContainer, options).layout;

    this.initializeSession(apiKey, sessionId, token);

    this.session.on('streamCreated', this.handleStreamCreated);
    this.session.on('streamDestroyed', this.handleStreamDestroyed);
    window.addEventListener('resize', this.handleWindowResize);
  }
  
  componentWillUnmount() {
    this.session.off('streamCreated', this.handleStreamCreated);
    this.session.off('streamDestroyed', this.handleStreamDestroyed);
    window.removeEventListener('resize', this.handleWindowResize);

    this.session.disconnect();
    this.layoutContainer = null;
    this.layout = null;
    this.session = null;
    this.resizeTimeout = null;
  }

  render() {
    return (
      <div id="layoutContainer" className="layout-container" onDoubleClick={this.handleDblClick}>
        <div id="publisherContainer" className="publisher-container"></div>
      </div>
    )
  }

}

export default Conference;