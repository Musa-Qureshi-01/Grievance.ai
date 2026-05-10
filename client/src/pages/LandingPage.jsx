import React from "react";
import { Navbar } from "../components/landingpage/navbar";
import { Footer } from "../components/landingpage/footer";
import { HeroSection } from "../components/landingpage/hero-section";
import { ComplaintSubmission } from "../components/landingpage/complaint-submission";
import { AIPipeline } from "../components/landingpage/ai-pipeline";
import { DashboardPreview } from "../components/landingpage/dashboard-preview";
import { OfficerWorkflow } from "../components/landingpage/officer-workflow";
import { TrustTransparency } from "../components/landingpage/trust-transparency";

const LandingPage = () => {
    return (

        <div className="min-h-screen dark:bg-[#0B1020] bg-white transition-colors duration-300">
            <Navbar />
            <main>
                <HeroSection />
                <ComplaintSubmission />
                <AIPipeline />
                <DashboardPreview />
                <OfficerWorkflow />
                <TrustTransparency />
            </main>
            <Footer />
        </div>

    );
};

export default LandingPage;
