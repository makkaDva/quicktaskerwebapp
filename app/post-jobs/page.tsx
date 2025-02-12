"use client";
import { motion } from 'framer-motion';
import { MapPin, Phone, Wallet, Calendar, Clock, Users, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import supabase from '@/lib/supabase';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter } from 'next/navigation';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { 
    ssr: false,
    loading: () => <div className="h-full bg-gray-100 animate-pulse rounded-xl" />
  }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { 
    ssr: false,
    loading: () => null
  }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const markerIcon = L && new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'animate-bounce-marker'
});

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const countryCodes: { [key: string]: string } = {
  Albania: '+355',
  Andorra: '+376',
  Armenia: '+374',
  Austria: '+43',
  Belarus: '+375',
  Belgium: '+32',
  Bosnia_and_Herzegovina: '+387',
  Bulgaria: '+359',
  Croatia: '+385',
  Cyprus: '+357',
  Czechia: '+420',
  Denmark: '+45',
  Estonia: '+372',
  Finland: '+358',
  France: '+33',
  Germany: '+49',
  Gibraltar: '+350',
  Greece: '+30',
  Hungary: '+36',
  Iceland: '+354',
  Ireland: '+353',
  Italy: '+39',
  Latvia: '+371',
  Liechtenstein: '+423',
  Lithuania: '+370',
  Luxembourg: '+352',
  Malta: '+356',
  Moldova: '+373',
  Monaco: '+377',
  Montenegro: '+382',
  Netherlands: '+31',
  North_Macedonia: '+389',
  Norway: '+47',
  Poland: '+48',
  Portugal: '+351',
  Romania: '+40',
  San_Marino: '+378',
  Serbia: '+381',
  Slovakia: '+421',
  Slovenia: '+386',
  Spain: '+34',
  Sweden: '+46',
  Switzerland: '+41',
  Ukraine: '+380',
  United_Kingdom: '+44',
  Vatican: '+379'
};

interface OpenCageResult {
  formatted: string;
  geometry: { lat: number; lng: number };
  components: {
    city?: string;
    town?: string;
    village?: string;
    road?: string;
    country: string;
  };
}

interface OpenCageResponse {
  results: OpenCageResult[];
}

