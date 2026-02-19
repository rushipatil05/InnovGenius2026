import { useState, useEffect } from 'react';
import { CreditCard, FileText, BadgeDollarSign, Landmark, ShieldCheck, PieChart, ArrowRight, TrendingUp, Shield, Smartphone } from 'lucide-react';
import styles from '../../styles';

interface ServicesHubProps {
    onServiceSelect: (service: string) => void;
}

const carouselContent = [
    {
        id: 1,
        title: "Welcome to InnovGenius",
        description: "Experience the next generation of banking. Managing your finances has never been easier.",
        icon: <Landmark className="w-16 h-16 text-secondary mb-4" />,
        bgClass: "bg-black-gradient"
    },
    {
        id: 2,
        title: "Smart Investments",
        description: "Grow your wealth with our AI-driven investment insights. Returns up to 12% p.a.",
        icon: <TrendingUp className="w-16 h-16 text-green-400 mb-4" />,
        bgClass: "bg-black-gradient-2"
    },
    {
        id: 3,
        title: "Bank Securely",
        description: "Your security is our priority. Enhanced with 256-bit encryption and biometric verification.",
        icon: <Shield className="w-16 h-16 text-blue-400 mb-4" />,
        bgClass: "bg-black-gradient-2"
    },
    {
        id: 4,
        title: "Mobile First",
        description: "Bank on the go with our award-winning mobile app. Available on iOS and Android.",
        icon: <Smartphone className="w-16 h-16 text-yellow-300 mb-4" />,
        bgClass: "bg-black-gradient-2"
    }
];

export default function ServicesHub({ onServiceSelect }: ServicesHubProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % carouselContent.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const services = [
        {
            id: 'account-opening',
            title: 'Account Opening',
            description: 'Open a new savings or current account digitally.',
            icon: <FileText className="w-8 h-8 text-secondary" />,
            active: true,
            action: () => onServiceSelect('account'),
        },
        {
            id: 'loans',
            title: 'Loans',
            description: 'Personal, home, and vehicle loans.',
            icon: <BadgeDollarSign className="w-8 h-8 text-dimWhite" />,
            active: false,
            tag: 'Soon'
        },
        {
            id: 'credit-cards',
            title: 'Cards',
            description: 'Credit cards with exclusive rewards.',
            icon: <CreditCard className="w-8 h-8 text-dimWhite" />,
            active: false,
            tag: 'Soon'
        },
        {
            id: 'investments',
            title: 'Invest',
            description: 'Mutual funds, FDs, and stocks.',
            icon: <PieChart className="w-8 h-8 text-dimWhite" />,
            active: false,
            tag: 'Soon'
        },
        {
            id: 'insurance',
            title: 'Insurance',
            description: 'Life and health insurance plans.',
            icon: <ShieldCheck className="w-8 h-8 text-dimWhite" />,
            active: false,
            tag: 'Soon'
        },
        {
            id: 'tax-services',
            title: 'Tax',
            description: 'Easy tax filing services.',
            icon: <Landmark className="w-8 h-8 text-dimWhite" />,
            active: false,
            tag: 'Soon'
        }
    ];

    const currentSlide = carouselContent[currentIndex];

    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-6">
            {/* Left Side - Dynamic Info (50%) */}
            <div className={`md:w-1/2 w-full relative rounded-[20px] overflow-hidden shadow-2xl transition-all duration-500 ${currentSlide.bgClass} flex flex-col justify-center items-center text-center p-12 min-h-[400px]`}>
                {/* Animated Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute w-[60%] h-[60%] -top-[20%] -left-[20%] white__gradient opacity-10 animate-pulse" />
                    <div className="absolute w-[60%] h-[60%] -bottom-[20%] -right-[20%] pink__gradient opacity-10 animate-pulse" />
                </div>

                {/* Content */}
                <div className="relative z-10 animate-fade-in-up">
                    <div className="flex justify-center transform hover:scale-110 transition-transform duration-300">
                        {currentSlide.icon}
                    </div>
                    <h2 className="font-poppins font-bold text-[32px] text-white mb-4 leading-tight">
                        {currentSlide.title}
                    </h2>
                    <p className={`${styles.paragraph} text-dimWhite max-w-md mx-auto`}>
                        {currentSlide.description}
                    </p>
                </div>

                {/* Indicators */}
                <div className="absolute bottom-8 flex space-x-2 z-10">
                    {carouselContent.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${idx === currentIndex ? "bg-secondary w-8" : "bg-dimWhite/30 hover:bg-white"
                                }`}
                            onClick={() => setCurrentIndex(idx)}
                        />
                    ))}
                </div>
            </div>

            <div className="md:w-1/2 w-full flex flex-col">
                <h2 className="font-poppins font-semibold text-[24px] text-white mb-6 flex items-center">
                    Our Services <div className="h-[1px] bg-dimWhite/20 flex-1 ml-6"></div>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            onClick={service.active ? service.action : undefined}
                            className={`
                                relative flex flex-col p-5 rounded-[16px] border transition-all duration-300 group
                                ${service.active
                                    ? 'bg-white/5 border-white/10 hover:border-secondary hover:bg-white/10 cursor-pointer'
                                    : 'bg-white/5 border-transparent opacity-60 cursor-not-allowed'}
                                `}>
                            <div className="flex justify-between items-start mb-3">
                                <div className="w-10 h-10 rounded-full flex justify-center items-center bg-white/10 group-hover:bg-white/20 transition-colors">
                                    {service.icon}
                                </div>
                                {!service.active && (
                                    <span className="text-[10px] bg-primary border border-dimWhite/10 text-dimWhite px-2 py-0.5 rounded-full">
                                        {service.tag}
                                    </span>
                                )}
                            </div>

                            <h3 className="font-poppins font-semibold text-[16px] text-white mb-1 group-hover:text-secondary transition-colors">
                                {service.title}
                            </h3>
                            <p className="font-poppins font-normal text-[12px] text-dimWhite/70 leading-tight">
                                {service.description}
                            </p>

                            {service.active && (
                                <div className="mt-3 flex items-center text-secondary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    Access Now <ArrowRight className="w-3 h-3 ml-1" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
