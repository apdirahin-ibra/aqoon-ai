import { CategoryTabs } from "@/components/landing/CategoryTabs";
import { CTASection } from "@/components/landing/CTASection";
import { FeaturedCourses } from "@/components/landing/FeaturedCourses";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { HeroSection } from "@/components/landing/HeroSection";
import { Testimonials } from "@/components/landing/Testimonials";

export default function Home() {
	return (
		<div className="flex flex-col">
			<HeroSection />
			<FeaturesGrid />
			<CategoryTabs />
			<FeaturedCourses />
			<Testimonials />
			<CTASection />
		</div>
	);
}
