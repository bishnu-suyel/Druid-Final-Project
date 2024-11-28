import { useEffect } from "react";
import axios from "axios";
import { Routes, Route, useLocation } from "react-router-dom";
import mautic from "./services/mautic_services";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import ServiceSingle from "./pages/ServiceSingle";
import ServicePage from "./pages/ServiceSingle";
import Career from "./pages/Career";
import BlogPage from "./pages/BlogPage";

const App = () => {
  const location = useLocation();

  // Effect for location-dependent actions
  useEffect(() => {
    // Update page title dynamically based on the path
    const pageTitles = {
      "/": "Homepage",
      "/services": "Our Services",
      "/services/:single": "Service Single Page",
      "/about": "About Us",
      "/contact": "Contact",
      "/blog": "Blog",
      "/career": "Career",
    };
    const title = pageTitles[location.pathname] || "Default Title";
    document.title = title;

    // Track the page view in Mautic
    mautic.pageView({
      path: location.pathname,
      title: document.title,
    });
  }, [location]);

  // Effect for one-time initialization
  useEffect(() => {
    // Get Contact ID from localStorage
    const mtcId = localStorage.getItem("mtc_id");
    console.log("Mautic ID found:", mtcId);

    // Get segments from Drupal
    if (mtcId) {
      axios
        .get(
          `https://druid-final-project.lndo.site/api/mautic/process-segments/${mtcId}`
        )
        .then((response) => {
          if (response.data?.segments?.length > 0) {
            const userSegment = response.data.segments[0];
            localStorage.setItem("userSegments", userSegment);
            // Set it in sessionStorage for easier access across components
            sessionStorage.setItem("currentSegment", userSegment);
            console.log("Stored segment:", userSegment);
          }
        })
        .catch((error) => {
          console.error("Error processing segments:", error);
        });
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route>
          {/* This is where other routes will go to allow Layout to be visible everywhere */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:single" element={<ServiceSingle />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/career" element={<Career />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/service-single" element={<ServicePage />} />
        </Route>

        {/* <Route path="*" element={<ErrorPage />} /> */}
      </Route>
    </Routes>
  );
};

export default App;
