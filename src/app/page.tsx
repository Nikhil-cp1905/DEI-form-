
"use client";

import { useState, useEffect, useRef, type MouseEvent } from "react";
import {
  BrainCircuit,
  Users,
  Heart,
  DraftingCompass,
  UsersRound,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { questions } from "@/lib/questions";
import { submitFeedback } from "@/app/actions";
import Confetti from "@/components/Confetti";
import { useToast } from "@/hooks/use-toast";

type Step = "alias" | "survey" | "submitted";
type Answers = Record<string, any>;

export default function VibeCheckPage() {
  const [step, setStep] = useState<Step>("alias");
  const [alias, setAlias] = useState("");
  const [answers, setAnswers] = useState<Answers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  const mainContainerRef = useRef<HTMLDivElement>(null);
  const isSubmitting = useRef(false);

  useEffect(() => {
    if (isSubmitting.current && step === "survey") {
      // This ensures performSubmit is called only after the state has updated.
      const performSubmit = async () => {
        isSubmitting.current = false; // Prevent repeated submissions
        const result = await submitFeedback({ alias, answers });

        if (result.success) {
          setTimeout(() => {
            setStep("submitted");
            setIsAnimating(false);
          }, 500);
        } else {
          toast({
            title: "Submission Failed",
            description: result.error || "Something went wrong. Please try again.",
            variant: "destructive",
          });
          setIsAnimating(false);
        }
      };
      performSubmit();
    }
  }, [answers, step, alias, toast]);


  const handleAliasSubmit = () => {
    if (alias.trim() && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep("survey");
        setIsAnimating(false);
      }, 500);
    }
  };

  const handleNextQuestion = () => {
    if (isAnimating) return;

    const currentQuestion = questions[currentQuestionIndex];
    if (typeof answers[currentQuestion.id] === 'undefined' || answers[currentQuestion.id] === '') {
      toast({
        title: 'Hold on!',
        description: 'Please answer the current question before proceeding.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnimating(true);
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsAnimating(false);
      }, 500);
    } else {
      // This is the final question, trigger submission.
      // The `useEffect` will handle the actual submission logic
      // after the state update is complete.
      isSubmitting.current = true;
      // Trigger a re-render to run the useEffect hook.
      // We pass the current answers object to ensure the hook has the latest data.
      setAnswers(currentAnswers => ({...currentAnswers}));
    }
  };

  const handleStartOver = () => {
    setIsAnimating(true);
    setTimeout(() => {
        setAnswers({});
        setCurrentQuestionIndex(0);
        setAlias("");
        setStep("alias");
        setIsAnimating(false);
    }, 500);
  };

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) {
      ripple.remove();
    }
    button.appendChild(circle);
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return null;

    const animationClass = `w-full ${isAnimating ? "animate-fade-out-up" : "animate-slide-in-up"}`;

    switch (question.type) {
      case "mc-vibe":
      case "mc-icon":
        return (
          <div key={currentQuestionIndex} className={animationClass}>
            <h2 className="text-2xl md:text-3xl font-headline font-semibold text-center mb-8">{question.questionText}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options?.map((option) => (
                <Card
                  key={option.value}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20 bg-white/30 backdrop-blur-sm border-white/50 ${
                    answers[question.id] === option.value ? "ring-2 ring-primary bg-primary/20" : ""
                  }`}
                >
                  <CardContent className="p-4 flex items-center gap-4 text-lg">
                    {question.type === 'mc-vibe' ? <span>{option.icon}</span> : option.icon}
                    <span>{option.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "text":
        return (
          <div key={currentQuestionIndex} className={animationClass}>
            <h2 className="text-2xl md:text-3xl font-headline font-semibold text-center mb-8">{question.questionText}</h2>
            <Textarea
              className="min-h-[120px] text-lg p-4 transition-all duration-300 focus-within:shadow-lg focus-within:shadow-primary/20 focus-within:scale-[1.02] bg-white/30 backdrop-blur-sm border-white/50"
              placeholder="Your thoughts here..."
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getContainerAnimationClass = () => {
    if (isAnimating) {
        if (step === 'alias' || step === 'submitted') return "animate-fade-out";
        return "animate-fade-out-up";
    }
    return "animate-fade-in";
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div ref={mainContainerRef} className="relative w-full max-w-2xl mx-auto p-4 md:p-8 min-h-[500px] flex flex-col items-center justify-center">
        <div className={`w-full transition-all duration-500 ${getContainerAnimationClass()}`}>
          {step === "alias" && (
             <Card className="bg-white/30 backdrop-blur-sm border-white/50 p-8 shadow-2xl animate-slide-in-up">
               <CardContent className="text-center w-full flex flex-col items-center p-0">
                  <h1 className="text-3xl md:text-4xl font-headline font-bold mb-4">DEI Survey</h1>
                  <p className="text-lg md:text-xl font-headline mb-8 text-muted-foreground">Any anonymous name you want to be known by?</p>
                  <div className="w-full max-w-md input-container">
                      <Input
                          type="text"
                          placeholder="Type your alias here…"
                          value={alias}
                          onChange={(e) => setAlias(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAliasSubmit()}
                          className="text-center text-xl h-14 p-4 animated-placeholder bg-white/50"
                      />
                  </div>
                  <Button onClick={(e) => { createRipple(e); handleAliasSubmit(); }} size="lg" className="mt-8 text-xl font-bold relative overflow-hidden transition-transform transform hover:scale-105 active:scale-95" disabled={!alias.trim()}>
                    Next <ArrowRight className="ml-2"/>
                  </Button>
               </CardContent>
             </Card>
          )}

          {step === "survey" && (
            <div className="w-full">
              <div className="flex justify-center items-center gap-3 mb-8">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      index === currentQuestionIndex ? "bg-primary scale-125" : "bg-border"
                    }`}
                  ></div>
                ))}
              </div>
              <div className="relative min-h-[350px]">
                {renderQuestion()}
              </div>
              <div className="flex justify-center mt-8">
                <Button onClick={(e) => { createRipple(e); handleNextQuestion(); }} size="lg" className="text-xl font-bold relative overflow-hidden transition-transform transform hover:scale-105 active:scale-95">
                  {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"} <ArrowRight className="ml-2"/>
                </Button>
              </div>
            </div>
          )}

          {step === "submitted" && (
            <div className="text-center animate-fade-in">
              <Confetti />
              <h1 className="text-5xl md:text-6xl font-headline font-bold mb-4">Thank you!</h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">Thanks for filling it out.</p>
              <Button onClick={(e) => { createRipple(e); handleStartOver(); }} size="lg" className="text-xl font-bold relative overflow-hidden transition-transform transform hover:scale-105 active:scale-95">
                Start Over
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
