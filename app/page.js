"use client";

import { useState } from 'react';
import { db, saveQueryToFirestore } from '../lib/firebase'; 
import { doc, getDoc } from "firebase/firestore";
import Image from 'next/image';
import Wave from 'react-wavify';

const Icons = {
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Cigarette: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 12H2v4h16"/><path d="M22 12v4"/><path d="M7 12v4"/><path d="M18 8c0-2.5-2-2.5-2-5"/><path d="M22 8c0-2.5-2-2.5-2-5"/></svg>,
  Car: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17H2"/></svg>,
  ArrowLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
};

const Ombak1 = () => (
  <Wave
    fill="red"
    paused={false}
    style={{ display: 'flex' }}
    options={{ height: 30, amplitude: 35, speed: 0.2, points: 5 }}
  />
);

export function formatSex(sex) {
  return sex === "Male" ? "laki-laki" : "perempuan";
}

export default function Home() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(20);
  const [sex, setSex] = useState('Male');
  const [location, setLocation] = useState('Indonesia'); 
  const [isSmoker, setIsSmoker] = useState(false);
  const [isDriver, setIsDriver] = useState(false);  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const sexLabel = 
    {
    male: "laki-laki",
    female: "perempuan"
    };

  const getOsmUrl = (lat, lon) => {
    const delta = 7.0; 
    const minLon = parseFloat(lon) - delta;
    const maxLon = parseFloat(lon) + delta;
    const minLat = parseFloat(lat) - delta;
    const maxLat = parseFloat(lat) + delta;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon},${minLat},${maxLon},${maxLat}&layer=mapnik&marker=${lat},${lon}`;
  };

  const handleSubmit = async () => {
    if (!name) {
      setError("Mohon isi nama Anda terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const docRef = doc(db, "countries", location);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        
        const avgDeathAge = data.raw?.age || parseFloat(data.DeathAge) || 70; 
        
        let yearsLeft = avgDeathAge - age;
        if (isSmoker) yearsLeft -= 5; 
        if (isDriver) yearsLeft -= 1; 

        const finalYearsLeft = yearsLeft > 0 ? yearsLeft : 0;

        await saveQueryToFirestore({
          name: name || "Anonymous",
          age: Number(age) || 0,
          sex: sex,
          location: location,
          isSmoker: isSmoker,
          isDriver: isDriver,
          calculatedLifeLeft: finalYearsLeft,
          countryAvgAge: avgDeathAge
        });

        setResult({
          country: location,
          deathAge: data.DeathAge,
          yearsLeft: finalYearsLeft.toFixed(1),
          genderDeathAge: sex === 'Male' ? data.DeathM : data.DeathF,
          smokeRisk: data.DeathSmoke,
          roadRisk: data.DeathRoad,
          lat: data.Lat || 0,
          lon: data.Lon || 0,
          message: finalYearsLeft > 0 
            ? `${name}. Kamu Beruntung. Karena tinggal di ${location} kamu masih punya ${finalYearsLeft.toFixed(1)} tahun lagi.`
            : `Tabah bung, ${name}. Kamu harusnya sudah mati sekarang. Karena belum, Akehi Eling mergo Sejatine Wis Wayahe Tindak`,
        });

      } else {
        setError(`Data untuk negara "${location}" tidak ditemukan. Pastikan huruf kapital benar (contoh: Indonesia).`);
      }

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Terjadi kesalahan koneksi database.");
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setResult(null);
  };

  if (!result) {
    return (
      <main className="min-h-screen bg-gray-950 text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-red rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-red-600/20 rounded-full blur-[100px]"></div>
        </div>

        <nav className="fixed top-0 left-0 right-0 bg-red z-50">
            <div className="flex items-center justify-center px-4">
            {/* Logo di tengah */}
            <div className="flex justify-center py-4">
                <Image
                src="/kentod.png" 
                alt="Logo"
                width={75}
                height={40}
                className="object-contain"
                />
            </div>
            </div>
        </nav>

        <div className="absolute top-16 md:top-20 left-0 w-full h-40 pointer-events-none">
            <div className="absolute bottom-20 w-full z-10 transform rotate-180">
            <Ombak1 />
            </div>
        </div>

        <div className="w-full max-w-lg relative z-10">
          <div className="text-center mb-10 pt-20">
            <h1 className="text-5xl font-extrabold text-[#ff0000] mb-2">
              Deathify
            </h1>
            <p className="text-white">Analisis Harapan Hidup Anda</p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 p-8 rounded-3xl shadow-2xl">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Identitas</label>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Nama" 
                    className="w-full p-3 bg-gray-950 border border-[#75767B] rounded-xl focus:border-cyan-500 outline-none transition"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="Umur" 
                    value={age}
                    className="w-full p-3 bg-gray-950 border border-[#75767B] rounded-xl focus:border-cyan-500 outline-none transition"
                    onChange={(e) => setAge(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <select 
                        className="w-full p-3 bg-gray-950 border border-[#75767B] rounded-xl focus:border-red outline-none"
                        onChange={(e) => setSex(e.target.value)}
                      >
                        <option value="Male">Laki-laki</option>
                        <option value="Female">Perempuan</option>
                      </select>
                   </div>
                   <div className="relative">
                      <input 
                        type="text" 
                        value={location}
                        className="w-full p-3 bg-gray-950 border border-[#75767B] rounded-xl focus:border-cyan-500 outline-none pl-10"
                        onChange={(e) => setLocation(e.target.value)} 
                      />
                      <div className="absolute left-3 top-3 text-gray-500">
                        <Icons.MapPin />
                      </div>
                   </div>
                </div>
                <p className="text-[10px] text-gray-600 mt-2 text-right">*Negara Case Sensitive (cth: Indonesia)</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Gaya Hidup</label>
                <div className="flex gap-4 grid grid-cols-2">
                  <label className={`flex-1 overflow-hidden flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition ${isSmoker ? 'bg-red-900/20 border-red-500 text-red-400' : 'bg-gray-950 border-[#75767B] text-gray-400'}`}>
                    <input type="checkbox" className="hidden" onChange={(e) => setIsSmoker(e.target.checked)} />
                    <span className="scale-75"><Icons.Cigarette /></span> Merokok
                  </label>
                  <label className={`flex-1 overflow-hidden flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition ${isDriver ? 'bg-yellow-900/20 border-yellow-500 text-yellow-400' : 'bg-gray-950 border-[#75767B] text-gray-400'}`}>
                    <input type="checkbox" className="hidden" onChange={(e) => setIsDriver(e.target.checked)} />
                    <span className="scale-75"><Icons.Car /></span> Berkendara
                  </label>
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-red-500/20 transition transform active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Memuat...' : 'Mulai Analisis'}
              </button>

              {error && <p className="text-red text-sm text-center">{error}</p>}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col font-sans">
      
      <nav className="bg-gray-950 border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={resetSearch} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition">
            <Icons.ArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Hasil Analisis</h1>
            <p className="text-xs text-white">Data untuk {name}, {age} Tahun</p>
          </div>
        </div>
        <div className="bg-red-900 text-white px-4 py-2 rounded-full text-sm font-semibold">
          {location}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative">
        
        <div className="w-full h-[40vh] md:h-[50vh] relative bg-gray-200">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            className="w-full h-full"
            src={getOsmUrl(result.lat, result.lon)}
          ></iframe>
        </div>

        <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10 pb-20">
          
          {/* Kartu Utama (Years Left) */}
          <div className="bg-white rounded-2xl shadow-xl border border-red-600 border-5 overflow-hidden mb-8 flex flex-col md:flex-row">
            <div className="bg-red-600 p-8 md:w-1/3 flex flex-col justify-center items-center text-white text-center">
              <h3 className="text-cyan-100 text-sm font-bold uppercase tracking-wider mb-2">Estimasi Sisa Waktu</h3>
              <div className="text-8xl font-black tracking-tighter drop-shadow-md">
                {result.yearsLeft}
              </div>
              <span className="text-xl font-medium opacity-90">Tahun Lagi</span>
            </div>
            <div className="p-8 md:w-2/3 flex items-center">
              <p className="text-gray-600 text-lg leading-relaxed">
                "{result.message}"
                <br/>
                <span className="text-sm text-gray-400 mt-2 block">
                  Angka ini bukan ramalan, tapi kebanyakan orang di {location} mati ketika umur {result.deathAge} tahun.
                </span>
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Icons.Search /> Detail Statistik
          </h3>

          {/* Grid Kartu Detail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Gender Stats */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Icons.User />
              </div>
              <h4 className="text-gray-500 text-xs font-bold uppercase mb-1">Rata-rata {formatSex(sex)}</h4>
              <div className="text-3xl font-bold text-gray-800 mb-2">{result.genderDeathAge}</div>
              <p className="text-sm text-gray-500">
                Karena kamu {formatSex(sex)} di {location}, umurmu sebenarnya lebih mendekati  {result.genderDeathAge} tahun. 
              </p>
            </div>

            {/* Card 2: Smoke Risk */}
            {isSmoker ? (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 hover:shadow-md transition relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-bl-full -mr-4 -mt-4"></div>
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 relative z-10">
                  <Icons.Cigarette />
                </div>
                <h4 className="text-red-400 text-xs font-bold uppercase mb-1 relative z-10">Risiko Rokok</h4>
                <div className="text-3xl font-bold text-gray-800 mb-2 relative z-10">{result.smokeRisk}</div>
                <p className="text-sm text-gray-500 relative z-10">
                  Kemungkinan anda meniggal karena penyakit yang diakibatkan rokok 👎👎👎 {location}.
                </p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition opacity-75">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <Icons.Cigarette />
                </div>
                 <h4 className="text-green-600 text-xs font-bold uppercase mb-1">Bebas Rokok</h4>
                 <p className="text-sm text-gray-500 mt-2">
                   Anda tidak risiko merokok. Joss 👍!
                 </p>
              </div>
            )}

            {/* Card 3: Road Risk */}
            {isDriver ? (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-100 hover:shadow-md transition relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-50 rounded-bl-full -mr-4 -mt-4"></div>
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4 relative z-10">
                  <Icons.Car />
                </div>
                <h4 className="text-yellow-500 text-xs font-bold uppercase mb-1 relative z-10">Risiko Jalan Raya</h4>
                <div className="text-3xl font-bold text-gray-800 mb-2 relative z-10">{result.roadRisk}</div>
                <p className="text-sm text-gray-500 relative z-10">
                  Kemungkinan anda meninggal karena kecelakaan berkendara di {location}.
                </p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition opacity-75">
                 <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mb-4">
                  <Icons.Car />
                </div>
                 <h4 className="text-gray-500 text-xs font-bold uppercase mb-1">Jarang Berkendara</h4>
                 <p className="text-sm text-gray-500 mt-2">
                   Anda akan lebih jarang meninggal karena kecelakaan berkendara.
                 </p>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}