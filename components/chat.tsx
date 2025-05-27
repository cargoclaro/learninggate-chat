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

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
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
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 py-8 font-manrope bg-white relative">
      {messages.length === 0 && !isLoading && (
        <>
          <div className="flex-1 flex flex-col z-10 px-4 relative">
            {/* Background logo positioned within the messages area */}
            <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
              <Image src="/logo.png" alt="" width={600} height={600} className="object-contain" />
            </div>
            
            {/* Adjusted positioning for left alignment at bottom */}
            <div className="flex-1"></div>
            <div className="mb-32 relative z-10">
              <h1 className="text-5xl font-semibold mb-3 text-gray-800">
                Descubre tu potencial de IA. <span role="img" aria-label="rocket">🚀</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-md">
                Descubre tus fortalezas y áreas para mejorar.
                <br />
                <br />
                <span className="text-sm text-gray-500">
                  Es importante ser honesto - responde desde tu propio conocimiento.
                </span>
              </p>
            </div>
          </div>
        </>
      )}

      {(messages.length > 0 || isLoading) && (
        <>
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pl-0 flex flex-col z-10 relative">
            {/* Background logo positioned within the messages area */}
            <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
              <Image src="/logo.png" alt="" width={500} height={500} className="object-contain" />
            </div>
            
            {messages.map((message: Message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[80%] shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gray-200 text-gray-800' // Light gray for user
                      : 'border-2 border-[#F5B614] bg-white text-gray-800' // Gold border only for AI
                  }`}
                >
                  <p className="text-base leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start relative z-10">
                <div className="rounded-2xl px-4 py-3 max-w-[80%] shadow-sm border-2 border-[#F5B614] bg-white text-gray-800">
                  <p className="text-base leading-relaxed italic">{loadingDots}</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </>
      )}

      {/* Display Evaluation Status Message */} 
      {evaluationStatus && (
        <div className={`text-center p-3 my-3 rounded-2xl shadow-sm text-sm z-20 relative transition-all duration-300 ${
          evaluationStatus.includes("éxito") || evaluationStatus.includes("completada") 
          ? "bg-[#FFF8E6] border-2 border-[#F5B614] text-gray-800"  // Success style
          : evaluationStatus.includes("Error") 
            ? "bg-red-50 border-2 border-red-200 text-red-800"       // Error style
            : "bg-[#FFF8E6] border-2 border-[#F5B614] text-gray-800" // Default/processing style
        }`}>
          <span className="flex items-center justify-center">
            {evaluationStatus.includes("éxito") || evaluationStatus.includes("completada") ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#F5B614]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : evaluationStatus.includes("Error") ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="animate-spin h-5 w-5 mr-2 text-[#F5B614]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {evaluationStatus}
          </span>
        </div>
      )}

      <div className="border-t border-gray-100 pt-4 z-10 relative">
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
            className="flex-1 rounded-2xl border border-gray-200 px-6 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#F5B614] focus:border-transparent font-manrope text-sm w-full bg-gray-50 resize-none min-h-[48px] max-h-32 overflow-y-auto"
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
            className="absolute right-3 bottom-3 bg-[#F5B614] text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-[#E5A604] transition-colors disabled:bg-[#F5B614] disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
}