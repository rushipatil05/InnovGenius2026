import styles, { layout } from "../../styles";
import { features } from "../../constants";

/* =========================
   Types
========================= */

interface Feature {
    id: string;
    icon: string;
    title: string;
    content: string;
}

interface FeatureCardProps {
    icon: string;
    title: string;
    content: string;
    index: number;
}

/* =========================
   Feature Card
========================= */

const FeatureCard = ({
    icon,
    title,
    content,
    index,
}: FeatureCardProps) => {
    return (
        <div
            className={`flex flex-row p-6 rounded-[20px] ${index !== features.length - 1 ? "mb-6" : "mb-0"
                } feature-card`}
        >
            {/* Icon */}
            <div
                className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-dimBlue`}
            >
                <img
                    src={icon}
                    alt={title}
                    className="w-[50%] h-[50%] object-contain"
                />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col ml-3">
                <h4 className="font-poppins font-semibold text-white text-[18px] leading-[23px] mb-1">
                    {title}
                </h4>
                <p className="font-poppins font-normal text-dimWhite text-[16px] leading-[24px] mb-1">
                    {content}
                </p>
            </div>
        </div>
    );
};

/* =========================
   Business Section
========================= */

const Business = () => {
    return (
        <section id="features" className={layout.section}>
            {/* Section Info */}
            <div className={layout.sectionInfo}>
                <h2 className={styles.heading2}>
                    You just chill,<br className="sm:block hidden" /> we'll handle
                    the onboarding.
                </h2>

                <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
                    Transform how customers open savings accounts with an AI-powered onboarding engine that verifies identity, evaluates risk, 
                    ensures compliance, and activates accounts — all in minutes, not days.
                </p>

            </div>

            {/* Features */}
            <div className={`${layout.sectionImg} flex-col`}>
                {features.map((feature: Feature, i: number) => (
                    <FeatureCard key={feature.id} {...feature} index={i} />
                ))}
            </div>
        </section>
    );
};

export default Business;