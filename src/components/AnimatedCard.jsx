import { motion } from 'framer-motion';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const AnimatedCard = ({ children, className, delay = 0, hover = true, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={cn('glass rounded-2xl p-6', hover && 'glass-hover cursor-pointer', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
