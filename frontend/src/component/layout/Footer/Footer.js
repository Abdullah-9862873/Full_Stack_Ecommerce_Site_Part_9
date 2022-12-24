import React from "react";
import "./Footer.css";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phones</p>
        <img src={playStore} alt="playStore" />
        <img src={appStore} alt="AppStore" />
      </div>
      <div className="midFooter">
        <h1>ECOMMERCE</h1>
        <p>High Quality is out first priority</p>

        <p>Copyrights 2021 &copy; Abdullah</p>
      </div>
      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://www.instagram.com/ab__02_/">Instagram</a>
        <a href="https://www.instagram.com/ab__02_/">Youtube</a>
        <a href="https://www.instagram.com/ab__02_/">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;
