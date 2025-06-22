import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import AppTheme from "../shared-theme/AppTheme";
import AppAppBar from "../components/AppAppBar";
import Hero from "../components/Hero";
import LogoCollection from "../components/LogoCollection";
import Highlights from "../components/Highlights";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

export default function MainPage(props) {
  return (
    //Gece gündüz teması için
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Hero />
      <div>
        <LogoCollection />
        <div id="features">
          <Features />
        </div>
        <Divider />
        <div id="testimonials">
          <Testimonials />
        </div>
        <Divider />
        <div id="highlights">
          <Highlights />
        </div>
        <Divider />
        <div id="faq">
          <FAQ />
        </div>
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}
