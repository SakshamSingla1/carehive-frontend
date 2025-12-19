import { Fade, useTheme } from "@mui/material";
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
} from 'react-icons/fa';
import { MdDashboard, MdHealthAndSafety } from 'react-icons/md';
import { GiHealthNormal } from 'react-icons/gi';

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

const FeatureIcon = ({ icon: Icon, delay = 0, color = "from-green-500 to-emerald-400" }: { 
  icon: React.ComponentType<{ className?: string }>, 
  delay?: number,
  color?: string 
}) => (
  <motion.div
    className={`p-3 rounded-xl bg-linear-to-br ${color} text-white shadow-lg`}
    initial={{ scale: 0.8, opacity: 0, rotate: -20 }}
    animate={{ scale: 1, opacity: 1, rotate: 0 }}
    transition={{ 
      delay, 
      type: "spring", 
      stiffness: 300,
      damping: 10
    }}
    whileHover={{ 
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.4 }
    }}
  >
    <Icon className="w-6 h-6" />
  </motion.div>
);

const OnboardingSection = ({ onFlip }: { onFlip: () => void }) => {
  const theme = useTheme();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      const interval = setInterval(() => {
        if (!isHovered) {
          setCurrentFeature(prev => (prev + 1) % features.length);
        }
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [inView, isHovered]);

  const { icon: CurrentIcon, color } = features[currentFeature] || { 
    icon: MdDashboard, 
    color: "from-green-500 to-emerald-400" 
  };

  return (
    <div 
      ref={ref}
      className="h-full flex flex-col overflow-hidden rounded-tl-3xl rounded-bl-3xl relative bg-linear-to-br from-gray-50 to-white"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-5"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}30, ${theme.palette.secondary.main}30)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: 30 + Math.random() * 30,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Header with image */}
      <motion.div 
        className="relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.img
          src="https://res.cloudinary.com/dwveckkwz/image/upload/v1753875910/Gemini_Generated_Image_lvu2l3lvu2l3lvu2_if4fey.png"
          alt="Healthcare Professionals"
          className="w-full h-48 md:h-52 object-cover"
          loading="eager"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-white to-transparent" />
      </motion.div>

      <Fade in={inView} timeout={700} style={{ height: "100%", display: "flex" }}>
        <motion.div
          className="w-full flex-1 flex flex-col p-6 md:p-8 relative z-10"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { 
                staggerChildren: 0.1,
                delayChildren: 0.3
              } 
            }
          }}
        >
          <motion.div 
            className="text-center mb-8"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.6,
                  ease: "backOut"
                } 
              }
            }}
          >
            <motion.h1
              className="text-3xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent font-stretch-75%"
              style={{
                backgroundImage: `linear-gradient(90deg, #10b981, #0ea5e9)`
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              Welcome to CareHive
            </motion.h1>
            <motion.p 
              className="text-gray-600 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.6 }}
            >
              Your healthcare, simplified
            </motion.p>
          </motion.div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div 
              className="w-full h-full max-w-md max-h-md relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  className="relative h-full max-h-md rounded-2xl overflow-hidden bg-white shadow-xl border border-gray-100"
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { 
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -20, 
                    scale: 0.98,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                        transition: { 
                          delay: 0.2,
                          type: "spring",
                          stiffness: 300
                        }
                      }}
                    >
                      <FeatureIcon 
                        icon={CurrentIcon} 
                        color={color}
                        delay={0.1}
                      />
                    </motion.div>
                    <motion.h3 
                      className="text-2xl font-bold text-gray-900 mt-6 mb-2"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: 1,
                        transition: { delay: 0.3 }
                      }}
                    >
                      {features[currentFeature]?.title}
                    </motion.h3>
                    <motion.p 
                      className="text-gray-600 max-w-sm"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: 0.8,
                        transition: { delay: 0.4 }
                      }}
                    >
                      {features[currentFeature]?.description}
                    </motion.p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <motion.div 
            className="mt-8 pt-6 border-t border-gray-100 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: 0.8 }
            }}
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FaShieldAlt className="text-green-500" />
              <span className="text-sm text-gray-500">
                End-to-end encrypted for your privacy
              </span>
            </div>
          </motion.div>
        </motion.div>
      </Fade>

      <motion.div 
        className="md:hidden w-full p-6 bg-white border-t border-gray-100 fixed bottom-0 left-0 right-0 shadow-2xl"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.button
          onClick={onFlip}
          className="w-full py-4 bg-linear-to-r from-green-600 to-emerald-500 text-white 
          font-semibold rounded-xl shadow-lg flex items-center justify-center space-x-2
          hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          whileHover={{ 
            boxShadow: `0 10px 25px -5px ${theme.palette.primary.main}40`
          }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Get Started</span>
          <motion.span
            animate={{ 
              x: [0, 4, 0],
              transition: { 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }
            }}
          >
            <FaArrowRight className="w-4 h-4" />
          </motion.span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default OnboardingSection;