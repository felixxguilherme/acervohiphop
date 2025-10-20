"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

const DateRangePicker = ({ onDateRangeChange, startDate = '', endDate = '' }) => {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [quickRange, setQuickRange] = useState('');

  const quickRanges = [
    { label: 'Últimos 30 anos', value: '30y', start: '1994-01-01', end: '2024-12-31' },
    { label: 'Década de 90', value: '90s', start: '1990-01-01', end: '1999-12-31' },
    { label: 'Década de 2000', value: '2000s', start: '2000-01-01', end: '2009-12-31' },
    { label: 'Década de 2010', value: '2010s', start: '2010-01-01', end: '2019-12-31' },
    { label: 'Década de 2020', value: '2020s', start: '2020-01-01', end: '2029-12-31' },
    { label: 'Era Dourada (1994-2004)', value: 'golden', start: '1994-01-01', end: '2004-12-31' }
  ];

  const handleStartDateChange = (date) => {
    setLocalStartDate(date);
    setQuickRange(''); // Limpar seleção rápida ao usar datas customizadas
    onDateRangeChange?.(date, localEndDate);
  };

  const handleEndDateChange = (date) => {
    setLocalEndDate(date);
    setQuickRange(''); // Limpar seleção rápida ao usar datas customizadas
    onDateRangeChange?.(localStartDate, date);
  };

  const handleQuickRangeSelect = (range) => {
    setQuickRange(range.value);
    setLocalStartDate(range.start);
    setLocalEndDate(range.end);
    onDateRangeChange?.(range.start, range.end);
  };

  const clearDates = () => {
    setLocalStartDate('');
    setLocalEndDate('');
    setQuickRange('');
    onDateRangeChange?.('', '');
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const isRangeActive = localStartDate || localEndDate;

  return (
    <div className="bg-white border-[3px] border-black p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold font-sometype-mono text-black uppercase">
          📅 Filtro por Período
        </h3>
        
        {isRangeActive && (
          <button
            onClick={clearDates}
            className="px-4 py-2 bg-black text-white font-bold border-[3px] border-black hover:bg-gray-800 transition-colors font-sometype-mono uppercase"
          >
            Limpar Datas
          </button>
        )}
      </div>

      {/* Seleções Rápidas */}
      <div className="mb-6">
        <div className="text-black font-bold text-xs mb-3 font-sometype-mono uppercase">Períodos Pré-definidos:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {quickRanges.map((range) => (
            <motion.button
              key={range.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickRangeSelect(range)}
              className={`
                px-3 py-2 text-sm border-[3px] transition-colors font-sometype-mono
                ${quickRange === range.value
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-100'
                }
              `}
            >
              {range.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Seletores de Data Customizada */}
      <div className="mb-6">
        <div className="text-black font-bold text-xs mb-3 font-sometype-mono uppercase">Período Personalizado:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-black text-xs font-bold mb-2 font-sometype-mono uppercase">Data Inicial:</label>
            <input
              type="date"
              value={localStartDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              max={localEndDate || '2024-12-31'}
              className="w-full px-3 py-2 bg-white border-[3px] border-black text-black focus:outline-none font-sometype-mono"
            />
          </div>
          
          <div>
            <label className="block text-black text-xs font-bold mb-2 font-sometype-mono uppercase">Data Final:</label>
            <input
              type="date"
              value={localEndDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              min={localStartDate || '1990-01-01'}
              max="2024-12-31"
              className="w-full px-3 py-2 bg-white border-[3px] border-black text-black focus:outline-none font-sometype-mono"
            />
          </div>
        </div>
      </div>

      {/* Visualização do Período Atual */}
      {isRangeActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-100 border-[3px] border-black p-4 mb-6"
        >
          <div className="text-black font-bold text-xs mb-2 font-sometype-mono uppercase">📍 Período Selecionado:</div>
          <div className="text-black text-sm font-sometype-mono">
            {localStartDate && localEndDate ? (
              <span>
                De <strong>{formatDateForDisplay(localStartDate)}</strong> até <strong>{formatDateForDisplay(localEndDate)}</strong>
              </span>
            ) : localStartDate ? (
              <span>
                A partir de <strong>{formatDateForDisplay(localStartDate)}</strong>
              </span>
            ) : localEndDate ? (
              <span>
                Até <strong>{formatDateForDisplay(localEndDate)}</strong>
              </span>
            ) : null}
          </div>
          
          {quickRange && (
            <div className="text-black/70 text-xs mt-1 font-sometype-mono">
              {quickRanges.find(r => r.value === quickRange)?.label}
            </div>
          )}
        </motion.div>
      )}

      {/* Cronologia Hip Hop DF */}
      <div className="mt-6 pt-4 border-t-[3px] border-black">
        <div className="text-black font-bold text-xs mb-3 font-sometype-mono uppercase">🎵 Cronologia Hip Hop DF:</div>
        <div className="space-y-2 text-xs text-black font-sometype-mono">
          <div className="flex justify-between">
            <span className="font-bold">1994</span>
            <span>Início das primeiras composições (Dino Black)</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">1999</span>
            <span>Matéria na Revista Cavaco sobre GOG</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">2004</span>
            <span>Matéria no Correio Braziliense - "Rimas Sociais"</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">2025</span>
            <span>Digitalização e catalogação do acervo</span>
          </div>
        </div>
      </div>

      {/* Dicas */}
      <div className="mt-4 pt-4 border-t-[3px] border-black text-center text-xs text-black font-sometype-mono uppercase">
        💡 Use filtros de data para encontrar documentos de períodos específicos do Hip Hop DF
      </div>
    </div>
  );
};

export default DateRangePicker;