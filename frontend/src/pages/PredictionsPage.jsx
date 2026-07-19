import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, LayoutGrid, BarChart2 } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import {
  PredictionChart, PredictionSummaryCard, CropSelector,
  TopPredictionsGrid, KeyFactorsPanel, PredictionSkeleton,
  usePrediction, useTopPredictions, useCropsForPredictions
} from '../features/predictions'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '../utils/cn'

export default function PredictionsPage() {
  const [selectedCropId, setSelectedCropId] = useState(null)
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'detail'
  const [forceRefresh, setForceRefresh] = useState(false)

  const queryClient = useQueryClient()

  const { data: crops, isLoading: cropsLoading } = useCropsForPredictions()
  const { data: topPredictions, isLoading: topLoading } = useTopPredictions()
  const {
    data: prediction,
    isLoading: predLoading,
    isFetching: predFetching,
  } = usePrediction({ cropId: selectedCropId })

  const handleCropSelect = (cropId) => {
    setSelectedCropId(cropId)
    setActiveTab('detail')
  }

  const handleRefresh = () => {
    if (!selectedCropId) return
    queryClient.invalidateQueries({ queryKey: ['predictions', 'crop', selectedCropId] })
  }

  const pageActions = (
    <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1">
      <button
        onClick={() => setActiveTab('overview')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
          activeTab === 'overview' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'
        )}
      >
        <LayoutGrid size={14} /> Overview
      </button>
      <button
        onClick={() => setActiveTab('detail')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
          activeTab === 'detail' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'
        )}
      >
        <BarChart2 size={14} /> Detail
      </button>
    </div>
  )

  return (
    <PageWrapper
      title="AI Price Predictions"
      subtitle="7-day price forecasts powered by GPT-4o and historical market data"
      actions={pageActions}
      icon={Sparkles}
    >
      {/* Crop selector (always visible) */}
      <div className="mb-6">
        <CropSelector
          crops={crops || []}
          selectedCropId={selectedCropId}
          onSelect={handleCropSelect}
          isLoading={cropsLoading}
        />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <div className="mb-4">
              <h3 className="text-white font-semibold text-sm">Top Crop Predictions</h3>
              <p className="text-slate-500 text-xs mt-0.5">Click any crop to see detailed 7-day forecast and AI analysis</p>
            </div>
            <TopPredictionsGrid
              predictions={topPredictions || []}
              onSelect={handleCropSelect}
              isLoading={topLoading}
            />
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            {!selectedCropId ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-white font-semibold mb-2">Select a Crop</h3>
                <p className="text-slate-400 text-sm">Choose a crop from the dropdown above to see its 7-day AI price prediction.</p>
              </div>
            ) : (predLoading || predFetching) && !prediction ? (
              <PredictionSkeleton />
            ) : prediction ? (
              <div className="space-y-5">
                <PredictionSummaryCard
                  prediction={prediction}
                  onRefresh={handleRefresh}
                  isRefreshing={predFetching}
                />

                {/* Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-white font-semibold text-sm mb-4">Price Chart — Historical & Predicted</h3>
                  <PredictionChart
                    historicalPrices={prediction.historicalPrices || []}
                    predictions={prediction.predictions || []}
                    mspPrice={prediction.mspPrice}
                    currentPrice={prediction.currentPrice}
                  />
                </div>

                <KeyFactorsPanel
                  reasoning={prediction.reasoning}
                  keyFactors={prediction.keyFactors}
                />
              </div>
            ) : (
              <div className="text-center py-12 text-rose-400">
                Failed to generate prediction. Please try another crop.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
