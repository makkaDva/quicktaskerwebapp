"use client"; // Ensure this is the first line
import { CSSProperties } from 'react';
import supabase from '@/lib/supabase';
import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making API requests to OpenCage Geocoder
import dynamic from 'next/dynamic';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // For the back and continue button icons
import L from 'leaflet'; // Import Leaflet for custom marker icon

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Custom marker icon
const markerIcon = L && new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Country code mapping
const countryCodes: { [key: string]: string } = {
  serbia: '+381',
  germany: '+49',
  france: '+33',
  italy: '+39',
  spain: '+34',
  // Add more country codes as needed
};

interface OpenCageResult {
  formatted: string; // e.g., "Smederevo, Serbia"
  geometry: {
    lat: number;
    lng: number;
  };
  components: {
    city?: string; // City name
    town?: string; // Town name
    village?: string; // Village name
    road?: string; // Road or street name
    country: string; // Country name
  };
}

interface OpenCageResponse {
  results: OpenCageResult[];
}

const PostJob = () => {
  const [numberOfWorkingHours, setNumberOfWorkingHours] = useState('');
  const [location, setLocation] = useState(''); // The combined city and street input
  const [suggestions, setSuggestions] = useState<{ formatted: string; city: string; road: string; lat: number; lng: number; country: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState<{ city: string; lat: number; lng: number; country: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Step counter
  const [phoneNumber, setPhoneNumber] = useState(''); // Phone number input
  const [wage, setWage] = useState(''); // Wage input
  const [wageType, setWageType] = useState<'Per day' | 'Per hour'>('Per day'); // Wage type
  const [dateFrom, setDateFrom] = useState(''); // Date from
  const [dateTo, setDateTo] = useState(''); // Date to
  const [numberOfWorkers, setNumberOfWorkers] = useState(''); // Number of workers
  const [jobDescription, setJobDescription] = useState(''); // Job description
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Replace with actual login check logic
  const [countryCode, setCountryCode] = useState('+381'); // Default country code
  


  useEffect(() => {
    if (location) {
      fetchSuggestions(location);
    }
  }, [location]);

  useEffect(() => {
    if (selectedCity) {
      const code = countryCodes[selectedCity.country.toLowerCase()] || '+381'; // Default to Serbia if country not found
      setCountryCode(code);
    }
  }, [selectedCity]);

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) return; // Only search if query length is >= 3

    setIsLoading(true);

    try {
      const response = await axios.get<OpenCageResponse>('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          q: query,
          key: '3de62dbd35ea48b1bd638b609bf11202', // Replace with your OpenCage API Key
          language: 'en',
        },
      });

      if (response.data.results.length === 0) {
        setSuggestions([]); // Clear any old suggestions
        return;
      }

      const results = response.data.results.map((result) => ({
        formatted: result.formatted, // Full formatted address
        city: result.components.city || result.components.town || result.components.village || '', // City, town, or village
        road: result.components.road || '', // Road or street name
        lat: result.geometry.lat,
        lng: result.geometry.lng,
        country: result.components.country.toLowerCase(),
      }));

      setSuggestions(results);

    } catch (error) {
      console.error('Error fetching suggestions:', error);
      alert('Failed to fetch location suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (formatted: string, city: string, road: string, lat: number, lng: number, country: string) => {
    // Use the city name for the `grad` column
    const cityName = city;

    // Use the full formatted address for the `adresa` column
    const fullAddress = formatted;

    setLocation(fullAddress); // Update the location input with the full address
    setSelectedCity({ city: cityName, lat, lng, country }); // Store only the city name in selectedCity
    setSuggestions([]); // Clear suggestions after selection
  };

  const handleContinue = () => {
    if (step === 1 && !selectedCity) {
      alert('Please select a city');
      return;
    }

    if (step === 2 && !phoneNumber) {
      alert('Please enter your phone number');
      return;
    }

    if (step === 3 && (!wage || !wageType)) {
      alert('Please enter wage and select wage type');
      return;
    }

    if (step === 4 && (!dateFrom || !dateTo)) {
      alert('Please select both start and end dates');
      return;
    }

    if (step === 5 && !numberOfWorkingHours) {
      alert('Please enter the number of working hours');
      return;
    }

    if (step === 6 && !numberOfWorkers) {
      alert('Please enter the number of workers');
      return;
    }

    if (step === 7 && !jobDescription) {
      alert('Please enter a job description');
      return;
    }

    setStep(step + 1); // Move to the next step
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1); // Go back to the previous step
    }
  };

  const handleFinish = async () => {
    const { data, error } = await supabase.auth.getUser();

    // if (error) {
    //   console.error("Error fetching user:", error.message);
    //   alert("Error checking authentication. Please try again.");
    //   return;
    // }

    if (!data.user) {
      alert("You are not logged in. Please log in to post a job.");
      window.open('/login', '_blank', 'width=500,height=600'); // Open login popup
      return;
    }

    // Prepare job data to match your table schema
    const jobData = {
      grad: selectedCity?.city || '', // City name (extracted from the full address)
      adresa: location, // Full address (from the location input)
      opis: jobDescription, // Job description
      dnevnica: parseFloat(wage), // Wage (numeric)
      user_email: data.user.email, // User's email
      broj_telefona: phoneNumber, // Phone number
      broj_radnika: parseInt(numberOfWorkers, 10), // Number of workers
      latitude: selectedCity?.lat || null, // Latitude
      longitude: selectedCity?.lng || null, // Longitude
      wage_type: wageType, // Wage type (e.g., 'Per day' or 'Per hour')
      date_from: dateFrom, // Start date
      date_to: dateTo, // End date
      drzava: selectedCity?.country || '', // Country
      hours_per_day: parseInt(numberOfWorkingHours, 10), // Hours per day
    };

    // Insert job data into Supabase
    const { data: jobInsertData, error: jobInsertError } = await supabase
      .from('jobs')
      .insert([jobData])
      .select();

    if (jobInsertError) {
      console.error("Error inserting job:", jobInsertError.message);
      alert("Failed to post job. Please try again.");
      return;
    }

    // Success
    console.log("Job posted successfully:", jobInsertData);
    alert("Job posted successfully!");
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div style={styles.stepContainer}>
            <div style={styles.leftContainer}>
              <div style={styles.locationText}>
                Na kojoj <span style={styles.greenText}>lokaciji</span> nudite posao?
              </div>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city, street (e.g., Beograd Knez Mihajlova 6)"
                  style={styles.input}
                />
                <button 
                  style={styles.continueButtonCase1} 
                  onClick={handleContinue}
                >
                  Continue <FaArrowRight style={styles.arrowIcon} />
                </button>
              </div>
        
              {isLoading && <div style={styles.loading}>Loading...</div>}
        
              <div style={styles.suggestionList}>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(
                      suggestion.formatted, 
                      suggestion.city, 
                      suggestion.road, 
                      suggestion.lat,
                      suggestion.lng,
                      suggestion.country
                    )}
                    style={styles.suggestionItem}
                  >
                    {suggestion.formatted}
                  </div>
                ))}
              </div>
            </div>
        
            <div style={styles.rightContainer}>
              <div style={styles.mapContainer}>
                <MapContainer
                  key={selectedCity ? selectedCity.lat + selectedCity.lng : 'default'}
                  center={selectedCity ? [selectedCity.lat, selectedCity.lng] : [51.505, -0.09]}
                  zoom={selectedCity ? 13 : 5}
                  style={styles.map}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {selectedCity && (
                    <Marker position={[selectedCity.lat, selectedCity.lng]} icon={markerIcon}>
                      <Popup>{selectedCity.city}</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </div>
          </div>
        );
        
      
      

        case 2:
          return (
            <div style={styles.stepContainer}>
              <div style={styles.inputGroup}>
                <label style={styles.phoneLabel}>
                  Enter your <span style={styles.greenText}>phone number</span>
                </label>
                <div style={styles.phoneInputContainer}>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    style={styles.select}
                  >
                    {Object.entries(countryCodes).map(([country, code]) => (
                      <option key={country} value={code}>
                        {country} ({code})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                    style={styles.phoneInput}
                  />
                </div>
              </div>
            </div>
          );

      case 3:
        return (
          <div style={styles.stepContainer}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Wage</label>
              <input
                type="text"
                value={wage}
                onChange={(e) => setWage(e.target.value)}
                placeholder="Enter wage (e.g., 1000€)"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Wage Type</label>
              <select
                value={wageType}
                onChange={(e) => setWageType(e.target.value as 'Per day' | 'Per hour')}
                style={styles.select}
              >
                <option value="Per day">Per day</option>
                <option value="Per hour">Per hour</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div style={styles.stepContainer}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div style={styles.stepContainer}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Number of Working Hours</label>
              <input
                type="number"
                value={numberOfWorkingHours}
                onChange={(e) => setNumberOfWorkingHours(e.target.value)}
                placeholder="Enter number of working hours"
                style={styles.input}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div style={styles.stepContainer}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Number of Workers</label>
              <input
                type="number"
                value={numberOfWorkers}
                onChange={(e) => setNumberOfWorkers(e.target.value)}
                placeholder="Enter number of workers"
                style={styles.input}
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div style={styles.stepContainer}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Enter job description"
                style={styles.textarea}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topButtons}>
        {step > 1 && step < 7 && (
          <button onClick={handleBack} style={styles.backButton}>
            <span style={styles.backButton}>Back</span>
            <FaArrowLeft style={styles.backIcon} />
          </button>
        )}
        {step > 1 && step < 7 && (
          <button
            onClick={step === 7 ? handleFinish : handleContinue}
            style={styles.continueButton}
          >
            <span style={styles.continueText}>Continue</span>
            <FaArrowRight style={styles.continueIcon} />
          </button>
        )}
      </div>
  
      {renderStepContent()}
    </div>
  );
};

// Styles

// Define styles with explicit typing
const styles: { [key: string]: CSSProperties } = {
  locationText: {
    fontSize: '26px', // 30% larger than before
    fontWeight: 'bold',
    marginBottom: '15px', // Increased space between text and input
    lineHeight: '1.4',
  },
  greenText: {
    color: '#28a745', // Greenish color for "lokaciji"
  },
  stepContainer: {
    display: 'flex',
    gap: '10px', // Reduced gap between left and right containers
    position: 'relative',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  leftContainer: {
    flex: 0.6, // Smaller input area
    display: 'flex',
    flexDirection: 'column',
    gap: '20px', // Added more space between input elements
    position: 'relative',
    paddingLeft: '20px', // Shift content slightly right
    paddingTop: '20px', // Shift content slightly down
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center', // Align input and button horizontally
    gap: '10px', // Space between input and button
    position: 'relative', // Make sure suggestions are positioned below input
  },
  input: {
    width: '80%', // Full width of the container, allowing space for button
    height: '40px', // Fixed height
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    backgroundColor: '#fff',
    boxSizing: 'border-box', // Prevent resizing
    zIndex: 1, // Make sure input stays on top of the suggestions
  },
  continueButton:{
    backgroundColor: 'transparent', // No background
    color: '#28a745', // Green text color
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '5px',
    padding: '0px',
  },
  continueButtonCase1: {
    backgroundColor: 'transparent', // No background
    color: '#28a745', // Green text color
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '0px',
  },
  backButton: {
    background: 'none', // No background color
    border: 'none', // No border
    color: 'red', // Red text color
    fontSize: '18px', // Slightly larger font size for modern look
    fontWeight: 'bold', // Make the text bold
    cursor: 'pointer', // Pointer cursor to indicate it's clickable
    display: 'flex',
    alignItems: 'center',
    padding: '10px 15px', // Some padding for better click area
    position: 'absolute', // Absolute positioning
    top: '20px', // Space from the top
    left: '20px', // Space from the left
  },
  arrowIcon: {
    fontSize: '18px',
  },
  loading: {
    textAlign: 'center',
    color: '#4CAF50',
  },
  suggestionList: {
    maxHeight: '200px', // Set max height to prevent jumping
    overflowY: 'auto',   // Make suggestions scrollable
    position: 'relative', // Keep suggestions above other elements
    zIndex: 5, // Ensure suggestions appear above other elements but below input
    backgroundColor: '#fff',
    width: '80%',         // Match input width
    boxShadow: '0 2px 5px rgba(0,0,0,0.15)', // Optional shadow for visibility
    marginTop: '5px', // Ensure suggestions are positioned just below input
    borderRadius: '5px',
  },
  suggestionItem: {
    cursor: 'pointer',
    padding: '8px',
    border: '1px solid #ddd',
    marginBottom: '5px',
    borderRadius: '5px',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  rightContainer: {
   // paddingTop: 10,
    flex: 1.4, // Larger map area
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
  },
  mapContainer: {
    zIndex: 0,
    paddingTop: 10,
    width: '75%',
    height: '70vh', // 70% of viewport height
    borderRadius: '10px',
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  // Case 2: Phone Number
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center the input group
    gap: '20px', // Space between label and input
    width: '100%', // Full width
  },
  phoneLabel: {
    fontSize: '28px', // Big text
    fontWeight: 'bold',
    color: '#000', // Black text
    textAlign: 'center', // Center the text
  },
  // greenText: {
  //   color: '#28a745', // Green text for "phone number"
  // },
  phoneInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '80%', // Adjust width as needed
    maxWidth: '500px', // Limit maximum width
  },
  select: {
    padding: '10px',
    border: '1px solid #28a745',
    borderRadius: '5px',
    backgroundColor: '#fff',
    fontSize: '16px',
    color: '#28a745',
    cursor: 'pointer',
    flex: 1, // Take available space
  },
  phoneInput: {
    flex: 2, // Take more space than the select
    padding: '10px',
    border: '1px solid #28a745',
    borderRadius: '5px',
    fontSize: '16px',
    color: '#28a745',
    backgroundColor: '#fff',
  },
};




export default PostJob;