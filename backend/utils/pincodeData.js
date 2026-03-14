// backend/utils/pincodeData.js
// Pincode → { lat, lng } lookup for Indian pincodes
// Covers all 9 postal zones and major districts/cities
// Used as primary source — no external API needed

const pincodeData = {
  // ── ZONE 1: Delhi & surrounding (110xxx) ───────────────────────────
  "110001": { lat: 28.6405, lng: 77.2277 }, // Connaught Place
  "110002": { lat: 28.6508, lng: 77.2373 }, // Darya Ganj
  "110003": { lat: 28.5921, lng: 77.2090 }, // Lodi Colony
  "110004": { lat: 28.6062, lng: 77.1907 }, // Chanakyapuri
  "110005": { lat: 28.6556, lng: 77.2100 }, // Karol Bagh
  "110006": { lat: 28.6594, lng: 77.2267 }, // Sadar Bazar
  "110007": { lat: 28.6730, lng: 77.2060 }, // Civil Lines
  "110008": { lat: 28.6527, lng: 77.1773 }, // Patel Nagar
  "110009": { lat: 28.6780, lng: 77.2320 }, // Model Town
  "110010": { lat: 28.5672, lng: 77.2100 }, // Lajpat Nagar
  "110011": { lat: 28.5820, lng: 77.1980 }, // Safdarjung
  "110012": { lat: 28.5988, lng: 77.1603 }, // Dhaula Kuan
  "110013": { lat: 28.5477, lng: 77.2590 }, // Okhla
  "110014": { lat: 28.5577, lng: 77.2430 }, // Defence Colony
  "110015": { lat: 28.6385, lng: 77.1545 }, // Janakpuri
  "110016": { lat: 28.5355, lng: 77.2090 }, // Hauz Khas
  "110017": { lat: 28.5220, lng: 77.2150 }, // Malviya Nagar
  "110018": { lat: 28.6340, lng: 77.1340 }, // Vikaspuri
  "110019": { lat: 28.5120, lng: 77.2580 }, // Kalkaji
  "110020": { lat: 28.5280, lng: 77.1820 }, // Vasant Kunj
  "110021": { lat: 28.5545, lng: 77.1730 }, // Vasant Vihar
  "110022": { lat: 28.5770, lng: 77.1620 }, // Munirka
  "110023": { lat: 28.6280, lng: 77.2540 }, // Jangpura
  "110024": { lat: 28.5730, lng: 77.2380 }, // Nizamuddin
  "110025": { lat: 28.5870, lng: 77.2520 }, // Friends Colony
  "110026": { lat: 28.6440, lng: 77.0980 }, // Dwarka
  "110027": { lat: 28.6620, lng: 77.1150 }, // Subhash Nagar
  "110028": { lat: 28.6110, lng: 77.1400 }, // Sagarpur
  "110029": { lat: 28.5630, lng: 77.2000 }, // South Extension
  "110030": { lat: 28.5230, lng: 77.1960 }, // Mehrauli
  "110031": { lat: 28.6990, lng: 77.3120 }, // Shahdara
  "110032": { lat: 28.6780, lng: 77.2950 }, // Krishna Nagar
  "110033": { lat: 28.7020, lng: 77.1720 }, // Rohini
  "110034": { lat: 28.7200, lng: 77.1380 }, // Pitampura
  "110035": { lat: 28.7050, lng: 77.1200 }, // Shalimar Bagh
  "110036": { lat: 28.7330, lng: 77.1050 }, // Sultanpur Majra
  "110037": { lat: 28.7010, lng: 77.0720 }, // Nangloi
  "110038": { lat: 28.6520, lng: 77.0560 }, // Uttam Nagar
  "110039": { lat: 28.6970, lng: 77.2560 }, // Seelampur
  "110040": { lat: 28.7360, lng: 77.1620 }, // Bawana
  "110041": { lat: 28.7150, lng: 77.0980 }, // Mangolpuri
  "110042": { lat: 28.7480, lng: 77.1840 }, // Alipur
  "110043": { lat: 28.6690, lng: 77.0390 }, // Dwarka Sector 10
  "110044": { lat: 28.5780, lng: 77.3050 }, // Badarpur
  "110045": { lat: 28.6180, lng: 77.0620 }, // Dwarka Sector 6
  "110046": { lat: 28.5480, lng: 77.1570 }, // Chhattarpur
  "110047": { lat: 28.5360, lng: 77.1730 }, // Saket
  "110048": { lat: 28.5440, lng: 77.2340 }, // Greater Kailash
  "110049": { lat: 28.5290, lng: 77.2430 }, // Chirag Delhi
  "110051": { lat: 28.6530, lng: 77.3060 }, // Pandav Nagar
  "110052": { lat: 28.6820, lng: 77.1570 }, // Ashok Vihar
  "110053": { lat: 28.6650, lng: 77.1730 }, // Punjabi Bagh
  "110054": { lat: 28.6770, lng: 77.2430 }, // GTB Nagar
  "110055": { lat: 28.6460, lng: 77.1920 }, // Rajendra Place
  "110056": { lat: 28.6610, lng: 77.1370 }, // Paschim Vihar
  "110057": { lat: 28.5910, lng: 77.1420 }, // Kapashera
  "110058": { lat: 28.6310, lng: 77.0780 }, // Uttam Nagar West
  "110059": { lat: 28.6080, lng: 77.0380 }, // Najafgarh
  "110060": { lat: 28.6390, lng: 77.1790 }, // Moti Nagar
  "110062": { lat: 28.5620, lng: 77.0890 }, // Palam
  "110063": { lat: 28.5890, lng: 77.0670 }, // Bijwasan
  "110064": { lat: 28.6770, lng: 77.1440 }, // Wazirpur
  "110065": { lat: 28.5990, lng: 77.2680 }, // Govindpuri
  "110066": { lat: 28.5840, lng: 77.2670 }, // Tughlakabad
  "110067": { lat: 28.5760, lng: 77.1530 }, // Lado Sarai
  "110068": { lat: 28.5460, lng: 77.1380 }, // Sultanpur
  "110069": { lat: 28.5540, lng: 77.2200 }, // Maidan Garhi
  "110070": { lat: 28.5690, lng: 77.0680 }, // Dwarka Sector 14
  "110071": { lat: 28.5910, lng: 77.0460 }, // Palam Village
  "110072": { lat: 28.6240, lng: 77.0160 }, // Najafgarh West
  "110073": { lat: 28.5300, lng: 77.2730 }, // Sangam Vihar
  "110074": { lat: 28.5150, lng: 77.2650 }, // Ambedkar Nagar
  "110075": { lat: 28.6030, lng: 77.0860 }, // Dwarka Sector 18
  "110076": { lat: 28.5550, lng: 77.3200 }, // Jasola
  "110077": { lat: 28.5420, lng: 77.3380 }, // Madanpur Khadar
  "110078": { lat: 28.6120, lng: 77.0180 }, // Dhansa
  "110081": { lat: 28.6770, lng: 77.3470 }, // Anand Vihar
  "110082": { lat: 28.6590, lng: 77.3690 }, // Mayur Vihar
  "110085": { lat: 28.6480, lng: 77.3800 }, // Patparganj
  "110086": { lat: 28.6360, lng: 77.3910 }, // Kondli
  "110087": { lat: 28.6150, lng: 77.3610 }, // Sarita Vihar
  "110088": { lat: 28.6540, lng: 77.1010 }, // Dwarka Sector 22
  "110089": { lat: 28.5820, lng: 77.3360 }, // Kalindi Kunj
  "110091": { lat: 28.6250, lng: 77.3070 }, // Laxmi Nagar
  "110092": { lat: 28.6130, lng: 77.3250 }, // Preet Vihar
  "110093": { lat: 28.5940, lng: 77.3440 }, // Trilokpuri
  "110094": { lat: 28.5750, lng: 77.3620 }, // Gharoli
  "110095": { lat: 28.6710, lng: 77.3240 }, // Geeta Colony
  "110096": { lat: 28.6580, lng: 77.3450 }, // Loni Road

  // ── ZONE 2: UP, Haryana, Himachal, Punjab (12xxx-19xxx) ───────────────
  "122001": { lat: 28.4595, lng: 77.0266 }, // Gurgaon
  "122002": { lat: 28.4501, lng: 77.0307 }, // Gurgaon South
  "122003": { lat: 28.4817, lng: 77.0921 }, // Gurgaon East
  "122004": { lat: 28.4346, lng: 77.0452 }, // Gurgaon West
  "122005": { lat: 28.4120, lng: 76.9980 }, // Pataudi Road
  "122006": { lat: 28.3910, lng: 77.0560 }, // Manesar
  "122007": { lat: 28.4590, lng: 77.1100 }, // Sohna Road
  "122008": { lat: 28.4760, lng: 77.0580 }, // DLF Phase 1
  "122009": { lat: 28.4920, lng: 77.0740 }, // DLF Phase 4
  "122010": { lat: 28.5050, lng: 77.0880 }, // Sector 55
  "122011": { lat: 28.5180, lng: 77.0990 }, // Sector 65
  "122015": { lat: 28.4230, lng: 77.0420 }, // Gurgaon South City
  "122016": { lat: 28.4380, lng: 77.0840 }, // Sohna
  "122017": { lat: 28.4620, lng: 77.0140 }, // Gurgaon Sector 10
  "122018": { lat: 28.4450, lng: 77.0780 }, // Sector 50
  "122022": { lat: 28.4740, lng: 77.0460 }, // Sector 23
  "122051": { lat: 28.5440, lng: 77.0680 }, // Gurgaon North
  "121001": { lat: 28.3910, lng: 77.3132 }, // Faridabad
  "121002": { lat: 28.4080, lng: 77.3280 }, // Faridabad NIT
  "121003": { lat: 28.4370, lng: 77.3110 }, // Faridabad Sector 16
  "121004": { lat: 28.3650, lng: 77.3050 }, // Faridabad Old
  "121005": { lat: 28.3480, lng: 77.2890 }, // Ballabhgarh
  "121006": { lat: 28.3250, lng: 77.2710 }, // Palwal
  "125001": { lat: 29.1492, lng: 75.7217 }, // Hisar
  "125004": { lat: 29.1700, lng: 75.7400 }, // Hisar North
  "125005": { lat: 29.1300, lng: 75.7000 }, // Hisar South
  "125011": { lat: 29.0000, lng: 75.8000 }, // Hansi
  "125033": { lat: 29.3000, lng: 75.7600 }, // Fatehabad
  "132001": { lat: 29.6857, lng: 76.9905 }, // Panipat
  "132103": { lat: 29.7200, lng: 77.0200 }, // Panipat East
  "132104": { lat: 29.6500, lng: 76.9600 }, // Panipat South
  "133001": { lat: 30.0668, lng: 76.9918 }, // Ambala
  "133004": { lat: 30.0900, lng: 77.0100 }, // Ambala City
  "134003": { lat: 30.3398, lng: 76.8601 }, // Panchkula
  "134109": { lat: 30.3600, lng: 76.8800 }, // Panchkula East
  "141001": { lat: 30.9010, lng: 75.8573 }, // Ludhiana
  "141002": { lat: 30.8900, lng: 75.8700 }, // Ludhiana East
  "141003": { lat: 30.9200, lng: 75.8400 }, // Ludhiana North
  "141008": { lat: 30.8700, lng: 75.8200 }, // Ludhiana South
  "141013": { lat: 30.9300, lng: 75.9100 }, // Ludhiana Industrial
  "143001": { lat: 31.6340, lng: 74.8723 }, // Amritsar
  "143002": { lat: 31.6500, lng: 74.8900 }, // Amritsar North
  "143006": { lat: 31.6100, lng: 74.8500 }, // Amritsar South
  "144001": { lat: 31.3260, lng: 75.5762 }, // Jalandhar
  "144002": { lat: 31.3400, lng: 75.5900 }, // Jalandhar North
  "144008": { lat: 31.3100, lng: 75.5600 }, // Jalandhar South
  "151001": { lat: 30.2038, lng: 74.9722 }, // Bathinda
  "160001": { lat: 30.7333, lng: 76.7794 }, // Chandigarh
  "160002": { lat: 30.7450, lng: 76.7900 }, // Chandigarh Sector 17
  "160003": { lat: 30.7200, lng: 76.7650 }, // Chandigarh South
  "160011": { lat: 30.7600, lng: 76.8100 }, // Chandigarh East
  "160014": { lat: 30.7100, lng: 76.7400 }, // Chandigarh Industrial
  "160017": { lat: 30.7750, lng: 76.7980 }, // Chandigarh North
  "160019": { lat: 30.7850, lng: 76.8200 }, // Chandigarh Sector 44
  "160020": { lat: 30.6950, lng: 76.7550 }, // Chandigarh Sector 56
  "160022": { lat: 30.7400, lng: 76.8400 }, // Chandigarh IT Park
  "160047": { lat: 30.7280, lng: 76.8020 }, // Chandigarh Sector 43
  "160055": { lat: 30.7150, lng: 76.7300 }, // Chandigarh Mohali
  "160059": { lat: 30.7020, lng: 76.7180 }, // Mohali Phase 7
  "160062": { lat: 30.7900, lng: 76.8550 }, // Chandigarh Sector 68
  "171001": { lat: 31.1048, lng: 77.1734 }, // Shimla
  "171004": { lat: 31.1200, lng: 77.1900 }, // Shimla North
  "180001": { lat: 32.7266, lng: 74.8570 }, // Jammu
  "190001": { lat: 34.0837, lng: 74.7973 }, // Srinagar
  "201001": { lat: 28.6692, lng: 77.4538 }, // Ghaziabad
  "201002": { lat: 28.6800, lng: 77.4700 }, // Ghaziabad East
  "201005": { lat: 28.6600, lng: 77.4200 }, // Ghaziabad South
  "201006": { lat: 28.6970, lng: 77.4900 }, // Vasundhara
  "201007": { lat: 28.7100, lng: 77.5100 }, // Indirapuram
  "201010": { lat: 28.6400, lng: 77.4400 }, // Ghaziabad West
  "201012": { lat: 28.7200, lng: 77.5350 }, // Crossing Republik
  "201013": { lat: 28.6230, lng: 77.4120 }, // Sahibabad
  "201014": { lat: 28.6050, lng: 77.3980 }, // Mohan Nagar
  "201301": { lat: 28.5706, lng: 77.3272 }, // Noida Sector 15
  "201302": { lat: 28.5600, lng: 77.3400 }, // Noida Sector 25
  "201303": { lat: 28.5850, lng: 77.3550 }, // Noida Sector 37
  "201304": { lat: 28.5430, lng: 77.3650 }, // Noida Sector 58
  "201305": { lat: 28.5300, lng: 77.3900 }, // Noida Sector 62
  "201306": { lat: 28.5750, lng: 77.4000 }, // Noida Sector 63
  "201307": { lat: 28.5920, lng: 77.4150 }, // Noida Sector 74
  "201308": { lat: 28.6080, lng: 77.4300 }, // Noida Sector 77
  "201309": { lat: 28.5150, lng: 77.4100 }, // Greater Noida West
  "201310": { lat: 28.4980, lng: 77.4250 }, // Greater Noida
  "202001": { lat: 27.8974, lng: 78.0880 }, // Aligarh
  "208001": { lat: 26.4499, lng: 80.3319 }, // Kanpur
  "208012": { lat: 26.4700, lng: 80.3500 }, // Kanpur North
  "208014": { lat: 26.4300, lng: 80.3100 }, // Kanpur South
  "208020": { lat: 26.4100, lng: 80.2900 }, // Kanpur West
  "211001": { lat: 25.4358, lng: 81.8463 }, // Allahabad / Prayagraj
  "211002": { lat: 25.4500, lng: 81.8600 }, // Prayagraj North
  "211003": { lat: 25.4200, lng: 81.8300 }, // Prayagraj South
  "226001": { lat: 26.8467, lng: 80.9462 }, // Lucknow
  "226002": { lat: 26.8600, lng: 80.9600 }, // Lucknow North
  "226003": { lat: 26.8300, lng: 80.9300 }, // Lucknow South
  "226004": { lat: 26.8750, lng: 80.9800 }, // Lucknow East
  "226010": { lat: 26.8200, lng: 80.9100 }, // Lucknow West
  "226016": { lat: 26.8900, lng: 81.0000 }, // Lucknow NE
  "226020": { lat: 26.8050, lng: 80.9000 }, // Alambagh
  "226022": { lat: 26.8680, lng: 80.9450 }, // Hazratganj
  "226025": { lat: 26.8400, lng: 80.9700 }, // Gomtinagar
  "247001": { lat: 29.9639, lng: 77.5510 }, // Saharanpur
  "250001": { lat: 28.9845, lng: 77.7064 }, // Meerut
  "250002": { lat: 29.0000, lng: 77.7200 }, // Meerut North
  "250004": { lat: 28.9700, lng: 77.6900 }, // Meerut South
  "282001": { lat: 27.1767, lng: 78.0081 }, // Agra
  "282002": { lat: 27.1900, lng: 78.0200 }, // Agra North
  "282004": { lat: 27.1600, lng: 77.9900 }, // Agra South
  "284001": { lat: 25.4484, lng: 78.5685 }, // Jhansi

  // ── ZONE 3: Rajasthan, Gujarat (30xxx-39xxx) ───────────────────────
  "302001": { lat: 26.9124, lng: 75.7873 }, // Jaipur
  "302002": { lat: 26.9200, lng: 75.8000 }, // Jaipur North
  "302003": { lat: 26.9050, lng: 75.7750 }, // Jaipur South
  "302004": { lat: 26.8900, lng: 75.7600 }, // Jaipur West
  "302005": { lat: 26.9300, lng: 75.8200 }, // Jaipur East
  "302006": { lat: 26.9450, lng: 75.8400 }, // Jaipur NE
  "302007": { lat: 26.8750, lng: 75.7400 }, // Jaipur SW
  "302011": { lat: 26.9600, lng: 75.8600 }, // Jaipur Mansarovar
  "302012": { lat: 26.8600, lng: 75.7250 }, // Jaipur Sanganer
  "302015": { lat: 26.9750, lng: 75.8800 }, // Jaipur Vaishali
  "302017": { lat: 26.8450, lng: 75.7100 }, // Jaipur Sitapura
  "302019": { lat: 26.8300, lng: 75.6900 }, // Jaipur Industrial
  "302020": { lat: 27.0000, lng: 75.9100 }, // Jaipur Muhana
  "302021": { lat: 26.9800, lng: 75.9300 }, // Jaipur Jagatpura
  "302022": { lat: 26.9650, lng: 75.9000 }, // Jaipur Malviya
  "302029": { lat: 27.0150, lng: 75.9500 }, // Jaipur Ajmer Road
  "305001": { lat: 26.4499, lng: 74.6399 }, // Ajmer
  "313001": { lat: 24.5854, lng: 73.7125 }, // Udaipur
  "324001": { lat: 25.2138, lng: 75.8648 }, // Kota
  "342001": { lat: 26.2389, lng: 73.0243 }, // Jodhpur
  "380001": { lat: 23.0225, lng: 72.5714 }, // Ahmedabad
  "380002": { lat: 23.0350, lng: 72.5850 }, // Ahmedabad East
  "380003": { lat: 23.0100, lng: 72.5600 }, // Ahmedabad South
  "380004": { lat: 23.0480, lng: 72.5500 }, // Ahmedabad West
  "380005": { lat: 23.0600, lng: 72.5400 }, // Naroda
  "380006": { lat: 23.0750, lng: 72.5300 }, // Chandlodia
  "380007": { lat: 23.0900, lng: 72.5200 }, // Gota
  "380008": { lat: 23.0050, lng: 72.5800 }, // Maninagar
  "380009": { lat: 22.9900, lng: 72.5900 }, // Vatwa
  "380013": { lat: 23.0400, lng: 72.5050 }, // Satellite
  "380015": { lat: 23.0200, lng: 72.5150 }, // Bodakdev
  "380018": { lat: 23.0700, lng: 72.4900 }, // Bopal
  "380019": { lat: 23.0300, lng: 72.4800 }, // Prahlad Nagar
  "380023": { lat: 23.0550, lng: 72.5600 }, // Navrangpura
  "380024": { lat: 23.0650, lng: 72.5750 }, // Memnagar
  "380026": { lat: 23.0450, lng: 72.6100 }, // Thaltej
  "380027": { lat: 23.0900, lng: 72.6200 }, // Motera
  "380028": { lat: 23.0800, lng: 72.6100 }, // Chandkheda
  "380051": { lat: 23.0150, lng: 72.5300 }, // Paldi
  "380052": { lat: 23.0050, lng: 72.5200 }, // Vasna
  "380054": { lat: 22.9800, lng: 72.5100 }, // Isanpur
  "380055": { lat: 22.9700, lng: 72.5500 }, // Bapunagar
  "380058": { lat: 23.0680, lng: 72.6350 }, // Sabarmati
  "380059": { lat: 23.0750, lng: 72.6450 }, // Ranip
  "380061": { lat: 23.0850, lng: 72.6600 }, // Kadi Road
  "380063": { lat: 23.0300, lng: 72.6500 }, // Naranpura
  "380064": { lat: 23.0200, lng: 72.6600 }, // Ghatlodiya
  "380065": { lat: 23.0100, lng: 72.6700 }, // Sola
  "382001": { lat: 22.9950, lng: 72.6000 }, // Gandhi Nagar
  "382010": { lat: 23.0050, lng: 72.6150 }, // Sector 7 GN
  "382016": { lat: 23.0150, lng: 72.6350 }, // Sector 21 GN
  "382028": { lat: 23.0250, lng: 72.6550 }, // Sector 28 GN
  "382045": { lat: 23.0050, lng: 72.6800 }, // Sector 25 GN
  "390001": { lat: 22.3072, lng: 73.1812 }, // Vadodara
  "390002": { lat: 22.3200, lng: 73.1950 }, // Vadodara North
  "390003": { lat: 22.2950, lng: 73.1700 }, // Vadodara South
  "390007": { lat: 22.3400, lng: 73.2100 }, // Vadodara East
  "390011": { lat: 22.2800, lng: 73.1600 }, // Vadodara West
  "390015": { lat: 22.3600, lng: 73.2300 }, // Vadodara NE
  "395001": { lat: 21.1702, lng: 72.8311 }, // Surat
  "395002": { lat: 21.1850, lng: 72.8450 }, // Surat North
  "395003": { lat: 21.1550, lng: 72.8150 }, // Surat South
  "395004": { lat: 21.2000, lng: 72.8600 }, // Surat East
  "395005": { lat: 21.1400, lng: 72.8000 }, // Surat West
  "395006": { lat: 21.1200, lng: 72.7850 }, // Surat SW
  "395007": { lat: 21.2200, lng: 72.8800 }, // Surat NE
  "395008": { lat: 21.1650, lng: 72.8700 }, // Athwa
  "395009": { lat: 21.2100, lng: 72.9000 }, // Adajan
  "395010": { lat: 21.2350, lng: 72.9200 }, // Vesu
  "395023": { lat: 21.1300, lng: 72.9100 }, // Dumas
  "396001": { lat: 20.9467, lng: 72.9520 }, // Navsari
  "396195": { lat: 20.6000, lng: 72.9000 }, // Valsad

  // ── ZONE 4: Maharashtra (40xxx-44xxx) ─────────────────────────────
  "400001": { lat: 18.9322, lng: 72.8264 }, // Fort / Churchgate
  "400002": { lat: 18.9500, lng: 72.8350 }, // Masjid Bunder
  "400003": { lat: 18.9600, lng: 72.8400 }, // Mandvi
  "400004": { lat: 18.9700, lng: 72.8250 }, // Girgaon
  "400005": { lat: 18.9550, lng: 72.8150 }, // Colaba
  "400006": { lat: 18.9400, lng: 72.8100 }, // Malabar Hill
  "400007": { lat: 18.9750, lng: 72.8350 }, // Grant Road
  "400008": { lat: 18.9850, lng: 72.8200 }, // Mumbai Central
  "400009": { lat: 18.9700, lng: 72.8100 }, // Nagpada
  "400010": { lat: 18.9900, lng: 72.8350 }, // Byculla
  "400011": { lat: 19.0000, lng: 72.8400 }, // Lalbaug
  "400012": { lat: 18.9800, lng: 72.8450 }, // Parel
  "400013": { lat: 18.9650, lng: 72.8500 }, // Dadar TT
  "400014": { lat: 19.0100, lng: 72.8450 }, // Dadar
  "400015": { lat: 19.0250, lng: 72.8400 }, // Mahim
  "400016": { lat: 19.0400, lng: 72.8350 }, // Matunga
  "400017": { lat: 19.0550, lng: 72.8300 }, // Dharavi
  "400018": { lat: 19.0650, lng: 72.8250 }, // Sion
  "400019": { lat: 19.0750, lng: 72.8750 }, // Chembur
  "400020": { lat: 18.9200, lng: 72.8150 }, // Cuffe Parade
  "400021": { lat: 18.9100, lng: 72.8200 }, // Nariman Point
  "400022": { lat: 19.0200, lng: 72.8550 }, // Wadala
  "400024": { lat: 19.0850, lng: 72.8700 }, // Ghatkopar West
  "400025": { lat: 19.0050, lng: 72.8200 }, // Worli
  "400026": { lat: 18.9950, lng: 72.8100 }, // Prabhadevi
  "400027": { lat: 18.9800, lng: 72.8000 }, // Khar Road
  "400028": { lat: 18.9450, lng: 72.8000 }, // Santacruz West
  "400029": { lat: 18.9650, lng: 72.7950 }, // Vile Parle West
  "400030": { lat: 18.9550, lng: 72.8350 }, // Breach Candy
  "400031": { lat: 18.9350, lng: 72.8350 }, // Walkeshwar
  "400032": { lat: 18.9200, lng: 72.8350 }, // Navy Nagar
  "400033": { lat: 18.9100, lng: 72.8150 }, // Backbay Reclamation
  "400034": { lat: 19.0300, lng: 72.8650 }, // Antop Hill
  "400035": { lat: 19.0450, lng: 72.8600 }, // Chunabhatti
  "400037": { lat: 19.0600, lng: 72.8800 }, // Govandi
  "400043": { lat: 19.0700, lng: 72.9100 }, // Vikhroli
  "400050": { lat: 19.1300, lng: 72.8350 }, // Bandra West
  "400051": { lat: 19.1200, lng: 72.8450 }, // Bandra East
  "400052": { lat: 19.1400, lng: 72.8250 }, // Santacruz East
  "400053": { lat: 19.1150, lng: 72.8500 }, // Khar East
  "400054": { lat: 19.1500, lng: 72.8200 }, // Vile Parle East
  "400055": { lat: 19.1600, lng: 72.8550 }, // Jogeshwari West
  "400056": { lat: 19.1700, lng: 72.8650 }, // Andheri West
  "400057": { lat: 19.1550, lng: 72.8700 }, // Andheri East
  "400058": { lat: 19.1750, lng: 72.8750 }, // Jogeshwari East
  "400059": { lat: 19.1850, lng: 72.8850 }, // Goregaon West
  "400060": { lat: 19.1900, lng: 72.8950 }, // Goregaon East
  "400061": { lat: 19.2000, lng: 72.8450 }, // Malad West
  "400062": { lat: 19.1950, lng: 72.8900 }, // Malad East
  "400063": { lat: 19.2100, lng: 72.8600 }, // Kandivali West
  "400064": { lat: 19.1600, lng: 72.9050 }, // Borivali East
  "400065": { lat: 19.2300, lng: 72.8550 }, // Kandivali East
  "400066": { lat: 19.2450, lng: 72.8600 }, // Borivali West
  "400067": { lat: 19.2600, lng: 72.8500 }, // Dahisar East
  "400068": { lat: 19.2550, lng: 72.8350 }, // Dahisar West
  "400069": { lat: 19.0150, lng: 72.8700 }, // Kurla West
  "400070": { lat: 19.0100, lng: 72.8850 }, // Kurla East
  "400071": { lat: 19.0650, lng: 72.9050 }, // Ghatkopar East
  "400072": { lat: 19.0800, lng: 72.9200 }, // Bhandup West
  "400074": { lat: 19.0950, lng: 72.9350 }, // Bhandup East
  "400075": { lat: 19.1200, lng: 72.9500 }, // Kanjurmarg
  "400076": { lat: 19.1050, lng: 72.9550 }, // Mulund West
  "400077": { lat: 19.1100, lng: 72.9600 }, // Mulund East
  "400078": { lat: 19.1250, lng: 72.9650 }, // Nahur
  "400079": { lat: 19.1350, lng: 72.9400 }, // Powai
  "400080": { lat: 19.1450, lng: 72.9300 }, // Hiranandani
  "400081": { lat: 19.1600, lng: 72.9200 }, // Vikhroli East
  "400082": { lat: 19.0800, lng: 72.9000 }, // Chembur East
  "400083": { lat: 19.0900, lng: 72.8950 }, // Chembur West
  "400084": { lat: 19.0950, lng: 72.9100 }, // Tilak Nagar
  "400085": { lat: 19.0550, lng: 72.9000 }, // Mankhurd
  "400086": { lat: 19.0400, lng: 72.9150 }, // Trombay
  "400087": { lat: 19.0650, lng: 72.8600 }, // Deonar
  "400088": { lat: 19.0750, lng: 72.8500 }, // Chembur Colony
  "400089": { lat: 19.0200, lng: 72.9200 }, // Shivaji Nagar
  "400090": { lat: 19.0300, lng: 72.9100 }, // Govandi East
  "400091": { lat: 19.0100, lng: 72.8600 }, // Dharavi South
  "400092": { lat: 19.0650, lng: 72.8150 }, // Sion West
  "400093": { lat: 19.0750, lng: 72.8050 }, // Dharavi North
  "400094": { lat: 19.0550, lng: 72.8300 }, // Matunga East
  "400095": { lat: 19.1650, lng: 72.9100 }, // Sakinaka
  "400096": { lat: 19.1300, lng: 72.9200 }, // Chandivali
  "400097": { lat: 19.1750, lng: 72.9400 }, // Kanjurmarg West
  "400098": { lat: 19.1850, lng: 72.9350 }, // Bhandup North
  "400099": { lat: 19.1900, lng: 72.9600 }, // Mulund North
  "400101": { lat: 19.2750, lng: 72.9850 }, // Vasai West
  "400102": { lat: 19.3600, lng: 72.8200 }, // Vasai East
  "400601": { lat: 19.2183, lng: 72.9781 }, // Thane West
  "400602": { lat: 19.2100, lng: 72.9900 }, // Thane East
  "400603": { lat: 19.2250, lng: 72.9700 }, // Thane Central
  "400604": { lat: 19.2350, lng: 72.9650 }, // Thane North
  "400605": { lat: 19.2000, lng: 72.9600 }, // Thane South
  "400606": { lat: 19.2450, lng: 73.0100 }, // Thane NE
  "400607": { lat: 19.2600, lng: 73.0200 }, // Thane Far NE
  "400608": { lat: 19.2150, lng: 73.0050 }, // Kopri
  "400610": { lat: 19.2800, lng: 73.0350 }, // Dombivli East
  "400611": { lat: 19.2950, lng: 73.0600 }, // Dombivli West
  "400612": { lat: 19.3100, lng: 73.0750 }, // Kalyan East
  "400613": { lat: 19.2400, lng: 73.1300 }, // Ambernath
  "400614": { lat: 19.3250, lng: 73.1200 }, // Ulhasnagar
  "400615": { lat: 19.3400, lng: 73.1400 }, // Badlapur
  "400616": { lat: 19.3600, lng: 73.0900 }, // Kalyan West
  "400701": { lat: 19.0330, lng: 73.0297 }, // Navi Mumbai Nerul
  "400703": { lat: 19.0500, lng: 73.0100 }, // Navi Mumbai Vashi
  "400705": { lat: 19.0650, lng: 73.0400 }, // Kharghar
  "400706": { lat: 19.0200, lng: 73.0500 }, // Belapur
  "400708": { lat: 19.0750, lng: 73.0600 }, // Panvel
  "400709": { lat: 19.0100, lng: 72.9950 }, // Sanpada
  "400710": { lat: 19.0400, lng: 73.0650 }, // Ulwe
  "411001": { lat: 18.5204, lng: 73.8567 }, // Pune Camp
  "411002": { lat: 18.5350, lng: 73.8700 }, // Pune City
  "411003": { lat: 18.5500, lng: 73.8850 }, // Shivajinagar
  "411004": { lat: 18.5650, lng: 73.9000 }, // Deccan
  "411005": { lat: 18.5100, lng: 73.8400 }, // Koregaon Park
  "411006": { lat: 18.4950, lng: 73.8300 }, // Aundh
  "411007": { lat: 18.4800, lng: 73.8150 }, // Baner
  "411008": { lat: 18.5250, lng: 73.8150 }, // Kothrud
  "411009": { lat: 18.5400, lng: 73.8050 }, // Karve Nagar
  "411011": { lat: 18.5750, lng: 73.9150 }, // Hadapsar
  "411013": { lat: 18.5900, lng: 73.9300 }, // Magarpatta
  "411014": { lat: 18.5050, lng: 73.8700 }, // Pune Cantonment
  "411015": { lat: 18.4700, lng: 73.8600 }, // Bavdhan
  "411016": { lat: 18.4550, lng: 73.8750 }, // Pashan
  "411017": { lat: 18.4400, lng: 73.8900 }, // Sus
  "411018": { lat: 18.4250, lng: 73.8500 }, // Hinjewadi
  "411019": { lat: 18.5600, lng: 73.9400 }, // Wanowrie
  "411020": { lat: 18.5750, lng: 73.9550 }, // Kondhwa
  "411021": { lat: 18.6000, lng: 73.9600 }, // Undri
  "411022": { lat: 18.6200, lng: 73.9500 }, // Pisoli
  "411023": { lat: 18.5150, lng: 73.9100 }, // Kalyani Nagar
  "411024": { lat: 18.5300, lng: 73.9250 }, // Wadgaon Sheri
  "411025": { lat: 18.5450, lng: 73.9400 }, // Kharadi
  "411026": { lat: 18.5600, lng: 73.9550 }, // Lohegaon
  "411027": { lat: 18.5700, lng: 73.8350 }, // Pimpri
  "411028": { lat: 18.5850, lng: 73.8500 }, // Chinchwad
  "411033": { lat: 18.6200, lng: 73.8600 }, // Akurdi
  "411034": { lat: 18.6350, lng: 73.8750 }, // Nigdi
  "411035": { lat: 18.6500, lng: 73.8900 }, // Pradhikaran
  "411036": { lat: 18.6650, lng: 73.8500 }, // Bhosari
  "411037": { lat: 18.6800, lng: 73.8650 }, // Moshi
  "411038": { lat: 18.6200, lng: 73.8100 }, // Wakad
  "411039": { lat: 18.6050, lng: 73.7950 }, // Punawale
  "411040": { lat: 18.5900, lng: 73.7800 }, // Tathawade
  "411041": { lat: 18.5750, lng: 73.7650 }, // Mahalunge
  "411042": { lat: 18.5600, lng: 73.7500 }, // Balewadi
  "411043": { lat: 18.5500, lng: 73.7350 }, // Nande
  "411044": { lat: 18.5300, lng: 73.7200 }, // Pirangut
  "411045": { lat: 18.5150, lng: 73.7050 }, // Mulshi
  "411046": { lat: 18.4950, lng: 73.8400 }, // Aundh South
  "411047": { lat: 18.4800, lng: 73.8550 }, // Sangvi
  "411048": { lat: 18.4650, lng: 73.8700 }, // Pimple Gurav
  "411049": { lat: 18.4500, lng: 73.8850 }, // Pimple Nilakh
  "411051": { lat: 18.5200, lng: 74.0100 }, // Viman Nagar
  "411052": { lat: 18.5350, lng: 74.0250 }, // Dhanori
  "411057": { lat: 18.5500, lng: 74.0400 }, // Wagholi
  "411058": { lat: 18.5650, lng: 74.0550 }, // Lonikand
  "411060": { lat: 18.4900, lng: 73.9400 }, // Katraj
  "411061": { lat: 18.4750, lng: 73.9550 }, // Dhankawadi
  "411062": { lat: 18.4600, lng: 73.9700 }, // Ambegaon BK
  "411068": { lat: 18.5900, lng: 73.8200 }, // Talawade
  "420001": { lat: 19.9975, lng: 73.7898 }, // Nashik
  "421001": { lat: 19.2183, lng: 73.1580 }, // Kalyan
  "421002": { lat: 19.2350, lng: 73.1750 }, // Kalyan North
  "421003": { lat: 19.2050, lng: 73.1400 }, // Kalyan South
  "421004": { lat: 19.2500, lng: 73.1900 }, // Kalyan East
  "421005": { lat: 19.1900, lng: 73.1250 }, // Kalyan West
  "421101": { lat: 19.2300, lng: 73.2200 }, // Ambernath West
  "421102": { lat: 19.2150, lng: 73.2100 }, // Ambernath East
  "421103": { lat: 19.2500, lng: 73.2400 }, // Badlapur West
  "421201": { lat: 19.2800, lng: 73.1600 }, // Ulhasnagar 1
  "421202": { lat: 19.2950, lng: 73.1750 }, // Ulhasnagar 2
  "421203": { lat: 19.3100, lng: 73.1900 }, // Ulhasnagar 3
  "421204": { lat: 19.3250, lng: 73.2050 }, // Ulhasnagar 4
  "421301": { lat: 19.1700, lng: 73.3100 }, // Murbad
  "421302": { lat: 19.1850, lng: 73.3300 }, // Shahapur
  "421303": { lat: 19.2050, lng: 73.3500 }, // Wada
  "421304": { lat: 19.2200, lng: 73.3700 }, // Palghar South
  "421305": { lat: 19.6967, lng: 73.0093 }, // Kopargaon / Shirdi area
  "421306": { lat: 19.3100, lng: 73.3900 }, // Jawhar
  "421307": { lat: 19.3300, lng: 73.4100 }, // Mokhada
  "421308": { lat: 19.3500, lng: 73.4300 }, // Vikramgad
  "421311": { lat: 19.3700, lng: 73.3500 }, // Palghar
  "421312": { lat: 19.3900, lng: 73.3700 }, // Vasai North
  "421390": { lat: 19.5500, lng: 73.2200 }, // Igatpuri
  "421399": { lat: 19.7200, lng: 73.5600 }, // Sinnar / Nandgaon area
  "421401": { lat: 19.3800, lng: 73.0600 }, // Bhiwandi
  "421402": { lat: 19.3950, lng: 73.0800 }, // Bhiwandi East
  "421501": { lat: 19.4100, lng: 72.9900 }, // Shahapur North
  "421502": { lat: 19.4250, lng: 72.9700 }, // Murbad North
  "421503": { lat: 19.4400, lng: 72.9500 }, // Wada North
  "422001": { lat: 19.9975, lng: 73.7898 }, // Nashik City
  "422002": { lat: 20.0100, lng: 73.8050 }, // Nashik East
  "422003": { lat: 19.9850, lng: 73.7750 }, // Nashik West
  "422004": { lat: 20.0250, lng: 73.8200 }, // Nashik North
  "422005": { lat: 19.9700, lng: 73.7600 }, // Nashik South
  "422006": { lat: 20.0400, lng: 73.8350 }, // Nashik Camp
  "422007": { lat: 20.0550, lng: 73.8500 }, // Deolali
  "422008": { lat: 19.9550, lng: 73.7450 }, // Nashik Road
  "422009": { lat: 19.9400, lng: 73.7300 }, // Gangapur Road
  "422010": { lat: 19.9250, lng: 73.7150 }, // Satpur
  "422011": { lat: 20.0700, lng: 73.8650 }, // Ozar
  "422012": { lat: 20.0850, lng: 73.8800 }, // Niphad
  "422013": { lat: 20.0300, lng: 73.8550 }, // Igatpuri South
  "422101": { lat: 19.8900, lng: 73.6900 }, // Dindori
  "422103": { lat: 19.8700, lng: 73.6700 }, // Chandwad
  "422105": { lat: 20.0200, lng: 74.2600 }, // Malegaon
  "422201": { lat: 20.1200, lng: 74.4100 }, // Yeola
  "422202": { lat: 20.0700, lng: 74.1500 }, // Nandgaon
  "422203": { lat: 20.1400, lng: 74.0800 }, // Manmad
  "422204": { lat: 20.0450, lng: 73.9200 }, // Sinnar
  "422205": { lat: 20.0600, lng: 74.0500 }, // Lasalgaon
  "422206": { lat: 19.9200, lng: 74.1700 }, // Kopargaon
  "422207": { lat: 19.8500, lng: 74.2300 }, // Rahata
  "422208": { lat: 19.7700, lng: 74.4800 }, // Rahuri
  "422209": { lat: 19.8100, lng: 74.3200 }, // Shrirampur
  "422210": { lat: 19.7200, lng: 74.5600 }, // Newasa
  "422211": { lat: 19.6500, lng: 74.6400 }, // Shevgaon
  "422212": { lat: 19.5800, lng: 74.7200 }, // Pathardi
  "422213": { lat: 19.6800, lng: 74.8000 }, // Jamkhed
  "422214": { lat: 19.5200, lng: 74.8800 }, // Karjat
  "422215": { lat: 19.7800, lng: 74.5200 }, // Sangamner
  "422216": { lat: 19.8600, lng: 74.4100 }, // Akole
  "422217": { lat: 19.9100, lng: 74.3500 }, // Sangamner North
  "422218": { lat: 19.9800, lng: 74.2900 }, // Sinnar East
  "422219": { lat: 20.0100, lng: 74.2200 }, // Malegaon South
  "422220": { lat: 20.0400, lng: 74.1600 }, // Yeola South
  "422221": { lat: 20.0700, lng: 74.1000 }, // Nandgaon North
  "431001": { lat: 19.8762, lng: 75.3433 }, // Aurangabad
  "440001": { lat: 21.1458, lng: 79.0882 }, // Nagpur
  "440002": { lat: 21.1600, lng: 79.1000 }, // Nagpur East
  "440003": { lat: 21.1300, lng: 79.0750 }, // Nagpur West
  "440004": { lat: 21.1750, lng: 79.1150 }, // Nagpur North
  "440008": { lat: 21.1200, lng: 79.0600 }, // Nagpur South
  "440010": { lat: 21.1050, lng: 79.0450 }, // Nagpur SW
  "440012": { lat: 21.1650, lng: 79.0850 }, // Nagpur Central
  "440013": { lat: 21.1900, lng: 79.1300 }, // Nagpur NE
  "440015": { lat: 21.2050, lng: 79.1450 }, // Nagpur Far NE
  "440017": { lat: 21.0950, lng: 79.0300 }, // Nagpur Far SW
  "440022": { lat: 21.2200, lng: 79.1600 }, // Nagpur North Far
  "440023": { lat: 21.0800, lng: 79.0150 }, // Nagpur Far West
  "440025": { lat: 21.0650, lng: 78.9950 }, // Nagpur West Far

  // ── ZONE 5: Andhra Pradesh, Telangana (50xxx-53xxx) ───────────────
  "500001": { lat: 17.3850, lng: 78.4867 }, // Hyderabad
  "500002": { lat: 17.3950, lng: 78.5000 }, // Hyderabad North
  "500003": { lat: 17.3750, lng: 78.4750 }, // Hyderabad South
  "500004": { lat: 17.4050, lng: 78.5100 }, // Secunderabad
  "500005": { lat: 17.3650, lng: 78.4650 }, // Banjara Hills
  "500006": { lat: 17.3550, lng: 78.4550 }, // Jubilee Hills
  "500007": { lat: 17.4150, lng: 78.4400 }, // Ameerpet
  "500008": { lat: 17.4250, lng: 78.4300 }, // SR Nagar
  "500009": { lat: 17.4350, lng: 78.4200 }, // Begumpet
  "500010": { lat: 17.4450, lng: 78.4100 }, // Marredpally
  "500011": { lat: 17.4550, lng: 78.5200 }, // Malkajgiri
  "500012": { lat: 17.4650, lng: 78.5350 }, // Alwal
  "500013": { lat: 17.4750, lng: 78.5500 }, // Yapral
  "500014": { lat: 17.3450, lng: 78.5100 }, // LB Nagar
  "500015": { lat: 17.3350, lng: 78.5200 }, // Hayathnagar
  "500016": { lat: 17.4850, lng: 78.3200 }, // Patancheru
  "500017": { lat: 17.4950, lng: 78.3350 }, // Balanagar
  "500018": { lat: 17.5050, lng: 78.3500 }, // Chintal
  "500019": { lat: 17.3250, lng: 78.5450 }, // Saroornagar
  "500020": { lat: 17.3150, lng: 78.4650 }, // Mehdipatnam
  "500021": { lat: 17.3050, lng: 78.4750 }, // Santoshnagar
  "500022": { lat: 17.2950, lng: 78.4850 }, // Mansoorabad
  "500023": { lat: 17.2850, lng: 78.4950 }, // Kothapet
  "500024": { lat: 17.2750, lng: 78.5050 }, // Nagole
  "500025": { lat: 17.3800, lng: 78.3900 }, // Kukatpally
  "500026": { lat: 17.3700, lng: 78.3800 }, // KPHB
  "500027": { lat: 17.3600, lng: 78.3700 }, // Miyapur
  "500028": { lat: 17.3500, lng: 78.3600 }, // Chandanagar
  "500029": { lat: 17.3400, lng: 78.3500 }, // Kondapur
  "500030": { lat: 17.3300, lng: 78.3400 }, // Gachibowli
  "500031": { lat: 17.3200, lng: 78.3300 }, // Nanakramguda
  "500032": { lat: 17.3100, lng: 78.3200 }, // Financial District
  "500033": { lat: 17.3000, lng: 78.3100 }, // Manikonda
  "500034": { lat: 17.4900, lng: 78.4800 }, // Trimulgherry
  "500035": { lat: 17.5000, lng: 78.4900 }, // Bowenpally
  "500036": { lat: 17.5100, lng: 78.5000 }, // Kompally
  "500037": { lat: 17.4000, lng: 78.5400 }, // Uppal
  "500038": { lat: 17.4100, lng: 78.5550 }, // Nacharam
  "500039": { lat: 17.4200, lng: 78.5700 }, // Rampally
  "500040": { lat: 17.4300, lng: 78.5850 }, // Ghatkesar
  "500041": { lat: 17.4400, lng: 78.6000 }, // Keesara
  "500042": { lat: 17.3450, lng: 78.4350 }, // Tolichowki
  "500043": { lat: 17.3350, lng: 78.4250 }, // Rethibowli
  "500044": { lat: 17.3250, lng: 78.4150 }, // Attapur
  "500045": { lat: 17.3150, lng: 78.4050 }, // Rajendra Nagar
  "500046": { lat: 17.3050, lng: 78.3950 }, // Shamshabad
  "500047": { lat: 17.4450, lng: 78.3800 }, // Pragati Nagar
  "500048": { lat: 17.4350, lng: 78.3700 }, // JNTU
  "500049": { lat: 17.4250, lng: 78.3600 }, // Bachupally
  "500050": { lat: 17.4150, lng: 78.3500 }, // Nizampet
  "500051": { lat: 17.5200, lng: 78.5200 }, // Quthbullapur
  "500052": { lat: 17.5350, lng: 78.5400 }, // Medchal
  "500053": { lat: 17.5500, lng: 78.5600 }, // Ameenpur
  "500054": { lat: 17.5650, lng: 78.5800 }, // Sangareddy
  "500055": { lat: 17.2650, lng: 78.5250 }, // Vanasthalipuram
  "500056": { lat: 17.2550, lng: 78.5350 }, // Bandlaguda
  "500057": { lat: 17.2450, lng: 78.5450 }, // Meerpet
  "500058": { lat: 17.2350, lng: 78.5550 }, // Saroor Nagar
  "500059": { lat: 17.2250, lng: 78.5650 }, // Badangpet
  "500060": { lat: 17.2150, lng: 78.5750 }, // Ranga Reddy
  "500061": { lat: 17.5800, lng: 78.5000 }, // Gajularamaram
  "500062": { lat: 17.5950, lng: 78.5150 }, // Dundigal
  "500063": { lat: 17.6100, lng: 78.5300 }, // Bibinagar
  "500064": { lat: 17.2000, lng: 78.5450 }, // Ibrahimpatnam
  "500065": { lat: 17.1900, lng: 78.5350 }, // Yadadri
  "500066": { lat: 17.3900, lng: 78.6100 }, // Pocharam
  "500067": { lat: 17.3800, lng: 78.6250 }, // Ghatkesar East
  "500068": { lat: 17.3700, lng: 78.6400 }, // Bibinagar South
  "500070": { lat: 17.3600, lng: 78.6550 }, // Yadagirigutta
  "500072": { lat: 17.3500, lng: 78.6700 }, // Jangaon
  "500073": { lat: 17.3400, lng: 78.6850 }, // Warangal South
  "500074": { lat: 17.3300, lng: 78.7000 }, // Warangal West
  "500075": { lat: 17.3200, lng: 78.7150 }, // Warangal North
  "500076": { lat: 17.5150, lng: 78.3900 }, // Bheemunipatnam
  "500078": { lat: 17.5050, lng: 78.3800 }, // Isnapur
  "500079": { lat: 17.4950, lng: 78.3700 }, // Pattancheru South
  "500080": { lat: 17.4850, lng: 78.3600 }, // Sangareddy South
  "500081": { lat: 17.4750, lng: 78.3500 }, // Zaheerabad
  "500082": { lat: 17.4650, lng: 78.3400 }, // Narayankhed
  "500083": { lat: 17.4550, lng: 78.3300 }, // Jogipet
  "500084": { lat: 17.4450, lng: 78.3200 }, // Vikarabad
  "500085": { lat: 17.4350, lng: 78.3100 }, // Tandur
  "500086": { lat: 17.4250, lng: 78.3000 }, // Kadthal
  "500087": { lat: 17.4150, lng: 78.2900 }, // Shadnagar
  "500088": { lat: 17.4050, lng: 78.2800 }, // Mahbubnagar
  "500089": { lat: 17.3950, lng: 78.2700 }, // Jadcherla
  "500090": { lat: 17.3850, lng: 78.2600 }, // Wanaparthy
  "500091": { lat: 17.3750, lng: 78.2500 }, // Gadwal
  "500092": { lat: 17.3650, lng: 78.2400 }, // Raichur
  "500093": { lat: 17.3550, lng: 78.2300 }, // Kurnool
  "500094": { lat: 17.3450, lng: 78.2200 }, // Nandyal
  "500095": { lat: 17.3350, lng: 78.2100 }, // Srisailam
  "500096": { lat: 17.3250, lng: 78.2000 }, // Nagarjunasagar
  "500097": { lat: 17.3150, lng: 78.1900 }, // Miryalaguda
  "500098": { lat: 17.3050, lng: 78.1800 }, // Nalgonda
  "500099": { lat: 17.2950, lng: 78.1700 }, // Suryapet
  "530001": { lat: 17.6868, lng: 83.2185 }, // Visakhapatnam
  "520001": { lat: 16.5062, lng: 80.6480 }, // Vijayawada
  "522001": { lat: 16.4307, lng: 80.5525 }, // Guntur

  // ── ZONE 6: Karnataka (56xxx-59xxx) ───────────────────────────────
  "560001": { lat: 12.9716, lng: 77.5946 }, // Bangalore City
  "560002": { lat: 12.9800, lng: 77.6050 }, // Bangalore East
  "560003": { lat: 12.9650, lng: 77.5850 }, // Bangalore South
  "560004": { lat: 12.9900, lng: 77.6150 }, // Shivajinagar
  "560005": { lat: 12.9550, lng: 77.5750 }, // Basavanagudi
  "560006": { lat: 13.0000, lng: 77.5700 }, // Rajajinagar
  "560007": { lat: 12.9450, lng: 77.5650 }, // Jayanagar
  "560008": { lat: 13.0100, lng: 77.5600 }, // Malleshwaram
  "560009": { lat: 12.9350, lng: 77.5550 }, // BTM Layout
  "560010": { lat: 13.0200, lng: 77.5500 }, // Yeshwanthpur
  "560011": { lat: 12.9250, lng: 77.5450 }, // JP Nagar
  "560012": { lat: 13.0300, lng: 77.5400 }, // Peenya
  "560013": { lat: 12.9150, lng: 77.5350 }, // Kanakapura Road
  "560014": { lat: 13.0400, lng: 77.5300 }, // Nagasandra
  "560015": { lat: 12.9050, lng: 77.5250 }, // Bannerghatta Road
  "560016": { lat: 13.0500, lng: 77.5200 }, // Tumkur Road
  "560017": { lat: 12.8950, lng: 77.5150 }, // Electronic City
  "560018": { lat: 13.0600, lng: 77.5100 }, // Hesaraghatta Road
  "560019": { lat: 12.8850, lng: 77.5050 }, // Anekal
  "560020": { lat: 13.0700, lng: 77.5650 }, // Yelahanka
  "560021": { lat: 12.9950, lng: 77.6800 }, // Indiranagar
  "560022": { lat: 13.0050, lng: 77.6400 }, // Banaswadi
  "560023": { lat: 13.0150, lng: 77.6900 }, // HBR Layout
  "560024": { lat: 13.0250, lng: 77.6550 }, // Sahakar Nagar
  "560025": { lat: 12.9850, lng: 77.7200 }, // Ramamurthy Nagar
  "560026": { lat: 13.0350, lng: 77.7000 }, // Kammanahalli
  "560027": { lat: 12.9750, lng: 77.7500 }, // Tin Factory
  "560028": { lat: 13.0450, lng: 77.7200 }, // Horamavu
  "560029": { lat: 12.9650, lng: 77.7800 }, // KR Puram
  "560030": { lat: 13.0550, lng: 77.7400 }, // Kothanur
  "560032": { lat: 12.9550, lng: 77.8100 }, // Whitefield
  "560033": { lat: 12.9450, lng: 77.8400 }, // Varthur
  "560034": { lat: 12.9350, lng: 77.8700 }, // Marathahalli
  "560035": { lat: 12.9250, lng: 77.9000 }, // Sarjapura
  "560036": { lat: 12.9150, lng: 77.9300 }, // Anekal South
  "560037": { lat: 12.9050, lng: 77.9600 }, // Begur
  "560038": { lat: 12.8950, lng: 77.9900 }, // Jigani
  "560040": { lat: 12.9700, lng: 77.6250 }, // Koramangala
  "560041": { lat: 12.9600, lng: 77.6400 }, // HSR Layout
  "560042": { lat: 12.9500, lng: 77.6550 }, // Bellandur
  "560043": { lat: 12.9400, lng: 77.6700 }, // Carmelaram
  "560045": { lat: 12.9300, lng: 77.6850 }, // Outer Ring Road
  "560046": { lat: 12.9200, lng: 77.7000 }, // Sarjapur Road
  "560047": { lat: 12.9100, lng: 77.7150 }, // Attibele
  "560048": { lat: 12.9000, lng: 77.7300 }, // Bommasandra
  "560049": { lat: 12.8900, lng: 77.7450 }, // Electronics City Phase 2
  "560050": { lat: 12.9250, lng: 77.5050 }, // Uttarahalli
  "560051": { lat: 12.9150, lng: 77.5150 }, // Kengeri
  "560052": { lat: 12.9050, lng: 77.5250 }, // Mysore Road
  "560053": { lat: 12.8950, lng: 77.5350 }, // Rajarajeshwari Nagar
  "560054": { lat: 12.8850, lng: 77.5450 }, // Nagarabhavispur
  "560055": { lat: 12.8750, lng: 77.5550 }, // Kanakapura
  "560056": { lat: 12.8650, lng: 77.5650 }, // Bidadi
  "560057": { lat: 12.8550, lng: 77.5750 }, // Ramanagara
  "560058": { lat: 12.8450, lng: 77.5850 }, // Channapatna
  "560059": { lat: 12.8350, lng: 77.5950 }, // Maddur
  "560060": { lat: 12.8250, lng: 77.6050 }, // Mandya
  "560062": { lat: 13.1100, lng: 77.5800 }, // Yelahanka North
  "560063": { lat: 13.1200, lng: 77.5900 }, // Doddaballapur
  "560064": { lat: 13.1300, lng: 77.6000 }, // Devanahalli
  "560065": { lat: 13.1400, lng: 77.6100 }, // Nandi Hills
  "560066": { lat: 13.1500, lng: 77.6200 }, // Chikkaballapur
  "560067": { lat: 13.1600, lng: 77.6300 }, // Gauribidanur
  "560068": { lat: 13.1700, lng: 77.6400 }, // Hindupur
  "560069": { lat: 13.1800, lng: 77.6500 }, // Penukonda
  "560070": { lat: 12.9350, lng: 77.5150 }, // Padmanabhanagar
  "560071": { lat: 12.9250, lng: 77.5200 }, // Ideal Homes
  "560072": { lat: 12.9150, lng: 77.5300 }, // Nagadevanahalli
  "560073": { lat: 12.9050, lng: 77.5400 }, // Thubarahalli
  "560074": { lat: 12.9650, lng: 77.5300 }, // Vijayanagar
  "560075": { lat: 12.9750, lng: 77.5200 }, // Chord Road
  "560076": { lat: 12.9850, lng: 77.5100 }, // Mahalakshmi Layout
  "560078": { lat: 13.0900, lng: 77.5650 }, // Bagalur
  "560079": { lat: 13.0800, lng: 77.5750 }, // Yelahanka South
  "560080": { lat: 13.0700, lng: 77.5850 }, // Hebbal
  "560082": { lat: 13.0600, lng: 77.5950 }, // Thanisandra
  "560083": { lat: 13.0500, lng: 77.6050 }, // Byatarayanapura
  "560084": { lat: 13.0400, lng: 77.6150 }, // Amruthahalli
  "560085": { lat: 13.0300, lng: 77.6250 }, // HMT Layout
  "560086": { lat: 13.0200, lng: 77.6350 }, // Mathikere
  "560087": { lat: 13.0100, lng: 77.6450 }, // Gayathrinagar
  "560088": { lat: 13.0000, lng: 77.6550 }, // Benson Town
  "560089": { lat: 12.9900, lng: 77.6650 }, // Cox Town
  "560091": { lat: 12.9800, lng: 77.6750 }, // Richmond Town
  "560092": { lat: 12.9700, lng: 77.6850 }, // Langford Town
  "560093": { lat: 12.9600, lng: 77.6950 }, // Austin Town
  "560094": { lat: 12.9500, lng: 77.7050 }, // Frazer Town
  "560095": { lat: 12.9400, lng: 77.7150 }, // Cleveland Town
  "560096": { lat: 12.9300, lng: 77.7250 }, // Shivaji Nagar East
  "560097": { lat: 12.9200, lng: 77.7350 }, // Ulsoor
  "560098": { lat: 12.9100, lng: 77.7450 }, // HAL
  "560099": { lat: 12.9000, lng: 77.7550 }, // Domlur
  "560100": { lat: 12.8900, lng: 77.7650 }, // Old Airport Road
  "560103": { lat: 12.8800, lng: 77.7750 }, // Ejipura
  "560102": { lat: 12.8700, lng: 77.7850 }, // Vivek Nagar
  "570001": { lat: 12.2958, lng: 76.6394 }, // Mysore
  "575001": { lat: 12.8698, lng: 74.8435 }, // Mangalore
  "580001": { lat: 15.3647, lng: 75.1240 }, // Hubli
  "590001": { lat: 15.8497, lng: 74.4977 }, // Belgaum / Belagavi

  // ── ZONE 7: Tamil Nadu, Kerala (60xxx-69xxx) ───────────────────────
  "600001": { lat: 13.0827, lng: 80.2707 }, // Chennai Fort
  "600002": { lat: 13.0950, lng: 80.2850 }, // Chennai North
  "600003": { lat: 13.0700, lng: 80.2600 }, // Chennai South
  "600004": { lat: 13.0600, lng: 80.2750 }, // Chennai Central
  "600005": { lat: 13.0800, lng: 80.2900 }, // Washermanpet
  "600006": { lat: 13.1100, lng: 80.2500 }, // Perambur
  "600007": { lat: 13.1200, lng: 80.2600 }, // Royapuram
  "600008": { lat: 13.0500, lng: 80.2500 }, // Chintadripet
  "600009": { lat: 13.0400, lng: 80.2600 }, // Triplicane
  "600010": { lat: 13.0300, lng: 80.2700 }, // Mylapore
  "600011": { lat: 13.0200, lng: 80.2800 }, // Adyar
  "600012": { lat: 13.0100, lng: 80.2900 }, // Besant Nagar
  "600013": { lat: 13.0000, lng: 80.3000 }, // Thiruvanmiyur
  "600014": { lat: 12.9900, lng: 80.3100 }, // Perungudi
  "600015": { lat: 12.9800, lng: 80.3200 }, // Sholinganallur
  "600016": { lat: 12.9700, lng: 80.3300 }, // Perumbakkam
  "600017": { lat: 12.9600, lng: 80.3400 }, // Medavakkam
  "600018": { lat: 13.0650, lng: 80.2400 }, // Aminjikarai
  "600019": { lat: 13.0750, lng: 80.2300 }, // Anna Nagar
  "600020": { lat: 13.0850, lng: 80.2200 }, // Mogappair
  "600021": { lat: 13.0950, lng: 80.2100 }, // Ambattur
  "600022": { lat: 13.1050, lng: 80.2000 }, // Avadi
  "600023": { lat: 13.1150, lng: 80.1900 }, // Thiruvallur
  "600024": { lat: 13.1250, lng: 80.1800 }, // Poonamallee
  "600025": { lat: 13.1350, lng: 80.1700 }, // Porur
  "600026": { lat: 13.1450, lng: 80.1600 }, // Kundrathur
  "600027": { lat: 13.1550, lng: 80.1500 }, // Pammal
  "600028": { lat: 13.1650, lng: 80.1400 }, // Pallavaram
  "600029": { lat: 13.1750, lng: 80.1300 }, // Chromepet
  "600030": { lat: 13.1850, lng: 80.1200 }, // Tambaram
  "600031": { lat: 13.0550, lng: 80.2150 }, // Valasaravakkam
  "600032": { lat: 13.0450, lng: 80.2250 }, // Saligramam
  "600033": { lat: 13.0350, lng: 80.2350 }, // Virugambakkam
  "600034": { lat: 13.0250, lng: 80.2450 }, // KK Nagar
  "600035": { lat: 13.0150, lng: 80.2550 }, // Vadapalani
  "600036": { lat: 13.0050, lng: 80.2650 }, // Kodambakkam
  "600037": { lat: 12.9950, lng: 80.2750 }, // T Nagar
  "600038": { lat: 12.9850, lng: 80.2850 }, // Nungambakkam
  "600039": { lat: 12.9750, lng: 80.2950 }, // Egmore
  "600040": { lat: 12.9650, lng: 80.3050 }, // Park Town
  "600041": { lat: 12.9550, lng: 80.3150 }, // George Town
  "600042": { lat: 12.9450, lng: 80.3250 }, // Sowcarpet
  "600043": { lat: 12.9350, lng: 80.3350 }, // Basin Bridge
  "600044": { lat: 12.9250, lng: 80.3450 }, // Pulianthope
  "600045": { lat: 12.9150, lng: 80.3550 }, // Villivakkam
  "600046": { lat: 12.9050, lng: 80.3650 }, // Kolathur
  "600047": { lat: 12.8950, lng: 80.3750 }, // Madhavaram
  "600048": { lat: 12.8850, lng: 80.3850 }, // Manali
  "600049": { lat: 12.8750, lng: 80.3950 }, // Ennore
  "600050": { lat: 12.8650, lng: 80.4050 }, // Kathivakkam
  "600051": { lat: 13.0800, lng: 80.3100 }, // Tondiarpet
  "600052": { lat: 13.0900, lng: 80.3200 }, // New Washermanpet
  "600053": { lat: 13.1000, lng: 80.3300 }, // Tiruvottiyur
  "600054": { lat: 13.1100, lng: 80.3400 }, // Kathivakkam East
  "600055": { lat: 13.1200, lng: 80.3500 }, // Manali East
  "600056": { lat: 13.1300, lng: 80.3600 }, // Madhavaram East
  "600057": { lat: 13.1400, lng: 80.3700 }, // Kolathur East
  "600058": { lat: 13.1500, lng: 80.3800 }, // Villivakkam East
  "600059": { lat: 13.1600, lng: 80.3900 }, // Pulianthope East
  "600060": { lat: 13.1700, lng: 80.4000 }, // Basin Bridge East
  "600061": { lat: 13.0250, lng: 80.1850 }, // Mangadu
  "600062": { lat: 13.0150, lng: 80.1750 }, // Poonamallee South
  "600063": { lat: 13.0050, lng: 80.1650 }, // Maduravoyal
  "600064": { lat: 12.9950, lng: 80.1550 }, // Kattupakkam
  "600065": { lat: 12.9850, lng: 80.1450 }, // Iyyapanthangal
  "600066": { lat: 12.9750, lng: 80.1350 }, // Alwarthirunagar
  "600067": { lat: 12.9650, lng: 80.1250 }, // Mugalivakkam
  "600068": { lat: 12.9550, lng: 80.1150 }, // Meenambakkam
  "600069": { lat: 12.9450, lng: 80.1050 }, // Chennai Airport
  "600070": { lat: 12.9350, lng: 80.0950 }, // Alandur
  "600071": { lat: 12.9250, lng: 80.0850 }, // St Thomas Mount
  "600072": { lat: 12.9150, lng: 80.0750 }, // Guindy
  "600073": { lat: 12.9050, lng: 80.0650 }, // Saidapet
  "600074": { lat: 12.8950, lng: 80.0550 }, // Nandambakkam
  "600075": { lat: 12.8850, lng: 80.0450 }, // Nanganallur
  "600076": { lat: 12.8750, lng: 80.0350 }, // Ullagaram
  "600077": { lat: 12.8650, lng: 80.0250 }, // Perungalathur
  "600078": { lat: 12.8550, lng: 80.0150 }, // Mudichur
  "600079": { lat: 12.8450, lng: 80.0050 }, // Urapakkam
  "600080": { lat: 12.8350, lng: 79.9950 }, // Vandalur
  "600081": { lat: 12.8250, lng: 79.9850 }, // Padappai
  "600082": { lat: 12.8150, lng: 79.9750 }, // Maraimalai Nagar
  "600083": { lat: 12.8050, lng: 79.9650 }, // Singaperumal Koil
  "600084": { lat: 12.7950, lng: 79.9550 }, // Chengalpattu
  "600085": { lat: 12.7850, lng: 79.9450 }, // Madurantakam
  "600086": { lat: 12.7750, lng: 79.9350 }, // Tindivanam
  "600087": { lat: 12.7650, lng: 79.9250 }, // Villupuram
  "600088": { lat: 12.7550, lng: 79.9150 }, // Cuddalore
  "600089": { lat: 12.7450, lng: 79.9050 }, // Pondicherry
  "600090": { lat: 12.7350, lng: 79.8950 }, // Karaikal
  "600091": { lat: 13.0700, lng: 80.3050 }, // Sembium
  "600092": { lat: 13.0600, lng: 80.3150 }, // Choolai
  "600093": { lat: 13.0500, lng: 80.3250 }, // Kodungaiyur
  "600094": { lat: 13.0400, lng: 80.3350 }, // Otteri
  "600095": { lat: 13.0300, lng: 80.3450 }, // Vepery
  "600096": { lat: 13.0200, lng: 80.3550 }, // Periamet
  "600097": { lat: 13.0100, lng: 80.3650 }, // Purasawalkam
  "600098": { lat: 13.0000, lng: 80.3750 }, // Kilpauk
  "600099": { lat: 12.9900, lng: 80.3850 }, // Chetpet
  "600100": { lat: 12.9800, lng: 80.3950 }, // Shenoy Nagar
  "620001": { lat: 10.7905, lng: 78.7047 }, // Tiruchirappalli
  "625001": { lat: 9.9252, lng: 78.1198 },  // Madurai
  "641001": { lat: 11.0168, lng: 76.9558 }, // Coimbatore
  "641004": { lat: 11.0300, lng: 76.9700 }, // Coimbatore East
  "641007": { lat: 11.0050, lng: 76.9400 }, // Coimbatore South
  "641011": { lat: 11.0450, lng: 76.9850 }, // Coimbatore North
  "641035": { lat: 11.0600, lng: 77.0000 }, // Coimbatore NE
  "641045": { lat: 10.9900, lng: 76.9250 }, // Coimbatore SW
  "682001": { lat: 9.9312, lng: 76.2673 },  // Kochi / Ernakulam
  "682002": { lat: 9.9450, lng: 76.2800 },  // Kochi North
  "682016": { lat: 9.9200, lng: 76.2600 },  // Kochi South
  "682017": { lat: 9.9600, lng: 76.2950 },  // Kakkanad
  "682018": { lat: 9.9750, lng: 76.3100 },  // Infopark
  "682019": { lat: 9.9050, lng: 76.2450 },  // Edapally
  "682020": { lat: 9.8900, lng: 76.2300 },  // Vytilla
  "682021": { lat: 9.8750, lng: 76.2150 },  // Tripunithura
  "682022": { lat: 9.8600, lng: 76.2000 },  // Maradu
  "682023": { lat: 9.8450, lng: 76.1850 },  // Thripunithura South
  "682024": { lat: 9.9350, lng: 76.2700 },  // Fort Kochi
  "682025": { lat: 9.9500, lng: 76.2850 },  // Mattancherry
  "682026": { lat: 9.9650, lng: 76.3000 },  // Willingdon Island
  "682027": { lat: 9.9800, lng: 76.3150 },  // Cherai
  "682028": { lat: 9.9950, lng: 76.3300 },  // Paravur
  "682029": { lat: 10.0100, lng: 76.3450 }, // Aluva
  "682030": { lat: 10.0250, lng: 76.3600 }, // Perumbavoor
  "682031": { lat: 10.0400, lng: 76.3750 }, // Kothamangalam
  "682032": { lat: 9.9150, lng: 76.2500 },  // Kochi West
  "682301": { lat: 10.0550, lng: 76.3200 }, // North Paravur
  "682302": { lat: 10.0700, lng: 76.3050 }, // Chellanam
  "682303": { lat: 10.0850, lng: 76.2900 }, // Njarakkal
  "682304": { lat: 10.1000, lng: 76.2750 }, // Mulavukad
  "682305": { lat: 10.1150, lng: 76.2600 }, // Vypin
  "682306": { lat: 10.1300, lng: 76.2450 }, // Kadamakudy
  "682307": { lat: 10.1450, lng: 76.2300 }, // Kuruppampady
  "682308": { lat: 10.1600, lng: 76.2150 }, // Muvattupuzha
  "682309": { lat: 10.1750, lng: 76.2000 }, // Kolenchery
  "682310": { lat: 10.1900, lng: 76.1850 }, // Piravom
  "695001": { lat: 8.5241, lng: 76.9366 },  // Thiruvananthapuram
  "695003": { lat: 8.5400, lng: 76.9500 },  // Trivandrum North
  "695004": { lat: 8.5100, lng: 76.9200 },  // Trivandrum South

  // ── ZONE 8: West Bengal, Odisha, Bihar, Jharkhand (70xxx-85xxx) ───
  "700001": { lat: 22.5726, lng: 88.3639 }, // Kolkata BBD Bagh
  "700002": { lat: 22.5850, lng: 88.3750 }, // Kolkata North
  "700003": { lat: 22.5600, lng: 88.3550 }, // Kolkata South
  "700004": { lat: 22.5750, lng: 88.3650 }, // Shyambazar
  "700005": { lat: 22.5650, lng: 88.3450 }, // Chitpur
  "700006": { lat: 22.5550, lng: 88.3350 }, // Park Circus
  "700007": { lat: 22.5450, lng: 88.3250 }, // Bhawanipur
  "700008": { lat: 22.5350, lng: 88.3150 }, // Tollygunge
  "700009": { lat: 22.5250, lng: 88.3050 }, // Behala
  "700010": { lat: 22.5150, lng: 88.2950 }, // Joka
  "700011": { lat: 22.5850, lng: 88.3950 }, // Belgharia
  "700012": { lat: 22.5950, lng: 88.4050 }, // Barrackpore
  "700013": { lat: 22.6050, lng: 88.4150 }, // Titagarh
  "700014": { lat: 22.6150, lng: 88.4250 }, // Panihati
  "700015": { lat: 22.6250, lng: 88.4350 }, // Sodepur
  "700016": { lat: 22.6350, lng: 88.4450 }, // Khardah
  "700017": { lat: 22.6450, lng: 88.4550 }, // Kamarhati
  "700018": { lat: 22.5800, lng: 88.4450 }, // Dum Dum
  "700019": { lat: 22.5700, lng: 88.4350 }, // Nager Bazar
  "700020": { lat: 22.5600, lng: 88.4250 }, // Lake Gardens
  "700021": { lat: 22.5500, lng: 88.4150 }, // Jadavpur
  "700022": { lat: 22.5400, lng: 88.4050 }, // Kasba
  "700023": { lat: 22.5300, lng: 88.3950 }, // Golf Green
  "700024": { lat: 22.5200, lng: 88.3850 }, // Gariahat
  "700025": { lat: 22.5100, lng: 88.3750 }, // Dhakuria
  "700026": { lat: 22.5000, lng: 88.3650 }, // Ballygunge
  "700027": { lat: 22.4900, lng: 88.3550 }, // Alipore
  "700028": { lat: 22.4800, lng: 88.3450 }, // New Alipore
  "700029": { lat: 22.4700, lng: 88.3350 }, // Thakurpukur
  "700030": { lat: 22.4600, lng: 88.3250 }, // Maheshtala
  "700031": { lat: 22.5900, lng: 88.3550 }, // Howrah
  "700032": { lat: 22.6000, lng: 88.3450 }, // Shibpur
  "700033": { lat: 22.6100, lng: 88.3350 }, // Bally
  "700034": { lat: 22.6200, lng: 88.3250 }, // Liluah
  "700035": { lat: 22.6300, lng: 88.3150 }, // Sankrail
  "700036": { lat: 22.6400, lng: 88.3050 }, // Domjur
  "700037": { lat: 22.6500, lng: 88.2950 }, // Jagacha
  "700038": { lat: 22.6600, lng: 88.2850 }, // Uluberia
  "700039": { lat: 22.6700, lng: 88.2750 }, // Bagnan
  "700040": { lat: 22.6800, lng: 88.2650 }, // Amta
  "700041": { lat: 22.4500, lng: 88.3150 }, // Rajpur Sonarpur
  "700042": { lat: 22.4400, lng: 88.3050 }, // Garia
  "700043": { lat: 22.4300, lng: 88.2950 }, // Narendrapur
  "700044": { lat: 22.4200, lng: 88.2850 }, // Sonarpur
  "700045": { lat: 22.4100, lng: 88.2750 }, // Baruipur
  "700046": { lat: 22.4000, lng: 88.2650 }, // Canning
  "700047": { lat: 22.3900, lng: 88.2550 }, // Mathurapur
  "700048": { lat: 22.3800, lng: 88.2450 }, // Diamond Harbour
  "700049": { lat: 22.3700, lng: 88.2350 }, // Falta
  "700050": { lat: 22.3600, lng: 88.2250 }, // Kakdwip
  "700051": { lat: 22.5450, lng: 88.3650 }, // Salt Lake
  "700052": { lat: 22.5550, lng: 88.3750 }, // New Town
  "700053": { lat: 22.5650, lng: 88.3850 }, // Rajarhat
  "700054": { lat: 22.5750, lng: 88.3950 }, // Madhyamgram
  "700055": { lat: 22.5850, lng: 88.4050 }, // Barasat
  "700056": { lat: 22.5950, lng: 88.4150 }, // Habra
  "700057": { lat: 22.6050, lng: 88.4250 }, // Bangaon
  "700058": { lat: 22.6150, lng: 88.4350 }, // Basirhat
  "700059": { lat: 22.6250, lng: 88.4450 }, // Deganga
  "700060": { lat: 22.6350, lng: 88.4550 }, // Baduria
  "700061": { lat: 22.5150, lng: 88.3750 }, // Santoshpur
  "700062": { lat: 22.5050, lng: 88.3850 }, // Regent Park
  "700063": { lat: 22.4950, lng: 88.3950 }, // Phoolbagan
  "700064": { lat: 22.4850, lng: 88.4050 }, // Maniktala
  "700065": { lat: 22.4750, lng: 88.4150 }, // Narkeldanga
  "700066": { lat: 22.4650, lng: 88.4250 }, // Ultadanga
  "700067": { lat: 22.4550, lng: 88.4350 }, // Bidhannagar
  "700068": { lat: 22.4450, lng: 88.4450 }, // Teghoria
  "700069": { lat: 22.4350, lng: 88.4550 }, // Baguiati
  "700070": { lat: 22.4250, lng: 88.4650 }, // Kaikhali
  "700071": { lat: 22.5200, lng: 88.3350 }, // Bow Bazar
  "700072": { lat: 22.5100, lng: 88.3250 }, // College Street
  "700073": { lat: 22.5000, lng: 88.3150 }, // Shyampur
  "700074": { lat: 22.4900, lng: 88.3050 }, // Kalighat
  "700075": { lat: 22.4800, lng: 88.2950 }, // Russel Street
  "700076": { lat: 22.4700, lng: 88.2850 }, // Free School Street
  "700077": { lat: 22.4600, lng: 88.2750 }, // Loudon Street
  "700078": { lat: 22.4500, lng: 88.2650 }, // Park Street
  "700079": { lat: 22.4400, lng: 88.2550 }, // AJC Bose Road
  "700080": { lat: 22.4300, lng: 88.2450 }, // Camac Street
  "700091": { lat: 22.4200, lng: 88.3550 }, // Tollygunge South
  "700092": { lat: 22.4100, lng: 88.3650 }, // Bansdroni
  "700093": { lat: 22.4000, lng: 88.3750 }, // Haridevpur
  "700094": { lat: 22.3900, lng: 88.3850 }, // Santoshpur South
  "700095": { lat: 22.3800, lng: 88.3950 }, // Andul
  "700096": { lat: 22.3700, lng: 88.4050 }, // Mourigram
  "700097": { lat: 22.3600, lng: 88.4150 }, // Dankuni
  "700098": { lat: 22.3500, lng: 88.4250 }, // Rishra
  "700099": { lat: 22.3400, lng: 88.4350 }, // Serampore
  "700100": { lat: 22.3300, lng: 88.4450 }, // Chandannagar
  "711101": { lat: 22.6500, lng: 88.3100 }, // Howrah District
  "712101": { lat: 22.8645, lng: 88.3942 }, // Hooghly
  "713101": { lat: 23.2324, lng: 87.8615 }, // Burdwan
  "751001": { lat: 20.2961, lng: 85.8245 }, // Bhubaneswar
  "751002": { lat: 20.3100, lng: 85.8400 }, // Bhubaneswar North
  "753001": { lat: 20.4625, lng: 85.8828 }, // Cuttack
  "800001": { lat: 25.5941, lng: 85.1376 }, // Patna
  "800002": { lat: 25.6050, lng: 85.1500 }, // Patna North
  "800004": { lat: 25.5800, lng: 85.1250 }, // Patna South
  "800006": { lat: 25.6200, lng: 85.1650 }, // Patna East
  "800008": { lat: 25.5650, lng: 85.1100 }, // Patna West
  "811101": { lat: 25.3176, lng: 85.5142 }, // Nalanda
  "814001": { lat: 24.4834, lng: 87.3186 }, // Dumka
  "826001": { lat: 23.8315, lng: 86.4340 }, // Dhanbad
  "831001": { lat: 22.8046, lng: 86.2029 }, // Jamshedpur
  "834001": { lat: 23.3441, lng: 85.3096 }, // Ranchi

  // ── ZONE 9: Assam, NE, MP, Chhattisgarh (46xxx-49xxx, 78xxx-79xxx) ──
  "462001": { lat: 23.2599, lng: 77.4126 }, // Bhopal
  "462002": { lat: 23.2700, lng: 77.4250 }, // Bhopal North
  "462003": { lat: 23.2500, lng: 77.4000 }, // Bhopal South
  "462011": { lat: 23.2850, lng: 77.4400 }, // Bhopal East
  "462016": { lat: 23.2400, lng: 77.3850 }, // Bhopal West
  "462023": { lat: 23.2300, lng: 77.3700 }, // Berasia Road
  "462026": { lat: 23.3000, lng: 77.4550 }, // Habibganj
  "462030": { lat: 23.3150, lng: 77.4700 }, // Karond
  "462031": { lat: 23.3300, lng: 77.4850 }, // Bhel
  "462038": { lat: 23.3450, lng: 77.5000 }, // Mandideep
  "462039": { lat: 23.3600, lng: 77.5150 }, // Raisen
  "462040": { lat: 23.3750, lng: 77.5300 }, // Vidisha
  "462041": { lat: 23.3900, lng: 77.5450 }, // Sehore
  "462042": { lat: 23.4050, lng: 77.5600 }, // Ashta
  "462043": { lat: 23.4200, lng: 77.5750 }, // Budhni
  "462044": { lat: 23.4350, lng: 77.5900 }, // Hoshangabad
  "462045": { lat: 23.4500, lng: 77.6050 }, // Pipariya
  "462046": { lat: 23.4650, lng: 77.6200 }, // Narsimhapur
  "462066": { lat: 23.4800, lng: 77.6350 }, // Gadarwara
  "482001": { lat: 23.1815, lng: 79.9864 }, // Jabalpur
  "490001": { lat: 21.2514, lng: 81.6296 }, // Raipur
  "491001": { lat: 21.4609, lng: 81.3789 }, // Durg
  "492001": { lat: 21.2514, lng: 81.6296 }, // Raipur City
  "781001": { lat: 26.1445, lng: 91.7362 }, // Guwahati
  "781003": { lat: 26.1600, lng: 91.7500 }, // Guwahati North
  "781005": { lat: 26.1300, lng: 91.7200 }, // Guwahati South
  "781007": { lat: 26.1750, lng: 91.7650 }, // Guwahati East
  "782001": { lat: 26.3200, lng: 92.2690 }, // Nagaon
  "783101": { lat: 26.3280, lng: 89.8600 }, // Dhubri
  "784001": { lat: 26.6338, lng: 93.5769 }, // Jorhat
  "785001": { lat: 26.9441, lng: 94.2029 }, // Sibsagar
  "786001": { lat: 27.4728, lng: 95.0197 }, // Dibrugarh
  "787001": { lat: 27.4670, lng: 95.3250 }, // Tinsukia
  "788001": { lat: 24.8333, lng: 92.7789 }, // Silchar
  "793001": { lat: 25.5788, lng: 91.8933 }, // Shillong
  "795001": { lat: 24.8170, lng: 93.9368 }, // Imphal

  // ── Major standalone cities ──────────────────────────────────────────
  "160101": { lat: 30.6942, lng: 76.8606 }, // Mohali
  "201010": { lat: 28.6400, lng: 77.4400 }, // Indirapuram
  "226010": { lat: 26.8200, lng: 80.9100 }, // Gomti Nagar
  "395010": { lat: 21.2350, lng: 72.9200 }, // Vesu Surat
  "641014": { lat: 11.0700, lng: 76.9200 }, // Coimbatore West
  "673001": { lat: 11.2588, lng: 75.7804 }, // Kozhikode
  "678001": { lat: 10.7867, lng: 76.6548 }, // Palakkad
  "686001": { lat: 9.5916, lng: 76.5222 },  // Kottayam
  "689001": { lat: 9.2648, lng: 76.7870 },  // Pathanamthitta
  "691001": { lat: 8.8932, lng: 76.6141 },  // Kollam
  "744101": { lat: 11.6234, lng: 92.7265 }, // Port Blair
  "759001": { lat: 20.4625, lng: 85.8828 }, // Angul
  "760001": { lat: 19.3150, lng: 84.8680 }, // Berhampur
  "769001": { lat: 21.8993, lng: 83.9962 }, // Rourkela
  "828116": { lat: 23.7957, lng: 86.4304 }, // Bokaro
  "831001": { lat: 22.8046, lng: 86.2029 }, // Jamshedpur
  "843001": { lat: 26.1197, lng: 85.3910 }, // Muzaffarpur
  "845001": { lat: 26.7924, lng: 84.9867 }, // Motihari
  "847001": { lat: 26.3556, lng: 85.9150 }, // Darbhanga
  "848101": { lat: 25.8800, lng: 85.7830 }, // Samastipur
  "852101": { lat: 25.5411, lng: 86.9815 }, // Supaul
  "854101": { lat: 25.6204, lng: 87.4647 }, // Katihar
  "855101": { lat: 25.2032, lng: 87.9148 }, // Kishanganj
  "856100": { lat: 24.4800, lng: 87.8700 }, // Malda
  "741101": { lat: 23.4300, lng: 88.3630 }, // Nadia
  "742101": { lat: 24.1000, lng: 88.2700 }, // Murshidabad
  "743101": { lat: 22.7300, lng: 88.3980 }, // North 24 Parganas
  "744201": { lat: 11.5900, lng: 92.5700 }, // South Andaman
  "800009": { lat: 25.5700, lng: 85.0900 }, // Patna West
  "800010": { lat: 25.5500, lng: 85.0700 }, // Patna Far West
  "800011": { lat: 25.5300, lng: 85.0500 }, // Phulwarisharif
  "800012": { lat: 25.5100, lng: 85.0300 }, // Danapur
  "800013": { lat: 25.4900, lng: 85.0100 }, // Khagaul
  "800014": { lat: 25.4700, lng: 84.9900 }, // Bihta
  "800015": { lat: 25.4500, lng: 84.9700 }, // Maner
  "801101": { lat: 25.4300, lng: 84.9500 }, // Arrah
  "802101": { lat: 25.2100, lng: 84.6700 }, // Sasaram
  "803101": { lat: 25.1900, lng: 85.5100 }, // Bihar Sharif
  "804453": { lat: 24.9700, lng: 85.0700 }, // Jehanabad
  "805101": { lat: 24.7500, lng: 84.4700 }, // Aurangabad Bihar
  "811101": { lat: 25.2800, lng: 85.7200 }, // Sheikhpura
  "812001": { lat: 24.7914, lng: 84.9994 }, // Gaya
  "813101": { lat: 24.5600, lng: 86.5400 }, // Jamui
  "814101": { lat: 24.2700, lng: 87.0700 }, // Deoghar
  "815301": { lat: 24.0700, lng: 86.3900 }, // Giridih
  "816101": { lat: 24.3500, lng: 87.5600 }, // Pakur
  "817101": { lat: 24.8700, lng: 87.1100 }, // Godda
  "818101": { lat: 24.3900, lng: 86.0700 }, // Hazaribag
  "819101": { lat: 23.7000, lng: 85.6500 }, // Lohardaga
  "820101": { lat: 23.9900, lng: 84.1100 }, // Palamu
  "821101": { lat: 25.0700, lng: 83.9600 }, // Rohtas
  "822101": { lat: 24.6100, lng: 84.4700 }, // Chatra
  "823001": { lat: 24.7500, lng: 85.0000 }, // Nawada
  "824101": { lat: 24.5500, lng: 84.0000 }, // Aurangabad South
  "825101": { lat: 24.3500, lng: 85.5200 }, // Koderma
  "826004": { lat: 23.7900, lng: 86.4300 }, // Dhanbad South
  "827001": { lat: 23.6700, lng: 85.9300 }, // Bokaro Steel City
  "828101": { lat: 23.7800, lng: 86.3500 }, // Dhanbad North
  "829101": { lat: 23.5500, lng: 85.5200 }, // Ramgarh
  "830001": { lat: 23.3800, lng: 85.3100 }, // Ranchi South
  "832101": { lat: 22.7400, lng: 85.9800 }, // Seraikela
  "833101": { lat: 22.6500, lng: 85.8000 }, // West Singhbhum
  "835101": { lat: 23.0700, lng: 84.4400 }, // Gumla
  "836101": { lat: 23.9700, lng: 85.3300 }, // Chatra North
  "841101": { lat: 25.7500, lng: 85.2100 }, // Siwan
  "842001": { lat: 25.9200, lng: 85.3900 }, // Sheohar
  "844101": { lat: 25.7900, lng: 85.7700 }, // Vaishali
  "845301": { lat: 26.6200, lng: 84.9100 }, // East Champaran
  "846001": { lat: 26.0600, lng: 85.8700 }, // Saharsa
  "848101": { lat: 25.8700, lng: 85.7500 }, // Samastipur North
  "849101": { lat: 25.6200, lng: 85.5100 }, // Begusarai
  "850101": { lat: 25.3700, lng: 86.4700 }, // Khagaria
  "851101": { lat: 25.2700, lng: 86.6800 }, // Madhepura
  "853101": { lat: 25.4100, lng: 87.4700 }, // Araria
};

/**
 * Look up coordinates for a pincode.
 * Returns { lat, lng } or null if not found.
 */
function getCoords(pincode) {
  const pin = String(pincode).trim()
  if (pincodeData[pin]) return pincodeData[pin]

  // Try district-level fallback (first 4 digits → nearest known pin)
  const prefix4 = pin.substring(0, 4)
  const match4 = Object.keys(pincodeData).find(k => k.startsWith(prefix4))
  if (match4) return pincodeData[match4]

  // Try zone-level fallback (first 3 digits)
  const prefix3 = pin.substring(0, 3)
  const match3 = Object.keys(pincodeData).find(k => k.startsWith(prefix3))
  if (match3) return pincodeData[match3]

  return null
}

/**
 * Haversine formula — straight-line distance in km between two lat/lng points.
 */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg) { return deg * (Math.PI / 180) }

module.exports = { getCoords, haversineDistance }