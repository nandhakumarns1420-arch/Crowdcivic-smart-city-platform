import { motion } from 'framer-motion';
import { Lightbulb, Target, Layers, Users } from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';
import { useLanguage } from '../context/LanguageContext';

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('aboutTitle')}</h1>
        <p className="text-xl text-gray-400">
          {t('aboutSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-white">{t('problemTitle')}</h2>
          <p className="text-gray-400 mb-4 leading-relaxed">
            {t('problemDesc1')}
          </p>
          <p className="text-gray-400 leading-relaxed">
            {t('problemDesc2')}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative h-80 rounded-2xl overflow-hidden glass border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1604928141064-207cea6f571f?auto=format&fit=crop&q=80&w=800" 
            alt="City infrastructure problem" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative h-80 rounded-2xl overflow-hidden glass border border-white/10 order-2 md:order-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800" 
            alt="Smart city technology" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="order-1 md:order-2"
        >
          <h2 className="text-3xl font-bold mb-6 text-white">{t('solutionTitle')}</h2>
          <p className="text-gray-400 mb-4 leading-relaxed">
            {t('solutionDesc1')}
          </p>
          <p className="text-gray-400 leading-relaxed">
            {t('solutionDesc2')}
          </p>
        </motion.div>
      </div>

      {/* Project Highlights */}
      <h2 className="text-3xl font-bold text-center mb-12 text-white">{t('highlightsTitle')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedCard className="text-center p-8">
          <Target className="w-10 h-10 mx-auto text-blue-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">{t('objective')}</h3>
          <p className="text-sm text-gray-400">{t('objectiveDesc')}</p>
        </AnimatedCard>
        
        <AnimatedCard className="text-center p-8">
          <Layers className="w-10 h-10 mx-auto text-cyan-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">{t('techStack')}</h3>
          <p className="text-sm text-gray-400">{t('techStackDesc')}</p>
        </AnimatedCard>

        <AnimatedCard className="text-center p-8">
          <Users className="w-10 h-10 mx-auto text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">{t('targetAudience')}</h3>
          <p className="text-sm text-gray-400">{t('targetAudienceDesc')}</p>
        </AnimatedCard>

        <AnimatedCard className="text-center p-8">
          <Lightbulb className="w-10 h-10 mx-auto text-yellow-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">{t('innovation')}</h3>
          <p className="text-sm text-gray-400">{t('innovationDesc')}</p>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default AboutPage;
