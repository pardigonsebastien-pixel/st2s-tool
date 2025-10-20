import { Undo2, ShieldOff, ShieldCheck } from 'lucide-react';
import { ClickValue, EleveParticipation } from '../types/participation';
import { Eleve } from '../lib/supabase';

interface ParticipationPaletteProps {
  eleve: Eleve;
  participation: EleveParticipation;
  onAddClick: (eleveId: string, value: ClickValue) => void;
  onUndo: (eleveId: string) => void;
  onToggleCap: (eleveId: string) => void;
}

const CLICK_VALUES: ClickValue[] = [-2, -1, -0.5, 0, 0.5, 1, 2, 3];

export function ParticipationPalette({
  eleve,
  participation,
  onAddClick,
  onUndo,
  onToggleCap
}: ParticipationPaletteProps) {
  const formatValue = (value: number): string => {
    if (value > 0) return `+${value}`;
    return value.toString();
  };

  const getButtonColor = (value: ClickValue): string => {
    if (value < 0) return 'bg-red-500 hover:bg-red-600 text-white';
    if (value === 0) return 'bg-gray-400 hover:bg-gray-500 text-white';
    if (value <= 1) return 'bg-green-500 hover:bg-green-600 text-white';
    return 'bg-blue-500 hover:bg-blue-600 text-white';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 uppercase">{eleve.nom}</h3>
          <p className="text-sm text-gray-600 lowercase">{eleve.prenom}</p>
          <p className="text-xs text-gray-500 mt-1">{eleve.eleve_id}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleCap(eleve.eleve_id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              participation.cap_applied
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
            }`}
            title={participation.cap_applied ? 'Cap ON (±3)' : 'Cap OFF'}
          >
            {participation.cap_applied ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>ON</span>
              </>
            ) : (
              <>
                <ShieldOff className="w-4 h-4" />
                <span>OFF</span>
              </>
            )}
          </button>
          <button
            onClick={() => onUndo(eleve.eleve_id)}
            disabled={participation.clicks.length === 0}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            title="Annuler le dernier clic"
          >
            <Undo2 className="w-4 h-4" />
            <span>Undo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-2 mb-4">
        {CLICK_VALUES.map((value) => (
          <button
            key={value}
            onClick={() => onAddClick(eleve.eleve_id, value)}
            className={`px-3 py-2 rounded-md font-semibold text-sm transition-colors ${getButtonColor(value)}`}
          >
            {formatValue(value)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-3 text-sm">
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs text-gray-600 mb-1">PreTotal</div>
          <div className="font-semibold text-gray-900">{participation.pre_total.toFixed(1)}</div>
        </div>
        <div className="bg-blue-50 p-2 rounded">
          <div className="text-xs text-blue-600 mb-1">SessionRaw</div>
          <div className="font-semibold text-blue-900">{formatValue(participation.session_raw)}</div>
        </div>
        <div className="bg-green-50 p-2 rounded">
          <div className="text-xs text-green-600 mb-1">SessionCapped</div>
          <div className="font-semibold text-green-900">{formatValue(participation.session_capped)}</div>
        </div>
        <div className={`p-2 rounded ${participation.cap_applied ? 'bg-green-50' : 'bg-orange-50'}`}>
          <div className={`text-xs mb-1 ${participation.cap_applied ? 'text-green-600' : 'text-orange-600'}`}>
            Cap
          </div>
          <div className={`font-semibold ${participation.cap_applied ? 'text-green-900' : 'text-orange-900'}`}>
            {participation.cap_applied ? 'ON' : 'OFF'}
          </div>
        </div>
        <div className="bg-purple-50 p-2 rounded">
          <div className="text-xs text-purple-600 mb-1">PostTotal</div>
          <div className="font-semibold text-purple-900">{participation.post_total.toFixed(1)}</div>
        </div>
      </div>

      {participation.clicks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-600 mb-1">Historique: {participation.clicks.length} clic(s)</div>
          <div className="flex flex-wrap gap-1">
            {participation.clicks.map((click, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  click.value < 0
                    ? 'bg-red-100 text-red-800'
                    : click.value === 0
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {formatValue(click.value)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
