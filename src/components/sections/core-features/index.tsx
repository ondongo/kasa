import { BarChart3, Users, Wallet, Globe, Shield, Zap } from "lucide-react";
import { CORE_FEATURES } from "./data";

const icons = [BarChart3, Users, Wallet, Globe, Shield, Zap];

export function CoreFeatures() {
  return (
    <section className="py-20 md:py-28 bg-transparent px-5">
      <div className="max-w-[72rem] mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold text-gray-800 text-4xl dark:text-white/90 md:text-title-lg max-w-2xl mx-auto">
            Toutes les fonctionnalités dont vous avez besoin
          </h2>

          <p className="max-w-2xl mx-auto text-xl leading-relaxed text-gray-500 dark:text-gray-400">
            Une plateforme complète pour gérer toutes vos finances
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {CORE_FEATURES.map((feature, index) => {
            const Icon = icons[index];
            return (
              <div
                key={feature.title}
                className="bg-gray-800/50 backdrop-blur-xl p-8 border-2 border-gray-700 rounded-2xl shadow-sm hover:border-[#F2C086]/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F2C086]/20 flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-[#F2C086]" />
                </div>

                <h3 className="mb-3 text-white font-bold text-xl">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
