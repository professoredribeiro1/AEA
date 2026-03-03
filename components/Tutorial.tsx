import React, { useState } from 'react';
import { Heart, Sparkles, UserSearch, Target, ArrowRight, Check } from 'lucide-react';

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <UserSearch className="w-12 h-12 text-rose-500" />,
      title: "Descubra sua Linguagem",
      description: "Tudo começa com você. Faça o teste para entender como você recebe amor e o que é essencial para seu coração."
    },
    {
      icon: <Target className="w-12 h-12 text-rose-500" />,
      title: "Identifique o Parceiro",
      description: "O segredo de um casamento feliz é amar o outro na língua que ele entende. Defina a linguagem do seu parceiro no painel."
    },
    {
      icon: <Sparkles className="w-12 h-12 text-rose-500" />,
      title: "Desafios dos 60 Dias",
      description: "Inicie sua jornada de 60 dias de amor sacrificial. Nossa IA criará missões diárias práticas para você surpreender seu parceiro todos os dias."
    },
    {
      icon: <Heart className="w-12 h-12 text-rose-500 fill-rose-500" />,
      title: "Monitore o Tanque",
      description: "Acompanhe visualmente o nível emocional da relação. Tanque cheio significa uma relação blindada e feliz."
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-rose-900/40 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-12 flex flex-col items-center text-center">
          <div className="mb-8 p-6 bg-rose-50 rounded-3xl">
            {steps[step].icon}
          </div>
          <h2 className="text-3xl font-black text-rose-900 mb-4">{steps[step].title}</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-10">{steps[step].description}</p>
          
          <div className="flex gap-2 mb-10">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-rose-600' : 'w-2 bg-rose-100'}`} />
            ))}
          </div>

          <button
            onClick={() => step < steps.length - 1 ? setStep(step + 1) : onComplete()}
            className="w-full py-5 bg-rose-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
          >
            {step < steps.length - 1 ? (
              <>Próximo <ArrowRight className="w-5 h-5" /></>
            ) : (
              <>Começar Minha Jornada <Check className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;