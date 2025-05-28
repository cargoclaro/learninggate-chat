'use client';

import { useChat, type Message } from '@ai-sdk/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

export default function Page() {
  // State to track if the interview evaluation process has started
  const [isInterviewEvaluating, setIsInterviewEvaluating] = useState(false);
  // State to provide feedback to the user about the evaluation process
  const [evaluationStatus, setEvaluationStatus] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  // New state for the CTA form
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    area: '',
    age: ''
  });

  // Generate a conversation ID when the component mounts
  useEffect(() => {
    const newId = uuidv4();
    setConversationId(newId);
    console.log("Frontend: New Conversation ID generated:", newId);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to log conversationId when it changes (for debugging)
  useEffect(() => {
    if(conversationId) {
      console.log("Frontend: Conversation ID is now:", conversationId);
    }
  }, [conversationId]);

  // Reference to the textarea element for resizing
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    // Add throttling configuration to slow down streaming
    experimental_throttle: 250, // Adds a 100ms delay between each token
    // Reset textarea height after message is sent
    onFinish: () => {
      // Reset the textarea height to its minimum after sending a message
      if (textareaRef.current) {
        textareaRef.current.style.height = '48px';
      }
    },
    // It's good practice to also handle potential errors from the chat API
    onError: (error) => {
      console.error("Chat API error:", error);
      // You could set an error message in your UI here
      setEvaluationStatus("Error en el chat. Por favor, intente de nuevo.");
    }
  });

  // Function to handle form submission and start conversation
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the initial message with available user information
    let initialMessage = "Hola, estoy listo para comenzar la evaluación de IA.";
    
    const userInfo = [];
    if (formData.name) userInfo.push(`mi nombre es ${formData.name}`);
    if (formData.company) userInfo.push(`trabajo en ${formData.company}`);
    if (formData.area) userInfo.push(`en el área de ${formData.area}`);
    if (formData.age) userInfo.push(`tengo ${formData.age} años`);
    
    if (userInfo.length > 0) {
      initialMessage = `Hola, ${userInfo.join(', ')}. Estoy listo para comenzar la evaluación de IA.`;
    }
    
    // Hide the form and start the conversation
    setShowForm(false);
    
    // Send the initial message to start the conversation
    await append({
      role: 'user',
      content: initialMessage
    });
  };

  // Function to handle form input changes
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to send the conversation to the evaluation API
  const sendConversationForEvaluation = useCallback(async (conversationMessages: Message[], userEmail: string) => {
    if (conversationMessages.length === 0) {
      console.warn("Frontend: No messages to evaluate.");
      setEvaluationStatus("No hay mensajes para evaluar.");
      setIsInterviewEvaluating(false); // Reset if there's nothing to do
      return;
    }
    if (!conversationId) { // Check if conversationId is available
      console.error("Frontend: Conversation ID is missing. Cannot send for evaluation.");
      setEvaluationStatus("Error: Falta el ID de la conversación.");
      setIsInterviewEvaluating(false);
      return;
    }

    console.log(`Frontend: Sending conversation ${conversationId} for evaluation...`, conversationMessages);
    setEvaluationStatus("Procesando evaluación... Por favor espere.");

    try {
      const response = await fetch('/api/evaluate-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationMessages, 
          conversationId: conversationId, // Include conversationId in the payload
          userEmail: userEmail, // <<<--- ADDED USER EMAIL HERE ---<<<
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido al procesar la respuesta del servidor." }));
        console.error(`Frontend: Evaluation API request failed with status ${response.status}.`, errorData);
        setEvaluationStatus(`Error en la evaluación: ${errorData.error || response.statusText}`);
        throw new Error(`Evaluation API request failed: ${response.statusText}`);
      }

      const evaluationResult = await response.json();
      console.log('Frontend: Evaluation successful!', evaluationResult);
      setEvaluationStatus("¡Ya quedaste registrado!"); 
      // Reload the page after 2 seconds to give user time to see the success message
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Frontend: Error during evaluation API call:', error);
      // Check if error is an instance of Error to safely access message property
      if (error instanceof Error) {
        setEvaluationStatus(`Error al enviar la evaluación: ${error.message}`);
      }
      else {
        setEvaluationStatus("Error desconocido al enviar la evaluación.");
      }
    } finally {
      // Regardless of success or failure, we might want to allow another evaluation
      // or keep it as is depending on the desired UX. For now, let's reset.
      // If you only want one evaluation per session, you might not reset isInterviewEvaluating
      // setIsInterviewEvaluating(false); // Comment this out if only one eval per session
    }
  }, [conversationId]);

  // New useEffect to check for email in the last user message
  useEffect(() => {
    if (messages.length === 0 || isInterviewEvaluating) {
      return; // No messages or evaluation already in progress
    }

    const lastMessage = messages[messages.length - 1];

    // Simple regex to check for a pattern resembling an email
    const emailRegex = /\S+@\S+\.\S+/;
    const emailMatch = lastMessage.content.match(emailRegex);

    if (lastMessage.role === 'user' && emailMatch) {
      const extractedEmail = emailMatch[0]; // The first match is the email itself
      console.log("Frontend: Email pattern detected and extracted:", extractedEmail);
      console.log("Frontend: Preparing for evaluation based on email submission.");
      setIsInterviewEvaluating(true); // Mark that evaluation process has started
      setEvaluationStatus("Correo electrónico detectado. Preparando evaluación...");
      // Call evaluation with the current messages array and the extracted email
      sendConversationForEvaluation(messages, extractedEmail);
    }
  }, [messages, isInterviewEvaluating, sendConversationForEvaluation]); // Re-run when messages, isInterviewEvaluating, or sendConversationForEvaluation changes

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [loadingDots, setLoadingDots] = useState('.');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isLoading) {
      setLoadingDots('.');
      intervalId = setInterval(() => {
        setLoadingDots(prevDots => {
          if (prevDots.length >= 3) {
            return '.';
          } else {
            return prevDots + '.';
          }
        });
      }, 500);
    } else {
      setLoadingDots('.');
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isLoading]);

  return (
    <div className="flex flex-col min-h-screen font-manrope bg-white relative">
      {messages.length === 0 && !isLoading && showForm && (
        <>
          {/* Full screen background image - responsive positioning */}
          <div className="fixed inset-0 opacity-60 pointer-events-none z-0 hidden md:block" 
               style={{ transform: 'translateX(20px)' }}>
            <Image 
              src="/ctawomanmodel1.png" 
              alt="" 
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          
          {/* Mobile background - subtle gradient instead of image */}
          <div className="fixed inset-0 bg-gradient-to-br from-orange-50 to-yellow-50 opacity-80 pointer-events-none z-0 md:hidden"></div>
          
          {/* Content container - responsive layout */}
          <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 relative z-10 flex flex-col min-h-screen">
            <div className="flex-1 flex flex-col relative">
              {/* Responsive content positioning */}
              <div className="flex-1 flex items-center justify-center md:justify-start">
                <div className="w-full max-w-lg relative z-10 
                              mx-auto md:mx-0 
                              md:ml-16 lg:ml-0 
                              lg:ml-[calc(50%-600px)]">
                  
                  {/* Responsive heading */}
                  <div className="text-center md:text-left mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3 text-gray-800 leading-tight">
                      Descubre tu potencial de IA. <span role="img" aria-label="rocket">🚀</span>
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 mb-2">
                      Descubre tus fortalezas y áreas para mejorar.
                    </p>
                    <p className="text-sm text-gray-500">
                      Es importante ser honesto - responde desde tu propio conocimiento.
                    </p>
                  </div>

                  {/* Responsive CTA Form */}
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 
                                 focus:outline-none focus:ring-2 focus:ring-[#F5B614] focus:border-transparent 
                                 bg-gray-50 text-base sm:text-sm
                                 transition-all duration-200"
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        Empresa
                      </label>
                      <input
                        type="text"
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleFormChange('company', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 
                                 focus:outline-none focus:ring-2 focus:ring-[#F5B614] focus:border-transparent 
                                 bg-gray-50 text-base sm:text-sm
                                 transition-all duration-200"
                        placeholder="Nombre de tu empresa"
                      />
                    </div>

                    <div>
                      <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                        Área de trabajo
                      </label>
                      <input
                        type="text"
                        id="area"
                        value={formData.area}
                        onChange={(e) => handleFormChange('area', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 
                                 focus:outline-none focus:ring-2 focus:ring-[#F5B614] focus:border-transparent 
                                 bg-gray-50 text-base sm:text-sm
                                 transition-all duration-200"
                        placeholder="Ej: Marketing, Ventas, IT, etc."
                      />
                    </div>

                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                        Edad
                      </label>
                      <input
                        type="number"
                        id="age"
                        value={formData.age}
                        onChange={(e) => handleFormChange('age', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 
                                 focus:outline-none focus:ring-2 focus:ring-[#F5B614] focus:border-transparent 
                                 bg-gray-50 text-base sm:text-sm
                                 transition-all duration-200"
                        placeholder="Tu edad"
                        min="18"
                        max="100"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#F5B614] text-white font-medium py-3 px-6 rounded-lg 
                               hover:bg-[#E5A604] active:bg-[#D49604] 
                               transition-all duration-200 
                               focus:outline-none focus:ring-2 focus:ring-[#F5B614] focus:ring-offset-2
                               text-base sm:text-sm
                               touch-manipulation"
                    >
                      Comenzar Evaluación
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {(messages.length > 0 || isLoading) && (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 
                      relative z-10 flex flex-col min-h-screen">
          <div className="flex-1 overflow-y-auto mb-4 space-y-3 sm:space-y-4 
                        flex flex-col z-10 relative">
            
            {messages.map((message: Message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}
              >
                <div
                  className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3 
                            max-w-[85%] sm:max-w-[80%] shadow-sm 
                            ${message.role === 'user'
                              ? 'bg-gray-200 text-gray-800' 
                              : 'border-2 border-[#F5B614] bg-white text-gray-800'
                            }`}
                >
                  <p className="text-sm sm:text-base leading-relaxed break-words">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start relative z-10">
                <div className="rounded-2xl px-3 sm:px-4 py-2 sm:py-3 
                              max-w-[85%] sm:max-w-[80%] shadow-sm 
                              border-2 border-[#F5B614] bg-white text-gray-800">
                  <p className="text-sm sm:text-base leading-relaxed italic">{loadingDots}</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Display Evaluation Status Message - responsive */} 
      {evaluationStatus && (
        <div className={`mx-4 sm:mx-6 lg:mx-auto lg:max-w-4xl text-center p-3 my-3 
                       rounded-2xl shadow-sm text-sm z-20 relative transition-all duration-300 ${
          evaluationStatus.includes("éxito") || evaluationStatus.includes("completada") 
          ? "bg-[#FFF8E6] border-2 border-[#F5B614] text-gray-800"  
          : evaluationStatus.includes("Error") 
            ? "bg-red-50 border-2 border-red-200 text-red-800"       
            : "bg-[#FFF8E6] border-2 border-[#F5B614] text-gray-800" 
        }`}>
          <span className="flex items-center justify-center">
            {evaluationStatus.includes("éxito") || evaluationStatus.includes("completada") ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#F5B614] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : evaluationStatus.includes("Error") ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="animate-spin h-5 w-5 mr-2 text-[#F5B614] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            <span className="break-words">{evaluationStatus}</span>
          </span>
        </div>
      )}

      {/* Chat input - responsive */}
      {!showForm && (
        <div className="border-t border-gray-100 pt-4 z-10 relative 
                      px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative flex items-end">
              <textarea
                ref={textareaRef}
                name="prompt"
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  // Submit on Enter, but allow Shift+Enter for new lines
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Envía un mensaje... (Shift+Enter para nueva línea)"
                rows={1}
                className="flex-1 rounded-2xl border border-gray-200 
                         px-4 sm:px-6 py-3 pr-12 sm:pr-14
                         focus:outline-none focus:ring-2 focus:ring-[#F5B614] focus:border-transparent 
                         font-manrope text-sm sm:text-base w-full bg-gray-50 
                         resize-none min-h-[48px] max-h-32 overflow-y-auto
                         transition-all duration-200
                         touch-manipulation"
                style={{
                  height: 'auto',
                  minHeight: '48px'
                }}
                onInput={(e) => {
                  // Auto-resize the textarea based on content
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                }}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-3 bottom-3 bg-[#F5B614] text-white rounded-full 
                         w-9 h-9 sm:w-10 sm:h-10 
                         flex items-center justify-center 
                         hover:bg-[#E5A604] active:bg-[#D49604] 
                         transition-all duration-200 
                         disabled:bg-[#F5B614] disabled:cursor-not-allowed
                         touch-manipulation
                         focus:outline-none focus:ring-2 focus:ring-[#F5B614] focus:ring-offset-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" 
                     width="16" height="16" 
                     className="sm:w-4 sm:h-4" 
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13"/>
                  <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Logo - responsive sizing */}
      <div className="flex justify-center mt-4 pb-4 sm:pb-6 lg:pb-8 relative z-20 
                    px-4 sm:px-6 lg:px-8">
        <Image 
          src="/logo.png" 
          alt="Logo" 
          width={180} 
          height={180} 
          className="object-contain w-32 h-32 sm:w-40 sm:h-40 lg:w-60 lg:h-60" 
        />
      </div>
    </div>
  );
}