const PostJob = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<{ formatted: string; city: string; road: string; lat: number; lng: number; country: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState<{ city: string; lat: number; lng: number; country: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+381');
  const [wage, setWage] = useState('');
  const [wageType, setWageType] = useState<'Per day' | 'Per hour'>('Per day');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [numberOfWorkingHours, setNumberOfWorkingHours] = useState(8);
  const [numberOfWorkers, setNumberOfWorkers] = useState(1);
  const [jobDescription, setJobDescription] = useState('');
  const [typeOfWork, setTypeOfWork] = useState('');

  useEffect(() => {
    if (location && location.length >= 3) fetchSuggestions(location);
  }, [location]);

  const fetchSuggestions = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get<OpenCageResponse>('https://api.opencagedata.com/geocode/v1/json', {
        params: { q: query, key: '3de62dbd35ea48b1bd638b609bf11202' }
      });
      setSuggestions(response.data.results.map(result => ({
        formatted: result.formatted,
        city: result.components.city || result.components.town || result.components.village || '',
        road: result.components.road || '',
        lat: result.geometry.lat,
        lng: result.geometry.lng,
        country: result.components.country,
      })));
    } catch (error) {
      alert('Failed to fetch location suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (
    formatted: string,
    city: string,
    road: string,
    lat: number,
    lng: number,
    country: string
  ) => {
    setLocation(formatted);
    setSelectedCity({ city, lat, lng, country });

    const code = countryCodes[country as keyof typeof countryCodes] || '+381';
    setCountryCode(code);
    setSuggestions([]);
  };

  const handleContinue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    switch(step) {
      case 1:
        if (!selectedCity) {
          alert('Pease choose location of the work');
          return;
        }
        break;
      case 2:
        if (!phoneNumber) {
          alert('Please enter your phone number');
          return;
        }
        break;
      case 3:
        if (!wage || !wageType) {
          alert('Please enter wage and wage type');
          return;
        }
        break;
      case 4:
        if (!dateFrom || !dateTo) {
          alert('Please choose date');
          return;
        }
        break;
      case 5:
        if (!numberOfWorkingHours) {
          alert('Please enter number of working hours');
          return;
        }
        break;
      case 6:
        if (!numberOfWorkers) {
          alert('Please enter number of workers needed');
          return;
        }
        break;
      case 7:
        if (!jobDescription) {
          alert('Please enter job description');
          return;
        }
        break;
    }

    if (step < 7) setStep(prev => prev + 1);
  };

  const handleBack = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setStep(prev => Math.max(1, prev - 1));
  };

  const isSubmitting = useRef(false);

  const submitJob = async (user: any) => {
    const jobData = {
      grad: selectedCity?.city || '',
      adresa: location,
      opis: jobDescription,
      dnevnica: parseFloat(wage),
      user_email: user.email,
      broj_telefona: countryCode+phoneNumber,
      broj_radnika: numberOfWorkers,
      latitude: selectedCity?.lat || null,
      longitude: selectedCity?.lng || null,
      wage_type: wageType,
      date_from: dateFrom,
      date_to: dateTo,
      drzava: selectedCity?.country || '',
      hours_per_day: numberOfWorkingHours,
      vrsta_posla: typeOfWork // Add the new field
    };

    const { error } = await supabase.from('jobs').insert(jobData);
    if (error) return alert('Job post failed');
    
    alert('Job posted successfully!');
    resetForm();
    router.push('/find-jobs');
    //window.location.reload();
  };

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      console.log('Message received:', event.data); // Debugging line
      //if (event.origin !== window.location.origin || isSubmitting.current) return;
  
      if (event.data === 'login-success') {
        console.log('Login success message received'); // Debugging line
        isSubmitting.current = true;
  
        // Get the authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          alert('Login failed. Please try again.');
          isSubmitting.current = false;
          return;
        }
  
        try {
          // Use the submitJob function to post the job
          await submitJob(user);
        } catch (error) {
          alert('An error occurred while posting the job.');
        } finally {
          isSubmitting.current = false;
        }
      }
    };
  
    // Add the event listener for messages
    window.addEventListener('message', handleMessage);
  
    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [submitJob]); // Empty dependency array ensures this runs only onc

  const resetForm = () => {
    setStep(1);
    setLocation('');
    setSelectedCity(null);
    setPhoneNumber('');
    setWage('');
    setDateFrom('');
    setDateTo('');
    setNumberOfWorkingHours(8);
    setNumberOfWorkers(1);
    setJobDescription('');
  };

  const handleFinish = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isSubmitting.current) return;
  
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      isSubmitting.current = true;
      window.open('/login', '_blank', 'width=500,height=600');
      return;
    }
  
    try {
      isSubmitting.current = true;
      
      // Use the submitJob function instead of direct submission
      await submitJob(user);
  
      //alert('Job posted successfully!');
      resetForm();
      //router.push('/find-jobs');
    
    } catch (error) {
      alert('An error occurred while posting the job.');
    } finally {
      isSubmitting.current = false;
    }
  };

  const generateCalendarDays = (month: number, year: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    
    for (let i = 0; i < date.getDay(); i++) {
      days.push({ date: new Date(year, month, -i), isCurrentMonth: false, isDisabled: true });
    }

    while (date.getMonth() === month) {
      days.push({ 
        date: new Date(date),
        isCurrentMonth: true,
        isDisabled: date < new Date(new Date().setHours(0,0,0,0))
      });
      date.setDate(date.getDate() + 1);
    }

    return days.reverse().slice(0, 35).reverse();
  };
  
  const isDateSelected = (date: Date) => {
    return date.toDateString() === new Date(dateFrom).toDateString() || 
           date.toDateString() === new Date(dateTo).toDateString();
  };
  
  const isDateInRange = (date: Date) => {
    if (!dateFrom || !dateTo) return false;
    return date >= new Date(dateFrom) && date <= new Date(dateTo);
  };
  
  const handleDateClick = (clickedDate: Date) => {
    if (!dateFrom || dateTo) {
      setDateFrom(clickedDate.toISOString());
      setDateTo('');
    } else {
      const startDate = new Date(dateFrom);
      if (clickedDate < startDate) {
        setDateFrom(clickedDate.toISOString());
        setDateTo(startDate.toISOString());
      } else {
        setDateTo(clickedDate.toISOString());
      }
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid md:grid-cols-2 gap-8 w-full">
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city, street and number (example: Beograd Knez Mihajlova 6)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                />
                {isLoading && (
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  </div>
                )}
              </div>
              {suggestions.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 hover:bg-green-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleSelect(
                        suggestion.formatted,
                        suggestion.city,
                        suggestion.road,
                        suggestion.lat,
                        suggestion.lng,
                        suggestion.country
                      )}
                    >
                      <p className="text-gray-700">{suggestion.formatted}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            <div className="h-[400px] rounded-2xl overflow-hidden border border-gray-200">
              <MapContainer
                key={selectedCity ? `${selectedCity.lat}-${selectedCity.lng}` : 'default-map'}
                center={selectedCity ? [selectedCity.lat, selectedCity.lng] : [44.7866, 20.4489]}
                zoom={selectedCity ? 13 : 5}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {selectedCity && (
                  <Marker 
                    position={[selectedCity.lat, selectedCity.lng]} 
                    icon={markerIcon}
                  >
                    <Popup className="custom-popup" closeButton={false}>
                      <div className="font-semibold text-green-600">
                        <MapPin className="inline mr-2" size={18} />
                        {selectedCity.city}
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex gap-3 items-center justify-center w-full max-w-md">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
            >
              {Object.entries(countryCodes).map(([country, code]) => (
                <option key={country} value={code}>{country} ({code})</option>
              ))}
            </select>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone number"
              className="flex-2 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all mx-auto"
            />
          </div>
        );

      case 3:
        return (
          <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
            <div className="space-y-2">
              <label className="text-gray-600 font-medium">Wage amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={wage}
                  onChange={(e) => setWage(e.target.value)}
                  placeholder="Enter amount (example 100)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all pr-12"
                />
                <span className="absolute right-4 top-3.5 text-gray-400">€</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-gray-600 font-medium">Wage type</label>
              <select
                value={wageType}
                onChange={(e) => setWageType(e.target.value as 'Per day' | 'Per hour')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              >
                <option value="Per day">Per day</option>
                <option value="Per hour">Per hour</option>
              </select>
            </div>
          </div>
        );

        case 4:
          return (
            <div className="w-full max-w-4xl space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Trenutni mesec */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-green-100 p-3 rounded-lg">
                    <h3 className="font-semibold text-green-700">
                      {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
                    </h3>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="text-center text-sm text-green-600 font-medium p-1">
                        {day}
                      </div>
                    ))}
                    {generateCalendarDays(new Date().getMonth(), new Date().getFullYear()).map((day, index) => (
                      <button
                        key={index}
                        onClick={() => handleDateClick(day.date)}
                        disabled={day.isDisabled}
                        className={`
                          p-2 text-sm rounded-lg transition-all
                          ${day.isCurrentMonth ? 
                            (isDateSelected(day.date) ? 'bg-green-600 text-white' : 'hover:bg-green-100 text-gray-600') 
                            : 'text-gray-400'}
                          ${isDateInRange(day.date) && 'bg-green-400 text-white'}
                        `}
                      >
                        {day.date.getDate()}
                      </button>
                    ))}
                  </div>
                </div>
        
                {/* Sledeći mesec */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-green-100 p-3 rounded-lg">
                    <h3 className="font-semibold text-green-700">
                      {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleString('default', { month: 'long' })} 
                      {new Date(new Date().setMonth(new Date().getMonth() + 1)).getFullYear()}
                    </h3>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="text-center text-sm text-green-600 font-medium p-1">
                        {day}
                      </div>
                    ))}
                    {generateCalendarDays(new Date().getMonth() + 1, new Date().getFullYear()).map((day, index) => (
                      <button
                        key={index}
                        onClick={() => handleDateClick(day.date)}
                        disabled={day.isDisabled}
                        className={`
                          p-2 text-sm rounded-lg transition-all
                          ${day.isCurrentMonth ? 
                            (isDateSelected(day.date) ? 'bg-green-600 text-white' : 'hover:bg-green-100 text-gray-600') 
                            : 'text-gray-400'}
                          ${isDateInRange(day.date) && 'bg-green-400 text-white'}
                        `}
                      >
                        {day.date.getDate()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
        
              <div className="grid md:grid-cols-2 gap-4 bg-green-50 p-4 rounded-xl">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-green-700">Odabrani period:</label>
                  <div className="font-semibold text-green-600">
                    {dateFrom ? new Date(dateFrom).toLocaleDateString() : 'Nije izabrano'} - 
                    {dateTo ? new Date(dateTo).toLocaleDateString() : 'Nije izabrano'}
                  </div>
                </div>
                <button 
                  onClick={() => { setDateFrom(''); setDateTo(''); }}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          );

          case 5:
  return (
    <div className="w-full max-w-md mx-auto space-y-10 px-4">
      {/* Naslov */}
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Enter number of working hours
      </h2>

      {/* Brojač sa dugmadima */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => setNumberOfWorkingHours(prev => Math.max(1, prev - 1))}
          className="p-4 rounded-full bg-green-100 hover:bg-green-200 transition-colors shadow-sm"
        >
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <div className="text-center space-y-2">
          <div className="text-6xl font-bold text-green-600">{numberOfWorkingHours}</div>
          {/* <span className="text-gray-500 text-sm block">maksimalno</span> */}
        </div>

        <button
          onClick={() => setNumberOfWorkingHours(prev => Math.min(24, prev + 1))}
          className="p-4 rounded-full bg-green-100 hover:bg-green-200 transition-colors shadow-sm"
        >
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Opcije */}
      <div className="space-y-6 pt-6">
        <h3 className="text-lg font-semibold text-gray-700 text-center">Advice</h3>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 mx-auto">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
            <div className="text-center">
              <p className="text-gray-600">
                8 is hours optimal<br /> 
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 mx-auto">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
            <div className="text-center">
              <p className="text-gray-600">
                24 hours is maximum<br />
                
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  ); 

  case 6:
    return (
      <div className="w-full max-w-md mx-auto space-y-10 px-4">
        {/* Naslov */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          How many workers do you need?
        </h2>
  
        {/* Brojač sa dugmadima */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setNumberOfWorkers(prev => Math.max(1, prev - 1))}
            className="p-4 rounded-full bg-green-100 hover:bg-green-200 transition-colors shadow-sm"
          >
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
  
          <div className="text-center space-y-2">
            <div className="text-6xl font-bold text-green-600">{numberOfWorkers}</div> 
          </div>
  
          <button
            onClick={() => setNumberOfWorkers(prev => Math.min(50, prev + 1))}
            className="p-4 rounded-full bg-green-100 hover:bg-green-200 transition-colors shadow-sm"
          >
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
  
        {/* Opcije */}
        <div className="space-y-6 pt-6">
          
          <div className="flex flex-col gap-4">
  
            <div className="flex items-start gap-3 mx-auto">
              <div className="text-center">

              </div>
            </div>
          </div>
        </div>
      </div>
    );

    case 7:
      return (
        <div className="w-full max-w-2xl mx-auto flex justify-center items-center h-full">
          <div className="space-y-4 w-full">
            {/* Type of Work Input */}
            <div className="space-y-2">
              <label className="text-gray-600 font-medium">Type of Work</label>
              <input
                type="text"
                value={typeOfWork}
                onChange={(e) => setTypeOfWork(e.target.value)}
                placeholder="Type of work (1 or 2 words, e.g., cleaning)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>
    
            {/* Job Description Textarea */}
            <div className="space-y-2">
              <label className="text-gray-600 font-medium">Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Describe the job, requirements, and any important information"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all h-48"
              />
            </div>
          </div>
        </div>
      );

      default:
        return null;
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className={`${step === 1 ? 'invisible' : 'visible'} bg-white text-green-600 px-6 py-2 rounded-lg text-md font-medium hover:bg-green-50 transition-all shadow-sm flex items-center gap-2 border border-green-100`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </motion.button>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <div 
                  key={s}
                  className={`w-2 h-2 rounded-full ${step >= s ? 'bg-green-600' : 'bg-green-200'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              {step === 1 && <MapPin className="w-6 h-6 text-green-600" />}
              {step === 2 && <Phone className="w-6 h-6 text-green-600" />}
              {step === 3 && <Wallet className="w-6 h-6 text-green-600" />}
              {step === 4 && <Calendar className="w-6 h-6 text-green-600" />}
              {step === 5 && <Clock className="w-6 h-6 text-green-600" />}
              {step === 6 && <Users className="w-6 h-6 text-green-600" />}
              {step === 7 && <FileText className="w-6 h-6 text-green-600" />}
              <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                {step === 1 && "Job location"}
                {step === 2 && "Phone number"}
                {step === 3 && "Wage"}
                {step === 4 && "Date"}
                {step === 5 && "Working time"}
                {step === 6 && "Number of workers"}
                {step === 7 && "Job description"}
              </h2>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={step === 7 ? handleFinish : handleContinue}
            className="bg-gradient-to-br from-green-600 to-emerald-500 text-white px-6 py-2 rounded-lg text-md font-medium hover:from-green-700 hover:to-emerald-600 transition-all shadow-md flex items-center gap-2"
          >
            {step === 7 ? 'Finish posting job' : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        <motion.div
          key={step}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-green-100 w-full"
        >
          {renderStepContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default PostJob;