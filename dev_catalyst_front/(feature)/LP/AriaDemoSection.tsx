import { Badge } from "../../(feature)/common/ui/badge";
import { AriaChat } from "../../(feature)/common/AriaChat";
import { useInView } from '../../hooks/use-in-view';

export function AriaDemoSection({ showAriaDemo }: { showAriaDemo: boolean }) {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  if (!showAriaDemo) {
    return null;
  }

  return (
    <section ref={ref} className="py-20 px-4 border-t border-gold/20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 fade-in-up ${isInView ? 'in-view' : ''}`}>
          <Badge className="bg-gold/10 gold-soft-text border-gold/30 mb-4">
            LIVE DEMO
          </Badge>
          <h3 className="text-3xl md:text-4xl font-serif font-semibold mb-4 text-gray-900 dark:text-white">
            アリアと、実際に話してみる
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            静かに耳を傾け、一緒に考えてくれる。そんな対話を、少し体験してみてください。
          </p>
        </div>
        <div className={`scale-in ${isInView ? 'in-view delay-200' : ''}`}>
          <AriaChat />
        </div>
      </div>
    </section>
  );
}
