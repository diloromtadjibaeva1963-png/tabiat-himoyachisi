import React from 'react';
import { WasteReport, WasteType } from '../types';
import { PlasticIcon, GlassIcon, MetalIcon, OrganicIcon, UnknownIcon } from './IconComponents';

interface ReportCardProps {
  report: WasteReport;
  reportedOnText: string;
  locale: string;
}

const wasteTypeDetails: { [key in WasteType]: { icon: React.FC<{ className?: string }>, color: string } } = {
  [WasteType.PLASTIC]: { icon: PlasticIcon, color: 'bg-blue-100 text-blue-800' },
  [WasteType.GLASS]: { icon: GlassIcon, color: 'bg-green-100 text-green-800' },
  [WasteType.METAL]: { icon: MetalIcon, color: 'bg-gray-200 text-gray-800' },
  [WasteType.ORGANIC]: { icon: OrganicIcon, color: 'bg-yellow-100 text-yellow-800' },
  [WasteType.UNKNOWN]: { icon: UnknownIcon, color: 'bg-purple-100 text-purple-800' },
};


const ReportCard: React.FC<ReportCardProps> = ({ report, reportedOnText, locale }) => {
  const details = wasteTypeDetails[report.wasteType];
  const Icon = details.icon;
  
  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <img src={report.imageUrl} alt={`Waste type: ${report.wasteType}`} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${details.color}`}>
            <Icon className="w-5 h-5 mr-2" />
            {report.wasteType}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          {reportedOnText} {report.timestamp.toLocaleString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};

export default ReportCard;