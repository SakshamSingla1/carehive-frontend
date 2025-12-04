import { Fade } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { motion } from "framer-motion";

const features = [
  "Manage your profile and preferences effortlessly",
  "Unified access to all CareHive applications",
  "Smart insights tailored to your healthcare needs",
  "Instant connectivity with care experts",
  "Enterprise-grade security & privacy protection",
];

interface OnboardingSectionProps {
  onFlip: () => void;
}

const OnboardingSection = ({ onFlip }: OnboardingSectionProps) => {
  return (
    <div className="h-full flex flex-col overflow-hidden shadow-lg rounded-tl-xl rounded-bl-xl relative">

      {/* Banner */}
      <motion.div 
        className="relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="https://res.cloudinary.com/dwveckkwz/image/upload/v1753875910/Gemini_Generated_Image_lvu2l3lvu2l3lvu2_if4fey.png"
          alt="CareHive Banner"
          className="w-full object-cover rounded-tl-xl"
          loading="lazy"
        />
      </motion.div>

      {/* Feature Card */}
      <Fade in timeout={700} style={{ height: "100%", display: "flex" }}>
        <motion.div
          className="w-full flex-1 flex flex-col backdrop-blur-xl bg-white/70
          p-6 overflow-y-auto rounded-bl-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-3xl font-extrabold mb-3 leading-tight text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Welcome to CareHive
          </motion.h1>

          <p className="text-center text-gray-600 text-lg mb-6">
            Your unified platform for smarter, faster healthcare decisions.
          </p>

          {/* Features */}
          <ul className="space-y-3 flex-1">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                className="flex items-start"
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.12 }}
              >
                <CheckCircleRoundedIcon
                  fontSize="medium"
                  className="text-green-500 mr-3 mt-0.5"
                />
                <span className="text-gray-700">{feature}</span>
              </motion.li>
            ))}
          </ul>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-300 text-center">
            <p className="text-sm text-gray-500">
              Trusted by healthcare professionals worldwide 🌍
            </p>
          </div>
        </motion.div>
      </Fade>

      {/* Mobile Only Button → Flip to Login */}
      <div className="md:hidden w-full absolute bottom-0 left-0 p-4 bg-gradient-to-t from-white/90 to-transparent">
        <button
          onClick={onFlip}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md
          active:scale-95 transition"
        >
          Continue →
        </button>
      </div>

    </div>
  );
};

export default OnboardingSection;
