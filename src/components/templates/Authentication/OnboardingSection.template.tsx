import { Fade, useTheme, useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  FaUserMd,
  FaCalendarAlt,
  FaPills,
  FaFileMedical,
  FaCommentMedical,
  FaShieldAlt,
  FaArrowRight
} from "react-icons/fa";
import { MdDashboard, MdHealthAndSafety } from "react-icons/md";
import { GiHealthNormal } from "react-icons/gi";

const features = [
  {
    title: "Smart Dashboard",
    description: "Track your health metrics and appointments with beautiful visualizations",
    icon: MdDashboard,
    color: "from-blue-500 to-cyan-400"
  },
  {
    title: "Doctor Connect",
    description: "Find and connect with trusted healthcare professionals",
    icon: FaUserMd,
    color: "from-indigo-500 to-purple-400"
  },
  {
    title: "Secure Messaging",
    description: "Chat securely with healthcare providers in real-time",
    icon: FaCommentMedical,
    color: "from-emerald-500 to-teal-400"
  },
  {
    title: "Health Records",
    description: "Access and manage your complete medical history",
    icon: FaFileMedical,
    color: "from-violet-500 to-fuchsia-400"
  },
  {
    title: "Appointment Scheduler",
    description: "Book and manage doctor visits with ease",
    icon: FaCalendarAlt,
    color: "from-amber-500 to-yellow-400"
  },
  {
    title: "Medication Tracker",
    description: "Never miss a dose with smart reminders",
    icon: FaPills,
    color: "from-rose-500 to-pink-400"
  },
  {
    title: "Health Insights",
    description: "Get personalized health recommendations",
    icon: GiHealthNormal,
    color: "from-green-500 to-emerald-400"
  },
  {
    title: "Secure & Private",
    description: "Your health data is always protected",
    icon: FaShieldAlt,
    color: "from-slate-600 to-slate-400"
  },
  {
    title: "Health & Wellness",
    description: "Comprehensive care for your well-being",
    icon: MdHealthAndSafety,
    color: "from-red-500 to-orange-400"
  }
];

const FeatureIcon = ({
  icon: Icon,
  color,
  title
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  title: string;
}) => (
  <motion.div
    className={`flex items-center p-3 rounded-xl bg-linear-to-br ${color} text-white shadow-lg`}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Icon className="w-6 h-6" /> <span className="text-xs font-medium ml-2">{title}</span>
  </motion.div>
);

const OnboardingSection = ({ onFlip }: { onFlip: () => void }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const CurrentIcon = features[currentFeature]?.icon;
  const CurrentColor = features[currentFeature]?.color;

  useEffect(() => {
    if (!inView || isMobile) return;
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentFeature(prev => (prev + 1) % features.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [inView, isHovered, isMobile]);

  return (
    <div
      ref={ref}
      className="h-full flex flex-col rounded-tl-3xl rounded-bl-3xl bg-linear-to-br from-gray-50 to-white relative"
    >
      <motion.img
        src="https://res.cloudinary.com/dwveckkwz/image/upload/v1753875910/Gemini_Generated_Image_lvu2l3lvu2l3lvu2_if4fey.png"
        alt="Healthcare"
        className="w-full h-26 md:h-60 object-cover rounded-tl-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <Fade in={inView} timeout={700}>
        <div className="flex-1 flex flex-col p-6 md:p-8 pb-32 md:pb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-green-500 to-blue-500">
              Welcome to CareHive
            </h1>
          </div>
          <div className="flex-1 w-full">
            {isMobile ? (
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="min-w-[85%] snap-center bg-white rounded-2xl border shadow-lg p-6 text-center"
                    whileTap={{ scale: 0.97 }}
                  >
                    <FeatureIcon icon={feature.icon} color={feature.color} title={feature.title}/>
                    <p className="text-gray-600 text-sm mt-2">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div
                className="w-full max-w-md mx-auto"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeature}
                    className="bg-white rounded-2xl shadow-xl p-8 text-center border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <FeatureIcon icon={CurrentIcon} color={CurrentColor} title={features[currentFeature].title}/>
                    <p className="text-gray-600 mt-2">
                      {features[currentFeature].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <FaShieldAlt className="text-green-500" />
              End-to-end encrypted for your privacy
            </div>
          </div>
        </div>
      </Fade>
      <motion.div
        className="md:hidden fixed bottom-0 left-0 right-0 p-6 bg-white border-t shadow-2xl"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
      >
        <button
          onClick={onFlip}
          className="w-full py-4 rounded-xl bg-linear-to-r from-green-600 to-emerald-500 text-white font-semibold flex items-center justify-center gap-2"
        >
          Get Started
          <FaArrowRight />
        </button>
      </motion.div>
    </div>
  );
};

export default OnboardingSection;
