import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./Landing.css";
import Logo from "../../assets/images/landingPage/logo.svg";
import LogoDark from "../../assets/images/landingPage/logoDark.svg";
import Arrow from "../../assets/images/landingPage/arrowUp.svg";

import SettingIcon from "../../assets/images/landingPage/settings.svg";
import CloudIcon from "../../assets/images/landingPage/cloud.svg";
import CallCenterIcon from "../../assets/images/landingPage/callcenter.svg";
import PersonIcon from "../../assets/images/landingPage/person.svg";

import FadeInSection from "./FadeInSection";
import AnimatedCounter from "./AnimatedCounter";
import ParallaxLayer from "./ParallaxLayer";
import SectionReveal, { RevealItem } from "./SectionReveal";
import LiquidEther from "./LiquidEther";
import BorderGlow from "./BorderGlow";

function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrollEvent, setIsScrollEvent] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const animLogoRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const SCROLLED_BG_THRESHOLD = 200;
    const STICKY_THRESHOLD = 20;

    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const aTag = document.querySelectorAll(".nav-link");

      if (y > SCROLLED_BG_THRESHOLD) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");

      if (y > SCROLLED_BG_THRESHOLD)
        aTag.forEach((el) => el.classList.add("text-dark"));
      else aTag.forEach((el) => el.classList.remove("text-dark"));

      if (y > SCROLLED_BG_THRESHOLD) setIsScrollEvent(true);
      else setIsScrollEvent(false);

      if (y > STICKY_THRESHOLD) header.classList.add("is-fixed");
      else header.classList.remove("is-fixed");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    let minShowTimer: number | undefined;

    const ensure2sVisible = new Promise<void>((resolve) => {
      minShowTimer = window.setTimeout(() => resolve(), 2000);
    });

    const onWindowLoad = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    Promise.all([onWindowLoad, ensure2sVisible]).then(() => {
      requestAnimationFrame(() => {
        runLogoZoomOut();
      });
    });

    function runLogoZoomOut() {
      const overlay = overlayRef.current;
      const animLogo = animLogoRef.current;
      const headerBrandImg = document.querySelector(
        ".site-header .navbar-brand img.brand-logo"
      ) as HTMLImageElement | null;

      if (!overlay || !animLogo) {
        setIsLoaded(true);
        return;
      }

      if (headerBrandImg) headerBrandImg.style.opacity = "0";

      animLogo.classList.add("loader-logo--zoom");

      const onAnimEnd = () => {
        animLogo.removeEventListener("animationend", onAnimEnd);
        if (headerBrandImg) headerBrandImg.style.opacity = "1";
        setIsFading(true);
        setTimeout(() => {
          setIsLoaded(true);
        }, 260);
      };

      animLogo.addEventListener("animationend", onAnimEnd);
    }

    return () => {
      if (minShowTimer) clearTimeout(minShowTimer);
    };
  }, []);

  return (
    <div className="container-fluid p-0">
      {!isLoaded && (
        <div
          ref={overlayRef}
          className={`loader-overlay${isFading ? " fading" : ""}`}
        >
          <img
            ref={animLogoRef}
            src={LogoDark}
            alt="Brand"
            className="loader-logo"
          />
        </div>
      )}

      <header className="site-header position-absolute top-0 start-0 w-100">
        <nav className="navbar navbar-expand-lg navbar-dark transparent-nav py-3">
          <div className="container-fluid px-3 px-lg-4">
            <a className="navbar-brand d-flex align-items-center gap-2" href="/">
              {isScrollEvent ? (
                <img src={LogoDark} className="brand-logo" height={28} alt="Brand" />
              ) : (
                <img src={Logo} className="brand-logo" height={28} alt="Brand" />
              )}
            </a>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNav"
              aria-controls="mainNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="mainNav">
              <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2 ">
                <li className="nav-item ">
                  <a className="nav-link" href="#features">
                    Features
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#about">
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/login">
                    Sign in
                  </a>
                </li>
                <li className="nav-item ms-lg-2">
                  <a className="nav-link" href="/get-started">
                    Get started
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <div className="landing-hero">
        <div className="video-bg">
          <LiquidEther />
        </div>

        <div className="landing-hero__content container-fluid ml-5">
          <div className="row " style={{ marginLeft: "40px" }}>
            <div className="col-12 col-lg-8 ml-5">
              <h1
                className="display-5  text-white mb-2"
                style={{ fontSize: "30px" }}
              >
                Why sit in traffic? When the
              </h1>
              <p
                className="lead text-white-50 fw-semibold mb-3"
                style={{ fontSize: "60px" }}
              >
                Sky is already waiting for you
              </p>
              <div className="d-flex gap-2">
                <a
                  href="/get-started"
                  className="btn btn-light btn-lg rounded-pill px-4 explore-btn"
                >
                  Explore &nbsp;
                  <img
                    src={Arrow}
                    className="brand-logo explore-arrow"
                    height={11}
                    alt="Brand"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======= STATS SECTION — Enhanced ======= */}
      <div className="container-fluid pt-5 mt-5 pb-5 mb-5">
        <SectionReveal stagger={0.12}>
          <div className="d-flex mt-5 pt-5 pb-5 justify-content-evenly flex-wrap">
            {[
              { target: 50, suffix: "+", label: "Vertiports" },
              { target: 200, suffix: "", label: "Aircrafts" },
              { target: 10, suffix: "", label: "City Regions" },
              { target: 99, suffix: "%", label: "Uptime" },
            ].map((stat) => (
              <RevealItem key={stat.label}>
                <div className="text-center px-4 py-3">
                  <h3 className="darkVioloteText secondSectionMain">
                    <AnimatedCounter
                      target={stat.target}
                      suffix={stat.suffix}
                      className="darkVioloteText secondSectionMain"
                    />
                  </h3>
                  <h6 className="secondSectionSecondary">{stat.label}</h6>
                </div>
              </RevealItem>
            ))}
          </div>
        </SectionReveal>
      </div>

      {/* ======= STAKEHOLDER SECTION — Enhanced ======= */}
      <div className="stakeholder-section container-fluid pt-5 pl-5">
        <ParallaxLayer speed={0.15}>
          <FadeInSection direction="up" duration={0.7}>
            <h3 className="secondSectionMainHeading">Build for every Stakeholder</h3>
          </FadeInSection>
          <FadeInSection direction="up" delay={0.15} duration={0.7}>
            <h3 className="secondSectionSecondHeading">
              Role based access with tailored dashboards for each participant in the
              ecosystem
            </h3>
          </FadeInSection>
        </ParallaxLayer>

        <div className="d-flex justify-content-start pt-5 topMargin flex-wrap">
          {[
            { icon: CallCenterIcon, label: "eVTOL Operators", delay: 0 },
            { icon: CallCenterIcon, label: "Vertiport Owners", delay: 0.08 },
            { icon: SettingIcon, label: "Regulators", delay: 0.16 },
            { icon: CloudIcon, label: "MET Agencies", delay: 0.24 },
            { icon: PersonIcon, label: "Passengers", delay: 0.32 },
          ].map((item) => (
            <BorderGlow
              key={item.label}
              className="landing-card-glow mx-2"
              backgroundColor="#0a1830"
              borderRadius={30}
              glowColor="210 90 70"
              glowIntensity={1.1}
              edgeSensitivity={28}
              colors={["#5227FF", "#FF9FFC", "#B497CF"]}
            >
              <div className="p-4 d-flex flex-column align-items-start h-100">
                <img src={item.icon} width={23} alt="" className="mb-auto" />
                <h4 className="secondSectionText m-0">{item.label}</h4>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>

      {/* ======= MARKETPLACE / CTA SECTION — Enhanced ======= */}
      <div className="orchestration-section-main container-fluid">
        <FadeInSection direction="up" duration={0.8}>
          <h3>
            A unified marketplace connecting eVTOL operators, vertiport owners,
            regulators
            <br />
            &amp; passengers for seamless urban air mobility operations
          </h3>
        </FadeInSection>
      </div>
      <div className="white-container">
        <FadeInSection direction="up" delay={0.2}>
          <motion.span
            className="px-5 p-3 watch-demo-btn"
            whileHover={{
              y: -2,
              boxShadow: "0 8px 24px rgba(0,37,77,0.18)",
              transition: { duration: 0.25 },
            }}
            whileTap={{ scale: 0.97 }}
            style={{ display: "inline-block", cursor: "pointer" }}
          >
            Watch Demo
          </motion.span>
        </FadeInSection>
      </div>

      {/* ======= ORCHESTRATION SECTION — Enhanced ======= */}
      <div className="orchestration-section container-fluid pt-5">
        <ParallaxLayer speed={0.12}>
          <FadeInSection direction="up" duration={0.7}>
            <h3 className="secondSectionMainHeading">
              Complete Orchestration Platform
            </h3>
          </FadeInSection>
          <FadeInSection direction="up" delay={0.15} duration={0.7}>
            <h3 className="secondSectionSecondHeading">
              Everything you need to operate, manage &amp; scale urban air mobility
              services
            </h3>
          </FadeInSection>
        </ParallaxLayer>

        <div className="d-flex justify-content-start pt-5 topMargin flex-wrap">
          {[
            { icon: CallCenterIcon, label: "eVTOL Operators", delay: 0 },
            { icon: CallCenterIcon, label: "Vertiport Owners", delay: 0.08 },
            { icon: SettingIcon, label: "Regulators", delay: 0.16 },
            { icon: CloudIcon, label: "MET Agencies", delay: 0.24 },
            { icon: PersonIcon, label: "Passengers", delay: 0.32 },
          ].map((item) => (
            <BorderGlow
              key={item.label}
              className="landing-card-glow mx-2"
              backgroundColor="#0a1830"
              borderRadius={30}
              glowColor="210 90 70"
              glowIntensity={1.1}
              edgeSensitivity={28}
              colors={["#5227FF", "#FF9FFC", "#B497CF"]}
            >
              <div className="p-4 d-flex flex-column align-items-start h-100">
                <img src={item.icon} width={23} alt="" className="mb-auto" />
                <h4 className="secondSectionText m-0">{item.label}</h4>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
