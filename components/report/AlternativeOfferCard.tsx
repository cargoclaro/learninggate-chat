import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';
import { GraduationCap, AlertTriangle, CheckCircle, Shield, Users } from 'lucide-react';
import { StatKV, ROIData, MaturityData } from './types';

interface AlternativeOfferCardProps {
  companyName: string; // Though not directly used in JSX, it's part of the pattern and might be for future logging/context
  stats: StatKV[];
  roi: ROIData;
  maturity: MaturityData;
  singleValue: (stats: StatKV[], key: string, decimals?: number) => number;
}

export const AlternativeOfferCard: React.FC<AlternativeOfferCardProps> = ({ 
  stats,
  roi, 
  maturity, 
  singleValue 
}) => {
  const employeeCount = Math.max(30, roi.employeeCount);
  const isMinimumTeam = roi.employeeCount < 30;
  const potentialGain = (roi.potential - roi.current) * 0.5;
  const pricePerEmployee = 1499;
  const totalPrice = employeeCount * pricePerEmployee;

  return (
    <Card className="border-2 border-blue-500 bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-3">
            <Image 
              src="/logo.png" 
              alt="Learning Gate" 
              width={144} 
              height={32} 
              quality={100}
              priority
              className="w-36 h-8 object-contain"
            />
          </div>
          <div className="flex justify-center items-center gap-2 text-sm text-gray-600 font-medium mb-2">
            <GraduationCap className="w-5 h-5" />
            PROGRAMA CHATGPT BÁSICO
          </div>
          <h3 className="text-2xl font-bold mb-1">
            De {maturity.level} a Intermedio en 60 Días
          </h3>
          <p className="text-base text-muted-foreground">
            Para {employeeCount} empleados — Certificación ChatGPT
          </p>
        </div>

        {isMinimumTeam && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-700 text-base">Programa Empresarial</span>
            </div>
            <div className="text-sm text-yellow-600">
              Programa diseñado para equipos de mínimo 30 empleados.
              <span className="font-medium"> Cotización basada en 30 empleados.</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <h4 className="text-red-700 font-medium text-lg flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5" /> Sin el programa
            </h4>
            <ul className="text-base text-red-600 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-red-500">💸</span>
                <span>Pierdes ${Math.round(roi.opportunity * 0.5).toLocaleString()} / mes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">🕒</span>
                <span>Ahorro actual: {roi.currentMinutesSavedPerDay.toFixed(1)} min/día</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">📉</span>
                <span>Skill ChatGPT: {singleValue(stats, "avgPromptSkill", 1).toFixed(1)}/5</span>
              </li>
            </ul>
            <div className="border-t border-red-200 mt-3 pt-3 text-center">
              <div className="text-base text-red-600 mb-2">Costo anual de oportunidad</div>
              <div className="text-3xl font-bold text-red-700 bg-white rounded-lg py-2 px-4">${Math.round(roi.opportunity * 0.5 * 12).toLocaleString()}</div>
            </div>
          </div>
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <h4 className="text-green-700 font-medium text-lg flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5" /> Con el programa
            </h4>
            <ul className="text-base text-green-600 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-500">📈</span>
                <span>Ganas ${Math.round(roi.current + potentialGain).toLocaleString()} / mes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">⏱️</span>
                <span>60+ min/día ahorrados</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">🏆</span>
                <span>Skill ChatGPT: 4/5 intermedio</span>
              </li>
            </ul>
            <div className="border-t border-green-200 mt-3 pt-3 text-center">
              <div className="text-base text-green-600 mb-2">Beneficio anual total</div>
              <div className="text-3xl font-bold text-green-700 bg-white rounded-lg py-2 px-4">${Math.round((roi.current + potentialGain) * 12).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center mb-4">
          <div className="text-sm text-gray-600 mb-1">Precio del programa</div>
          <div className="text-2xl font-bold text-gray-900">${totalPrice.toLocaleString()}</div>
          <div className="text-sm text-gray-500">${pricePerEmployee} por empleado</div>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-center gap-2 text-green-700 text-base font-medium mb-2">
            <Shield className="w-5 h-5" /> Garantía Doble
          </div>
          <ul className="text-sm text-green-600 space-y-1">
            <li>✓ Recuperas ${Math.round(potentialGain).toLocaleString()} o reembolso</li>
            <li>✓ Skill sube a 4/5 o extensión gratis</li>
          </ul>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg mb-4 text-sm text-blue-600">
          Programa de entrada — <strong>Disponible inmediatamente</strong>
        </div>

        <div className="text-center">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 text-base">
            EMPEZAR AHORA
          </button>
          <div className="text-sm text-muted-foreground mt-2">
            Incluye acceso inmediato y soporte básico
          </div>
        </div>

        <div className="border-t pt-4 text-center mt-6">
          <div className="text-sm text-muted-foreground mb-2">
            <span className="font-medium text-blue-600">+200 empleados</span> capacitados en <span className="font-medium">ChatGPT básico</span>
          </div>
          <div className="flex justify-center items-center gap-4 text-muted-foreground text-sm">
            <span>STARTUP CO</span>
            <span>DIGITAL PLUS</span>
            <span>GROWTH SA</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 