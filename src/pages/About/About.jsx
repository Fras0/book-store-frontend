import React from "react";
import "./About.css";
import aboutImg from "../../images/about.jpg";
import Navbar from "../../components/Navbar/Navbar";
const About = () => {
  return (
    <>
      <Navbar />
      <section className="page-section about">
        <div className="container">
          <div className="section-title">
            <h2>About</h2>
          </div>

          <div className="about-content grid">
            <div className="about-img">
              <img src={aboutImg} alt=""></img>
            </div>

            <div className="about-text">
              <h2 className="about-title fs-26 ls1">About Book Store</h2>
              <p className="fs-17">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Accusamus eligendi unde perspiciatis nesciunt, suscipit illo
                quae expedita repellendus sed obcaecati debitis. Sed labore
                voluptatem distinctio quidem ab amet totam tempore quae eum,
                excepturi, doloribus optio odio dolore officia ex hic, aperiam
                eos! Esse, velit aut?
              </p>
              <p className="fs-17">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Architecto facilis voluptate minus eius dolorem maiores ipsum
                adipisci inventore quaerat corporis, ab molestias error iusto
                voluptatibus eos fugiat est fugit minima?
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
