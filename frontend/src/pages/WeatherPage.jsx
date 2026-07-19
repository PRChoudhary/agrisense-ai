import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CloudSun, RefreshCw, Globe } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import {
  CurrentWeatherCard, ForecastRow, FarmingRiskCard,
  CitySearch, IndiaOverviewGrid,
  useWeather, useIndiaOverview
} from '../features/weather'
import { cn } from '../utils/cn'

export default function WeatherPage() {
  const [location, setLocation] = useState({ city: 'Delhi', state: 'Delhi' })
  const [activeTab, setActiveTab] = useState('current') // 'current' | 'overview'

  const { data: weather, isLoading, isFetching, refetch, isError } = useWeather(location)
  const { data: overview, isLoading: overviewLoading } = useIndiaOverview()

  const handleSearch = (loc) => {
    setLocation(loc)
    setActiveTab('current')
  }

  const handleCityClick = (city) => {
    setLocation({ city: city.location, state: city.state })
    setActiveTab('current')
  }

  const pageActions = (
    <div className="flex items-center gap-3">
      {/* Tab toggle */}
      <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('current')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
            activeTab === 'current' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'
          )}
        >
          <CloudSun size={14} /> Current
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
            activeTab === 'overview' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'
          )}
        >
          <Globe size={14} /> India
        </button>
      </div>

      <button
        onClick={() => refetch()}
        disabled={isFetching}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-sm font-medium transition-all disabled:opacity-50"
      >
        <RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />
        Refresh
      </button>
    </div>
  )

  return (
    <PageWrapper
      title="Weather Intelligence"
      subtitle="Live weather data with AI-powered farming risk assessment"
      actions={pageActions}
      icon={CloudSun}
    >
      {/* Search */}
      <div className="mb-6">
        <CitySearch
          onSearch={handleSearch}
          currentCity={location.city}
          isLoading={isLoading || isFetching}
        />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'current' ? (
          <motion.div
            key="current"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Loading state */}
            {(isLoading || isFetching) && !weather && (
              <div className="space-y-5">
                <div className="h-72 rounded-3xl bg-slate-800 animate-pulse" />
                <div className="h-52 rounded-2xl bg-slate-800 animate-pulse" />
                <div className="h-40 rounded-2xl bg-slate-800 animate-pulse" />
              </div>
            )}

            {/* Error state */}
            {isError && !weather && (
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <p>Failed to load weather data. Make sure the backend is running.</p>
              </div>
            )}

            {/* Weather data */}
            {weather && (
              <>
                <CurrentWeatherCard weather={weather} />

                {/* Forecast */}
                {weather.forecast && weather.forecast.length > 0 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <ForecastRow forecast={weather.forecast} />
                  </div>
                )}

                {/* Farming Risk */}
                <FarmingRiskCard weather={weather} />
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4">
              <h3 className="text-white font-semibold text-sm">India Agriculture Weather Overview</h3>
              <p className="text-slate-500 text-xs mt-0.5">Click any city to see detailed forecast</p>
            </div>
            <IndiaOverviewGrid
              cities={overview || []}
              onCityClick={handleCityClick}
              isLoading={overviewLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
