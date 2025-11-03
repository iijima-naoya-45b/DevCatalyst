import { Badge } from "../../(feature)/common/ui/badge";
import { AriaChat } from "../../(feature)/common/AriaChat";

export function AriaDemoSection({ showAriaDemo }: { showAriaDemo: boolean }) {
  if (!showAriaDemo) {
    return null;
  }

  return (
    <section className="py-20 px-4 border-t border-gold/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="bg-gold/10 text-gold border-gold/30 mb-4">
            LIVE DEMO
          </Badge>
          <h3 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
            アリアと、実際に話してみる
          </h3>
          <p className="text-muted-foreground text-lg">
            静かに耳を傾け、一緒に考えてくれる。そんな対話を、少し体験してみてください。
          </p>
        </div>
        <AriaChat />
      </div>
    </section>
  );
}
