import React from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import type { StatKV } from "./types";

interface TasksByAreaProps {
  data: StatKV[];
}

const TasksByAreaSection: React.FC<TasksByAreaProps> = ({ data }) => {
  const tasksByArea: { [area: string]: { tasks: string[]; count: number } } = {};

  data.forEach((item: StatKV) => {
    if (item.key.startsWith('tasksByArea.') && item.key.endsWith('.tasks')) {
      const area = item.key.split('.')[1];
      if (!tasksByArea[area]) {
        tasksByArea[area] = { tasks: [], count: 0 };
      }
      tasksByArea[area].tasks = item.value ? String(item.value).split(', ') : [];
    }
    if (item.key.startsWith('tasksByArea.') && item.key.endsWith('.count')) {
      const area = item.key.split('.')[1];
      if (!tasksByArea[area]) {
        tasksByArea[area] = { tasks: [], count: 0 };
      }
      tasksByArea[area].count = Number(item.value) || 0;
    }
  });

  const chartData = Object.entries(tasksByArea)
    .map(([area, data]) => ({
      area: area.charAt(0).toUpperCase() + area.slice(1),
      count: data.count,
      tasks: data.tasks,
    }))
    .filter((item) => item.count > 0);

  const areaColors: { [key: string]: string } = {
    Ventas: '#3B82F6',
    Marketing: '#10B981',
    Finanzas: '#F59E0B',
    Administracion: '#8B5CF6',
    Operaciones: '#EF4444',
    'Recursos humanos': '#06B6D4',
    Otro: '#6B7280',
  };

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No se encontraron tareas repetitivas categorizadas para esta empresa.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Distribución de Tareas por Área Funcional
        </h3>
        <p className="text-sm text-gray-600">
          Análisis de las tareas más repetitivas identificadas por área de trabajo
        </p>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="area" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length > 0) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg max-w-xs">
                      <p className="font-semibold">{label}</p>
                      <p className="text-sm text-blue-600">
                        {data.count} tarea{data.count !== 1 ? 's' : ''} identificada{data.count !== 1 ? 's' : ''}
                      </p>
                      {data.tasks.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-600">Ejemplos:</p>
                          <ul className="text-xs text-gray-500 mt-1">
                            {data.tasks.slice(0, 3).map((task: string, idx: number) => (
                              <li key={idx} className="truncate">• {task}</li>
                            ))}
                            {data.tasks.length > 3 && (
                              <li className="text-gray-400">... y {data.tasks.length - 3} más</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {chartData.map((areaData, index) => (
          <Card key={index} className="border-l-4" style={{ borderLeftColor: areaColors[areaData.area] || '#6B7280' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>{areaData.area}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {areaData.count} tarea{areaData.count !== 1 ? 's' : ''}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {areaData.tasks.slice(0, 3).map((task, idx) => (
                  <div key={idx} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    {task}
                  </div>
                ))}
                {areaData.tasks.length > 3 && (
                  <div className="text-xs text-gray-400 italic">
                    ... y {areaData.tasks.length - 3} tarea{areaData.tasks.length - 3 !== 1 ? 's' : ''} adicional{areaData.tasks.length - 3 !== 1 ? 'es' : ''}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">💡 Oportunidades de Automatización</h4>
        <p className="text-sm text-blue-800">
          Las tareas repetitivas identificadas representan excelentes oportunidades para implementar
          soluciones de IA. Las áreas con mayor concentración de tareas podrían beneficiarse de
          capacitación especializada en herramientas de automatización.
        </p>
      </div>
    </div>
  );
};

export default TasksByAreaSection;
