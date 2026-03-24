// Global variables
let selectedTests = [];
let currentBookingOption = null;

   const availableTests = {
  // Diagnostic Tests
  'ecg': { name: 'ECG', price: 400, category: 'diagnostic' },
  'echocardiography': { name: 'Echocardiography', price: 1500, category: 'diagnostic' },
  'eeg': { name: 'EEG', price: 2500, category: 'diagnostic' },
  'eeg_sleep_deprived_veeg': { name: 'EEG Sleep Deprived VEEG', price: 2200, category: 'diagnostic' },
  'emg': { name: 'EMG', price: 3500, category: 'diagnostic' },
  'emg_ncv': { name: 'EMG + NCV', price: 3500, category: 'diagnostic' },
  'emg_ncv_rns': { name: 'EMG + NCV + RNS', price: 3800, category: 'diagnostic' },
  'emg_ncv_lower_limbs': { name: 'EMG / NCV (Lower Limbs)', price: 3500, category: 'diagnostic' },
  'emg_bera': { name: 'EMG BERA', price: 3500, category: 'diagnostic' },
  'emg_ncv_both_limbs': { name: 'EMG NCV (Both Upper & Lower Limbs)', price: 4500, category: 'diagnostic' },
  'emg_ncv_upper_limb_1': { name: 'EMG NCV (Upper Limb) 1', price: 3500, category: 'diagnostic' },
  'emg_ncv_upper_limbs': { name: 'EMG NCV (Upper Limbs)', price: 3500, category: 'diagnostic' },
  'emg_vep': { name: 'EMG VEP (Visual Evoked Potential)', price: 3500, category: 'diagnostic' },
  'genetic_blood_karyotyping': { name: 'Genetic Blood Karyotyping', price: 4350, category: 'genetic' },
  'hbv_dna_quantification': { name: 'HBV-DNA Quantification (Viral load) - [Serum or plasma]', price: 6720, category: 'genetic' },
  'jak2_mutation_detection': { name: 'JAK2 (V617F) Mutation Detection', price: 6200, category: 'genetic' },
  'leukodystrphy_test': { name: 'Leukodystrphy Test', price: 20000, category: 'genetic' },
  'pap_procedure_consultation': { name: 'Pap with Procedure & Consultation', price: 470, category: 'diagnostic' },

  // Blood Chemistry Tests
  'acid_phosphatase_prostatic': { name: 'Acid Phosphatase, prostatic fraction - [Serum]', price: 600, category: 'blood_chemistry' },
  'acid_phosphatase_total': { name: 'Acid Phosphatase, total - [Serum]', price: 600, category: 'blood_chemistry' },
  'acid_phosphatase_total_prostatic': { name: 'Acid phosphatase, total and prostatic fraction - [Serum]', price: 600, category: 'blood_chemistry' },
  'albumin_csf': { name: 'Albumin - [CSF]', price: 380, category: 'blood_chemistry' },
  'albumin_serum': { name: 'Albumin - [Serum]', price: 170, category: 'blood_chemistry' },
  'albumin_urine_24h': { name: 'Albumin - [Urine, 24 hours]', price: 380, category: 'blood_chemistry' },
  'albumin_urine_spot': { name: 'Albumin - [Urine, spot]', price: 380, category: 'blood_chemistry' },
  'albumin_urine_qualitative': { name: 'Albumin, urine (Qualitative) - [Urine, spot]', price: 50, category: 'blood_chemistry' },
  'albumin_microalbumin_creatinine_ratio': { name: 'Albumin-Microalbumin/Creatinine ratio (Urine)', price: 650, category: 'blood_chemistry' },
  'alkaline_phosphatase_serum': { name: 'Alkaline Phosphatase - [Serum]', price: 170, category: 'blood_chemistry' },
  'alkaline_phosphatase_bone_fraction': { name: 'Alkaline phosphatase with bone fraction - [Serum]', price: 1700, category: 'blood_chemistry' },
  'ammonia_plasma': { name: 'Ammonia - [Plasma]', price: 1020, category: 'blood_chemistry' },
  'amylase_serum': { name: 'Amylase - [Serum]', price: 720, category: 'blood_chemistry' },
  'apolipoproteins_a1_b': { name: 'Apolipoproteins A1/B - [Serum]', price: 800, category: 'blood_chemistry' },
  'ascitic_fluid_routine': { name: 'Ascitic fluid, Routine examination (Basic) - [Ascitic fluid]', price: 700, category: 'blood_chemistry' },
  'aso_quantitative': { name: 'ASO (Quantitative) - [Serum]', price: 550, category: 'blood_chemistry' },
  'baxa_cotinine': { name: 'BAXA Cotinine - [Urine, spot]', price: 800, category: 'blood_chemistry' },
  'bence_jones_proteins': { name: 'Bence Jones Proteins (Qualitative) - [Urine, spot]', price: 550, category: 'blood_chemistry' },
  'bicarbonate_serum': { name: 'Bicarbonate - [Serum]', price: 310, category: 'blood_chemistry' },
  'bile_acid': { name: 'Bile Acid', price: 2035, category: 'blood_chemistry' },
  'bilirubin_total_direct_indirect': { name: 'Bilirubin (Total, Direct, Indirect), serum - [Serum]', price: 200, category: 'blood_chemistry' },
  'blood_sugar_f_pg': { name: 'Blood Sugar ( F & PG )', price: 160, category: 'blood_chemistry' },
  'blood_sugar_f_pp': { name: 'Blood Sugar ( F & PP)', price: 120, category: 'blood_chemistry' },
  'blood_sugar_pg': { name: 'Blood Sugar (PG)', price: 100, category: 'blood_chemistry' },
  'blood_sugar_fasting': { name: 'Blood Sugar Fasting', price: 60, category: 'blood_chemistry' },
  'blood_sugar_post_prandial': { name: 'Blood Sugar Post Prandial', price: 60, category: 'blood_chemistry' },
  'blood_sugar_random': { name: 'Blood Sugar Random', price: 60, category: 'blood_chemistry' },
  'body_fluid_routine': { name: 'Body fluid, Routine examination, (Basic) - [Body fluid]', price: 700, category: 'blood_chemistry' },
  'bun_blood_urea_nitrogen': { name: 'BUN (Blood Urea Nitrogen)', price: 170, category: 'blood_chemistry' },
  'c3_complement_3': { name: 'C3 - Complement 3, serum - [Serum]', price: 720, category: 'blood_chemistry' },
  'c4_complement_4': { name: 'C4 - Complement 4, serum - [Serum]', price: 720, category: 'blood_chemistry' },
  'calcium_serum': { name: 'Calcium - [Serum]', price: 170, category: 'blood_chemistry' },
  'calcium_urine_24h': { name: 'Calcium - [Urine, 24 hours]', price: 250, category: 'blood_chemistry' },
  'chlorides_24hrs_urine': { name: 'Chlorides - [24hrs urine]', price: 180, category: 'blood_chemistry' },
  'chlorides_serum': { name: 'Chlorides - [Serum]', price: 180, category: 'blood_chemistry' },
  'chlorides_spot_urine': { name: 'Chlorides - [Spot urine]', price: 180, category: 'blood_chemistry' },
  'cholesterol_total': { name: 'Cholesterol (Total) - [Serum]', price: 200, category: 'blood_chemistry' },
  'cholesterol_hdl_direct': { name: 'Cholesterol-HDL , direct - [Serum]', price: 200, category: 'blood_chemistry' },
  'cholesterol_ldl_direct': { name: 'Cholesterol-LDL, Direct - [Serum]', price: 350, category: 'blood_chemistry' },
  'ck_mb': { name: 'CK-MB (MB fraction of Creatinine Kinase) - [Serum]', price: 700, category: 'blood_chemistry' },
  'copper_serum': { name: 'Copper - [Serum]', price: 2010, category: 'blood_chemistry' },
  'cpk_total': { name: 'CPK - Creatinine Phospha Kinase (Total) - [Serum]', price: 460, category: 'blood_chemistry' },
  'creatinine_serum': { name: 'Creatinine - [Serum]', price: 170, category: 'blood_chemistry' },
  'creatinine_spot_urine': { name: 'Creatinine - [Spot urine]', price: 200, category: 'blood_chemistry' },
  'creatinine_24hrs_urine': { name: 'Creatinine - [ urine, 24 hrs]', price: 200, category: 'blood_chemistry' },
  'creatinine_clearance_test': { name: 'Creatinine Clearance Test - [Serum, urine]', price: 420, category: 'blood_chemistry' },
  'crp_c_reactive_protein': { name: 'CRP-C Reactive Protein - [Serum]', price: 500, category: 'blood_chemistry' },
  'csf_routine': { name: 'CSF, Routine examination, (Basic) - [CSF]', price: 700, category: 'blood_chemistry' },
  'd_dimer_quantification': { name: 'D-Dimer Quantification - [Plasma]', price: 1600, category: 'blood_chemistry' },
  'drug_of_abuse_6_drugs': { name: 'Drug Of Abuse 6 Drugs ( Qualitative)', price: 3200, category: 'blood_chemistry' },
  'electrolytes_serum': { name: 'Electrolytes - [Serum]', price: 500, category: 'blood_chemistry' },
  'electrolytes_urine_24h': { name: 'Electrolytes - [Urine, 24 hours]', price: 600, category: 'blood_chemistry' },
  'electrolytes_urine_spot': { name: 'Electrolytes - [Urine, spot]', price: 600, category: 'blood_chemistry' },
  'estimated_gfr': { name: 'Estimated GFR (eGFR)', price: 350, category: 'blood_chemistry' },
  'fecal_calprotectin': { name: 'Fecal Calprotectin', price: 2700, category: 'blood_chemistry' },
  'folic_acid_serum': { name: 'Folic acid, Serum - [Serum]', price: 1350, category: 'blood_chemistry' },
  'gamma_gt_ggtp': { name: 'Gamma GT (GGTP) - [Serum]', price: 345, category: 'blood_chemistry' },
  'glucose_csf': { name: 'Glucose (CSF)', price: 50, category: 'blood_chemistry' },
  'glucose_body_fluid': { name: 'Glucose - [Body fluid]', price: 50, category: 'blood_chemistry' },
  'glucose_plasma_urine': { name: 'Glucose - [Plasma, Urine]', price: 50, category: 'blood_chemistry' },
  'glycosylated_haemoglobin_hba1c': { name: 'Glycosylated Haemoglobin (HbA1c) - [Blood]', price: 520, category: 'blood_chemistry' },
  'gtc_5_samples': { name: 'GTC-Glucose Tolerance Curve (5 samples) - [Plasma, Urine]', price: 300, category: 'blood_chemistry' },
  'gtc_extended_8_samples': { name: 'GTC-Glucose Tolerance Curve, Extended (8 samples) - [Plasma, Urine]', price: 400, category: 'blood_chemistry' },
   // Basic Blood Chemistry Tests
'hbsag_screening': { name: 'HBsAg, Screening - [Serum]', price: 1020, category: 'blood_chemistry' },
'hdl_cholesterol_direct': { name: 'HDL Cholesterol , direct - [Serum]', price: 200, category: 'blood_chemistry' },
'high_sensitivity_crp': { name: 'High Sensitivity CRP - [Serum]', price: 710, category: 'blood_chemistry' },
'iga_csf': { name: 'IgA - [CSF]', price: 2020, category: 'immunology' },
'iga_serum': { name: 'IgA - [Serum]', price: 2020, category: 'immunology' },
'igg_csf': { name: 'IgG - [CSF]', price: 920, category: 'immunology' },
'igg_serum': { name: 'IgG - [Serum]', price: 720, category: 'immunology' },
'igm_csf': { name: 'IgM - [CSF]', price: 720, category: 'immunology' },
'igm_serum': { name: 'IgM - [serum]', price: 720, category: 'immunology' },
'ionised_calcium': { name: 'Ionised calcium - [Serum]', price: 450, category: 'blood_chemistry' },
'iron_studies': { name: 'Iron Studies', price: 630, category: 'blood_chemistry' },
'lap_leucocyte_alkaline_phosphatase': { name: 'LAP (Leucocyte Alkaline Phosphatase ) score - [Blood]', price: 1500, category: 'hematology' },
'ldh_lactate_dehydrogenase': { name: 'LDH-Lactate Dehydrogenase - [Serum]', price: 325, category: 'blood_chemistry' },
'ldl_cholesterol_direct': { name: 'LDL Cholesterol -Direct - [Serum]', price: 400, category: 'blood_chemistry' },
'lic_deformity_questionary': { name: 'Lic Deformity Questionary', price: 110, category: 'clinical' },
'lipase_level': { name: 'Lipase level - [Serum]', price: 780, category: 'blood_chemistry' },
'lipid_profile_mini': { name: 'Lipid Profile ( Mini )', price: 600, category: 'blood_chemistry' },
'lipids_total': { name: 'Lipids, total - [Serum]', price: 600, category: 'blood_chemistry' },
'lipoprotein_a': { name: 'Lipoprotein(a) - [Serum]', price: 1250, category: 'blood_chemistry' },
'lithium_level': { name: 'Lithium level - [Serum]', price: 645, category: 'therapeutic_drug_monitoring' },
'magnesium_serum': { name: 'Magnesium - [Serum]', price: 580, category: 'blood_chemistry' },
'microalbumin_urine_spot': { name: 'Microalbumin - [Urine, spot]', price: 650, category: 'urine_chemistry' },
'microalbumin_urine_24h': { name: 'Microalbumin-[Urine, 24 hours]', price: 650, category: 'urine_chemistry' },
'pericardial_fluid_routine': { name: 'Pericardial fluid, Routine examination (Basic) - [Pericardial fluid]', price: 860, category: 'body_fluids' },
'peritoneal_fluid_routine': { name: 'Peritoneal fluid, Routine examination (Basic) - [Peritoneal fluid]', price: 860, category: 'body_fluids' },
'phosphorus_urine_24hrs': { name: 'Phosphorus - [urine, 24 hrs]', price: 230, category: 'urine_chemistry' },
'phosphorus_inorganic_serum': { name: 'Phosphorus, inorganic - [Serum]', price: 170, category: 'blood_chemistry' },
'phosphorus_inorganic_urine_spot': { name: 'Phosphorus, inorganic - [Urine, spot]', price: 230, category: 'urine_chemistry' },
'pleural_fluid_routine': { name: 'Pleural fluid, Routine examination (Basic) - [Pleural fluid]', price: 910, category: 'body_fluids' },
'potassium_serum': { name: 'Potassium - [Serum]', price: 180, category: 'blood_chemistry' },
'potassium_urine_24h': { name: 'Potassium - [Urine, 24 hours]', price: 270, category: 'urine_chemistry' },
'potassium_urine_spot': { name: 'Potassium - [Urine, spot]', price: 270, category: 'urine_chemistry' },
'protein_electrophoresis': { name: 'Protein Electrophoresis - [Serum]', price: 1000, category: 'blood_chemistry' },
'proteins_ascitic_fluid': { name: 'Proteins - [Ascitic fluid]', price: 380, category: 'body_fluids' },
'proteins_csf': { name: 'Proteins - [CSF]', price: 380, category: 'body_fluids' },
'proteins_serum': { name: 'Proteins - [Serum]', price: 340, category: 'blood_chemistry' },
'proteins_urine_24h': { name: 'Proteins - [Urine, 24 hours]', price: 380, category: 'urine_chemistry' },
'ra_rheumatoid_factor': { name: 'RA-Rhuematoid Arthritis, Rheumatoid factor (RF), IgG (Quantitative) - [Serum]', price: 660, category: 'immunology' },
'sgot_ast': { name: 'SGOT (AST) - [Serum]', price: 170, category: 'blood_chemistry' },
'sgpt_alt': { name: 'SGPT (ALT) - [Serum]', price: 170, category: 'blood_chemistry' },
'sodium_serum': { name: 'Sodium - [Serum]', price: 180, category: 'blood_chemistry' },
'sodium_urine_24h': { name: 'Sodium - [Urine, 24h]', price: 270, category: 'urine_chemistry' },
'sodium_urine_spot': { name: 'Sodium - [Urine, spot]', price: 270, category: 'urine_chemistry' },
'sugar_urine': { name: 'Sugar, urine - [Urine, spot]', price: 50, category: 'urine_chemistry' },
'tibc_direct': { name: 'TIBC (Direct) - [Serum]', price: 550, category: 'blood_chemistry' },
'triglycerides': { name: 'Triglycerides - [Serum]', price: 200, category: 'blood_chemistry' },
'troponin_i_quantitative': { name: 'Troponin - I (Quantitative)', price: 1900, category: 'cardiac_markers' },
'urea_serum': { name: 'Urea - [Serum]', price: 170, category: 'blood_chemistry' },
'urea_urine_24hrs': { name: 'Urea - [Urine, 24hrs]', price: 270, category: 'urine_chemistry' },
'urea_clearance_test': { name: 'Urea Clearance test - [Serum and Urine]', price: 380, category: 'kidney_function' },
'uric_acid_serum': { name: 'Uric Acid - [Serum]', price: 170, category: 'blood_chemistry' },
'uric_acid_urine_24hrs': { name: 'Uric Acid - [Urine,24Hrs]', price: 300, category: 'urine_chemistry' },
'urine_spot_protein_creatinine': { name: 'Urine Spot Protein Creatinine', price: 500, category: 'urine_chemistry' },
'venous_blood_gas': { name: 'Venous Blood Gas (VBG)', price: 1200, category: 'blood_gas' },
'vma_vanillylmandelic_acid': { name: 'VMA-Vanillylmandelic Acid - [Urine, 24 hrs]', price: 3800, category: 'urine_chemistry' },
'xray_left_foot_lat': { name: 'Xray Left Foot Lat', price: 400, category: 'radiology' },

// Specialized Tests
'ace_angiotensin_converting_enzyme': { name: 'ACE-Angiotensin Converting Enzyme - [Serum]', price: 1400, category: 'specialized' },
'acetyl_choline_receptor_antibodies': { name: 'Acetyl Choline Receptor Antibodies (ACHR Abs) - [Serum]', price: 3640, category: 'immunology' },
'acth_adreno_corticotropic_hormone': { name: 'ACTH-Adreno corticotropic hormone - [Plasma]', price: 1770, category: 'endocrinology' },
'afp_alpha_feto_protein_amniotic': { name: 'AFP-Alpha Feto Protein - [Amniotic fluid]', price: 1100, category: 'tumor_markers' },
'afp_alpha_feto_protein_serum': { name: 'AFP-Alpha Feto Protein - [Serum]', price: 1000, category: 'tumor_markers' },
'ana_anti_nuclear_antibody': { name: 'ANA-Anti Nuclear Antibody by IFA (With titre) - [Serum]', price: 1100, category: 'immunology' },
'anti_hav_igg_total': { name: 'Anti HAV-IgG/total Antibody to Hepatitis A Virus - [Serum]', price: 1235, category: 'infectious_disease' },
'anti_hav_igm': { name: 'Anti HAV-IgM Antibody to Hepatitis A Virus - [Serum]', price: 1235, category: 'infectious_disease' },
'anti_hbcag_igm': { name: 'Anti HBcAg-IgM antibodies to Hepatitis B Core Ag - [Serum]', price: 1235, category: 'infectious_disease' },
'anti_hbcag_total': { name: 'Anti HBcAg-Total antibodies to Hepatitis B Core Ag - [Serum]', price: 1235, category: 'infectious_disease' },
'anti_hbeag': { name: 'Anti HBeAg-Antibodies to Hepatitis B envelope Antigen - [Serum]', price: 1125, category: 'infectious_disease' },
'anti_hbsag_total_quantitative': { name: 'Anti HBsAg-Total antibodies to Hepatitis B Surface Antigen (Quantitative)', price: 1285, category: 'infectious_disease' },
'anti_hcv_total_abs': { name: 'Anti HCV-Total Abs to Hepatitis C Virus - [Serum]', price: 1200, category: 'infectious_disease' },
'anti_hev_igg': { name: 'Anti HEV-IgG Antibodies to Hepatitis E Virus - [Serum]', price: 1650, category: 'infectious_disease' },
'anti_hev_igm': { name: 'Anti HEV-IgM Antibodies to Hepatitis E Virus - [Serum]', price: 1650, category: 'infectious_disease' },
'beta_hcg': { name: 'Beta HCG - [Serum]', price: 800, category: 'endocrinology' },
'beta_2_microglobulin': { name: 'Beta-2-microglobulin - [Urine, spot]', price: 1500, category: 'specialized' },
'beta2_glycoprotein_igm': { name: 'Beta2 Glycoprotein IgM', price: 1300, category: 'immunology' },
'beta2_glycoprotein_igg': { name: 'Beta2 Glycoprotein-IgG', price: 1300, category: 'immunology' },
'c_peptide_fasting': { name: 'C-Peptide (Fasting sample) - [Serum]', price: 1350, category: 'endocrinology' },
'c_peptide_pp': { name: 'C-Peptide (PP sample) - [Serum]', price: 1350, category: 'endocrinology' },
'ca_125': { name: 'CA-125 (Cancer Antigen-125), - [Serum]', price: 1450, category: 'tumor_markers' },
'ca_15_3': { name: 'CA-15.3 (Cancer Antigen 15.3), - [Serum]', price: 1395, category: 'tumor_markers' },
'ca_19_9': { name: 'CA-19.9 (Cancer Antigen 19.9) - [Serum]', price: 1415, category: 'tumor_markers' },
'cardiolipin_antibody_igg': { name: 'Cardiolipin Antibody-IgG - [Serum]', price: 965, category: 'immunology' },
'cardiolipin_antibody_igm': { name: 'Cardiolipin Antibody-IgM - [Serum]', price: 860, category: 'immunology' },
'cea_carcino_embryonic_antigen': { name: 'CEA-Carcino Embryonic Antigen - [Serum]', price: 935, category: 'tumor_markers' },
'cortisol': { name: 'Cortisol - [Serum]', price: 800, category: 'endocrinology' },
'cotinine_nicotine': { name: 'Cotinine/Nicotine - [Serum]', price: 1930, category: 'toxicology' },
'covid_antibody': { name: 'Covid Antibody', price: 500, category: 'infectious_disease' },
'cyclosporin_a_peak': { name: 'Cyclosporin A, Peak level (C2) - [Blood]', price: 3265, category: 'therapeutic_drug_monitoring' },
                               'dhea': { name: 'DHEA-DihydroepiAndrostenedione - [Serum]', price: 3210, category: 'endocrinology' },
'dheas': { name: 'DHEAS-DihydroepiAndrostenedione Sulphate - [Serum]', price: 1350, category: 'endocrinology' },
'digoxin': { name: 'Digoxin (Lanoxin) - [Serum]', price: 1500, category: 'therapeutic_drug_monitoring' },
'e3_unconjugated_estriol': { name: 'E3-Unconjugated Estriol - [Serum]', price: 1180, category: 'endocrinology' },
'estradiol_e2': { name: 'Estradiol (E2) - [Serum]', price: 670, category: 'endocrinology' },
'fdp_fibrinogen_degradation': { name: 'FDP-Fibrinogen Degradation Products - [Plasma]', price: 1800, category: 'coagulation' },
'ferritin': { name: 'Ferritin - [Serum]', price: 980, category: 'blood_chemistry' },
'filaria_antibody': { name: 'Filaria Antibody', price: 1200, category: 'infectious_disease' },
'free_psa': { name: 'Free PSA (Prostate Specific Antigen-Free molecule) - [Serum]', price: 1020, category: 'tumor_markers' },
'free_t3': { name: 'Free T3 (Free Tri-iodothyronine) - [Serum]', price: 315, category: 'endocrinology' },
'free_t3_t4': { name: 'Free T3 + Free T4', price: 645, category: 'endocrinology' },
'free_t4': { name: 'Free T4 (Free Thyroxine) - [Serum]', price: 330, category: 'endocrinology' },
'fsh': { name: 'FSH - Follicle Stimulating Hormone - [Serum]', price: 550, category: 'endocrinology' },
'galactomannan': { name: 'Galactomannan', price: 5700, category: 'infectious_disease' },
'hbcab_total': { name: 'HBcAb-Total antibodies to Hepatitis B Core antigen - [Serum]', price: 1235, category: 'infectious_disease' },
'hbeab': { name: 'HBeAb-Antibodies to Hepatitis B envelope Antigen - [Serum]', price: 1125, category: 'infectious_disease' },
'hbeag': { name: 'HBeAg - Hepatits B Envelope Antigen - [Serum]', price: 1125, category: 'infectious_disease' },
'hbsab_total': { name: 'HBsAb-Total antibodies to Hepatitis B Surface Ag - [Serum]', price: 1285, category: 'infectious_disease' },
'hbsag_confirmation_quantification': { name: 'HbsAg Confirmation and Quantification', price: 1395, category: 'infectious_disease' },
'hbsag_cmia_method': { name: 'HBSAG(AUSTRALIA ANTIGEN) BY CMIA METHOD', price: 1285, category: 'infectious_disease' },
'hbsag_spot_test': { name: 'HbsAg, Spot test - [Serum]', price: 300, category: 'infectious_disease' },
'hiv_duo_antigen_antibody': { name: 'HIV-DUO antigen & antibody screen(IV th Gen) - [Serum]', price: 800, category: 'infectious_disease' },
'homocysteine_serum': { name: 'Homocysteine - [Serum]', price: 1400, category: 'blood_chemistry' },
'homocysteine_urine': { name: 'Homocysteine - [Urine, spot]', price: 1300, category: 'urine_chemistry' },
'ige': { name: 'IgE - [Serum]', price: 1150, category: 'immunology' },
'insulin_random': { name: 'Insulin Random', price: 1000, category: 'endocrinology' },
'insulin_fasting': { name: 'Insulin, fasting - [Serum]', price: 1000, category: 'endocrinology' },
'insulin_post_prandial': { name: 'Insulin, post prandial - [Serum]', price: 1000, category: 'endocrinology' },
'intact_pth': { name: 'Intact PTH - [Serum]', price: 1900, category: 'endocrinology' },
'lh_luteinizing_hormone': { name: 'LH-Luteinizing Hormone - [Serum]', price: 550, category: 'endocrinology' },
'liver_blot': { name: 'Liver Blot', price: 3800, category: 'immunology' },
'microsomal_tpo_antibody': { name: 'Microsomal (TPO) Antibody Titre - [Serum]', price: 1280, category: 'endocrinology' },
'oligoclonal_band': { name: 'Oligoclonal band - [CSF, serum]', price: 5350, category: 'neurological' },
'progesterone_p4': { name: 'Progesterone (P4) - [serum]', price: 650, category: 'endocrinology' },
'prolactin': { name: 'Prolactin - [serum]', price: 580, category: 'endocrinology' },
'psa_total': { name: 'PSA-Prostate specific antigen, total - [Serum]', price: 950, category: 'tumor_markers' },
'pth_intact_molecule': { name: 'PTH-Para Thyroid Hormone (Intact Molecule) - [Serum]', price: 1900, category: 'endocrinology' },
'quadruple_test': { name: 'Quadruple Test', price: 3745, category: 'prenatal' },
'rbc_folate': { name: 'RBC Folate - [Blood, serum]', price: 2410, category: 'blood_chemistry' },
'renin_activity_plasma': { name: 'Renin Activity, plasma (PRA) - [Plasma]', price: 5460, category: 'endocrinology' },
'rubella_igm': { name: 'Rubella (German Measles) -IgM Antibodies - [Serum]', price: 805, category: 'infectious_disease' },
'rubella_igg': { name: 'Rubella (German Measles)-IgG Antibodies - [Serum]', price: 805, category: 'infectious_disease' },
'spike_protein_antibody': { name: 'Spike Protein Antibody Test', price: 4199, category: 'infectious_disease' },
't3_t4_tsh': { name: 'T3 + T4 + TSH', price: 550, category: 'endocrinology' },
't3_total': { name: 'T3,Total (Tri iodothyronine) - [Serum]', price: 270, category: 'endocrinology' },
't4_total': { name: 'T4,Total (Thyroxine) - [Serum]', price: 250, category: 'endocrinology' },
'testosterone_total': { name: 'Testosterone (Total) - [Serum]', price: 800, category: 'endocrinology' },
'thyroglobulin': { name: 'Thyroglobulin - [Serum]', price: 1605, category: 'endocrinology' },
'total_p1np': { name: 'Total P1NP', price: 2140, category: 'bone_markers' },
'toxoplasma_igg': { name: 'Toxoplasma-IgG (Quantitative) - [Serum]', price: 750, category: 'infectious_disease' },
'toxoplasma_igm': { name: 'Toxoplasma-IgM antibodies - [Serum]', price: 750, category: 'infectious_disease' },
'tpo_microsomal_antibody': { name: 'TPO (Microsomal) Antibody Titre - [Serum]', price: 1280, category: 'endocrinology' },
'tsh_ultrasensitive': { name: 'TSH-Ultrasensitive(Thyroid Stimulating Hormone) - [Serum]', price: 380, category: 'endocrinology' },
'vitamin_b12': { name: 'Vitamin B12 (Cyanocobalamin) - [Serum]', price: 1100, category: 'vitamins' },
'vitamin_d3': { name: 'Vitamin D3 (25 Hydroxy Cholecalciferol) - [Serum]', price: 1300, category: 'vitamins' },

// Urine and Body Fluid Tests
'bile_salt_pigments': { name: 'Bile salt & pigments, (Qualitative) - [Urine, spot]', price: 50, category: 'urine_chemistry' },
'cannabis_thc_quantitative': { name: 'Cannabis (THC) (Marijuana) (Quantitative) - [Urine, spot]', price: 800, category: 'toxicology' },
'cannabis_thc_qualitative': { name: 'Cannabis (THC) (Marijuana) (Qualitative) - [Urine, spot]', price: 800, category: 'toxicology' },
'cocaine_qualitative': { name: 'Cocaine (Qualitative) - [Urine, spot]', price: 770, category: 'toxicology' },
'faeces_routine_examination': { name: 'Faeces, Routine Examination (Basic) - [Stool]', price: 110, category: 'stool_analysis' },
'fructose_semen': { name: 'Fructose - [Semen]', price: 325, category: 'fertility' },
'hanging_drop_v_cholerae': { name: 'Hanging drop for V. cholerae - [Stool]', price: 430, category: 'stool_analysis' },
'occult_blood_stool': { name: 'Occult blood - [Stool]', price: 100, category: 'stool_analysis' },
'occult_blood_urine': { name: 'Occult blood - [Urine ]', price: 100, category: 'urine_chemistry' },
'opiates_morphine': { name: 'Opiates (Morphine) (Qualitative) - [Urine]', price: 750, category: 'toxicology' },
'pcp_phencyclidine': { name: 'PCP-Phencyclidine Phosphate, urine (Qualitative) - [Urine]', price: 750, category: 'toxicology' },
'ph_pleural_fluid': { name: 'pH (Pleural Fluid)', price: 50, category: 'body_fluids' },
'ph_gastric_lavage': { name: 'pH - [Gastric Lavage]', price: 50, category: 'body_fluids' },
'ph_stool': { name: 'pH - [Stool]', price: 50, category: 'stool_analysis' },
'ph_urine': { name: 'pH - [Urine]', price: 50, category: 'urine_chemistry' },
'pregnancy_test': { name: 'Pregnancy test - [Urine]', price: 200, category: 'prenatal' },
'reducing_substances_stool': { name: 'Reducing substances - [Stool]', price: 325, category: 'stool_analysis' },
'reducing_substances_urine': { name: 'Reducing substances - [Urine]', price: 325, category: 'urine_chemistry' },
'routine_examination_urine': { name: 'Routine Examination, urine - [Urine]', price: 110, category: 'urine_chemistry' },
'semen_test1': { name: 'SEMEN TEST1', price: 750, category: 'fertility' },
'semen_fructose_level': { name: 'Semen, fructose level - [Semen]', price: 325, category: 'fertility' },
'semen_routine_examination': { name: 'Semen, Routine examination - [Semen]', price: 1000, category: 'fertility' },
'stool_hanging_drop': { name: 'Stool, Hanging drop preparation - [Stool]', price: 430, category: 'stool_analysis' },
'stool_occult_blood': { name: 'Stool, occult blood - [Stool]', price: 100, category: 'stool_analysis' },
'stool_reducing_substances_ph': { name: 'Stool, reducing substances and pH - [Stool]', price: 325, category: 'stool_analysis' },
'stool_routine_examination': { name: 'Stool, Routine Examination, (Basic) - [Stool]', price: 120, category: 'stool_analysis' },
'urine_routine_examination_spot': { name: 'Urine, Routine Examination - [Urine, spot]', price: 110, category: 'urine_chemistry' },

// Hematology Tests
'abo_rh_typing': { name: 'ABO & Rh typing (Blood grouping) - [Blood]', price: 150, category: 'hematology' },
'absolute_basophils_count': { name: 'Absolute Basophils Count - [Blood]', price: 225, category: 'hematology' },
'absolute_eosinophils_count': { name: 'Absolute Eosinophils Count - [Blood]', price: 225, category: 'hematology' },
'absolute_reticulocyte_count': { name: 'Absolute Reticulocyte Count - [Blood]', price: 320, category: 'hematology' },
'aptt_activated_partial_thromboplastin': { name: 'aPTT- Activated Partial Thromboplastin - [Plasma]', price: 700, category: 'coagulation' },
'basophils_count_absolute': { name: 'Basophils Count, absolute - [Blood]', price: 100, category: 'hematology' },
'bleeding_clotting_time': { name: 'Bleeding & Clotting time - [NA]', price: 100, category: 'coagulation' },
'blood_group_abo_rh': { name: 'Blood Group (ABO & Rh typing) - [Blood]', price: 150, category: 'hematology' },
'blood_picture': { name: 'Blood picture - [Serum]', price: 315, category: 'hematology' },
'cbc_esr': { name: 'CBC + ESR', price: 330, category: 'hematology' },
'cbc_esr_mp': { name: 'CBC + ESR + MP', price: 430, category: 'hematology' },
'cbc_mp': { name: 'CBC + MP', price: 330, category: 'hematology' },
'cbc_complete_blood_count': { name: 'CBC-Complete Blood Count (Haemogram) - [Blood]', price: 230, category: 'hematology' },
                                'cell_count_csf': { name: 'Cell count - [CSF]', price: 300, category: 'hematology' },
'clotting_time_ct': { name: 'Clotting time (CT)', price: 50, category: 'hematology' },
'coombs_test_direct': { name: 'Coomb~s test (Direct) or Direct antiglobulin test (DAT) - [Blood]', price: 700, category: 'hematology' },
'coombs_test_indirect': { name: 'Coomb~s test (Indirect) or Indirect antiglobulin test (IAT) - [Serum]', price: 775, category: 'hematology' },
'eosinophil_detection_urine': { name: 'Eosinophil detection - [Urine, spot]', price: 100, category: 'hematology' },
'eosinophils_count_absolute': { name: 'Eosinophils Count, Absolute - [Blood]', price: 100, category: 'hematology' },
'esr_automated': { name: 'ESR (Automated) - [Blood]', price: 100, category: 'hematology' },
'fibrinogen_plasma': { name: 'Fibrinogen - [Plasma]', price: 1100, category: 'hematology' },
'g6pd_qualitative': { name: 'G6PD-Qualitative - [Blood]', price: 650, category: 'hematology' },
'g6pd_quantitative': { name: 'G6PD-Quantitative - [Blood]', price: 800, category: 'hematology' },
'haematocrit_pcv': { name: 'Haematocrit (PCV-Packed Cell Volume) - [Blood]', price: 100, category: 'hematology' },
'haemoglobin': { name: 'Haemoglobin - [Blood]', price: 100, category: 'hematology' },
'haemogram_cbc': { name: 'Haemogram (CBC) - [Blood]', price: 230, category: 'hematology' },
'le_cell_detection': { name: 'LE Cell Detection - [Blood]', price: 450, category: 'hematology' },
'leucocyte_wbc_blood': { name: 'Leucocyte (WBC) : Total and Differential Counts - [Blood]', price: 100, category: 'hematology' },
'leucocyte_wbc_body_fluid': { name: 'Leucocyte (WBC) : Total and Differential Counts - [Body Fluid]', price: 100, category: 'hematology' },
'lupus_lac': { name: 'Lupus - LAC (Lupus Anticoagulants) (screening and confirmation) - [Plasma]', price: 2300, category: 'hematology' },
'lymphocyte_count_absolute': { name: 'Lymphocyte Count, absolute - [Blood]', price: 100, category: 'hematology' },
'malarial_antibody_igg': { name: 'Malarial Antibody, IgG - [Blood]', price: 550, category: 'hematology' },
'malarial_antigen': { name: 'Malarial Antigen (Vivax & Falciparum) - [Blood]', price: 600, category: 'hematology' },
'malarial_parasite': { name: 'Malarial Parasite - [Blood]', price: 100, category: 'hematology' },
'mch_mean_corpuscular_haemoglobin': { name: 'MCH-Mean Corpuscular Haemoglobin - [Blood]', price: 100, category: 'hematology' },
'mchc_mean_corpuscular_haemoglobin_concentration': { name: 'MCHC-Mean Corpuscular Haemoglobin Concentration - [Blood]', price: 100, category: 'hematology' },
'mcv_mean_corpuscular_volume': { name: 'MCV-Mean Corpuscular Volume - [Blood]', price: 100, category: 'hematology' },
'microfilaria_detection': { name: 'Microfilaria detection - [Blood]', price: 220, category: 'hematology' },
'monocyte_count_absolute': { name: 'Monocyte Count, Absolute - [Blood]', price: 100, category: 'hematology' },
'mpv_mean_platelet_volume': { name: 'MPV-Mean Platelet Volume - [Blood]', price: 100, category: 'hematology' },
'pcv_packed_cell_volume': { name: 'PCV-Packed Cell Volume (Haematocrit) - [Blood]', price: 100, category: 'hematology' },
'pdw_platelet_distribution_width': { name: 'PDW-Platelet Distribution Width - [Blood]', price: 100, category: 'hematology' },
'peripheral_smear_examination': { name: 'Peripheral smear examination by pathologist - [Blood]', price: 160, category: 'hematology' },
'platelet_thrombocyte_count': { name: 'Platelet (Thrombocyte) count - [Blood]', price: 100, category: 'hematology' },
'prothrombin_time_pt': { name: 'Prothrombin Time (PT) - [Plasma]', price: 370, category: 'hematology' },
'pttk_partial_thromboplastin_time': { name: 'PTTk-Partial Thromboplastin Time - [Plasma]', price: 710, category: 'hematology' },
'rbc_red_blood_cell_count': { name: 'RBC-Red Blood Cell (Erythrocyte) count - [Blood]', price: 100, category: 'hematology' },
'rdw_red_cell_distribution_width': { name: 'RDW - Red Cell Distribution width - [Blood]', price: 100, category: 'hematology' },
'reticulocyte_count_automated': { name: 'Reticulocyte count, automated - [Blood]', price: 210, category: 'hematology' },
'rh_anti_d_antibody_titre': { name: 'Rh (Anti D) Antibody titre - [Serum]', price: 600, category: 'hematology' },
'sickling_test': { name: 'Sickling test - [Blood]', price: 220, category: 'hematology' },
'tt_thrombin_time_plasma': { name: 'TT -Thrombin time , plasma - [Plasma]', price: 1000, category: 'hematology' },
'wbc_leucocyte_total_differential_counts': { name: 'WBC (Leucocyte) : Total and Differential Counts, blood - [Blood]', price: 100, category: 'hematology' },
'cytology_aspirates': { name: 'Cytology - [Aspirates]', price: 2500, category: 'pathology' },
'cytology_sputum': { name: 'Cytology - [Sputum]', price: 2500, category: 'pathology' },
'cytology_urine': { name: 'Cytology - [Urine]', price: 2500, category: 'pathology' },
'fnac_cytological_examination': { name: 'FNAC - cytological examination - [FNAC fluid]', price: 1000, category: 'pathology' },
'fnac_procedure_charges': { name: 'FNAC procedure charges - [Walk in patient]', price: 1500, category: 'pathology' },
'histopathology_cervical_biopsy_6000': { name: 'Histopathology - Cervical Biopsy', price: 6000, category: 'pathology' },
'histopathology_cervical_biopsy_2500': { name: 'Histopathology - Cervical Biopsy', price: 2500, category: 'pathology' },
'histopathology_endometrial_biopsy': { name: 'Histopathology - Endometrial Biopsy', price: 2500, category: 'pathology' },
'histopathology_large_specimen': { name: 'Histopathology- Large specimen - [Tissue]', price: 4000, category: 'pathology' },
'histopathology_large_complex_specimen': { name: 'Histopathology- Large and Complex specimen - [Tissue]', price: 4500, category: 'pathology' },
'histopathology_medium_specimen': { name: 'Histopathology- Medium specimen - [Tissue]', price: 3500, category: 'pathology' },
'histopathology_small_specimen': { name: 'Histopathology- Small specimen - [Tissue]', price: 2500, category: 'pathology' },
'pap_smears_cytological_examination': { name: 'PAP Smears for cytological examination - [Pap smear]', price: 420, category: 'pathology' },
'pr_progesterone_receptor_immunohistochemistry': { name: 'PR-Progesterone receptor by Immunohistochemistry - [Tissue]', price: 6600, category: 'pathology' },
'afb_culture_conventional_lj_medium': { name: 'AFB, Culture by conventional LJ medium - [Serum]', price: 720, category: 'microbiology' },
'afb_smear_examination_fluorescent_microscopy': { name: 'AFB, smear examination by Fluorescent Microscopy - [Any specimen]', price: 400, category: 'microbiology' },
'afb_smear_examination_zn_stain': { name: 'AFB, smear examination by ZN stain - [Any specimen]', price: 320, category: 'microbiology' },
'afb_smear_examination_zn_stain_3_samples': { name: 'AFB, smear examination by ZN stain (3 samples) - [Sputum or urine]', price: 900, category: 'microbiology' },
'afb_susceptibility_1st_line_sirep': { name: 'AFB, Susceptibility-1st line [SIREP] - [Pure culture]', price: 7400, category: 'microbiology' },
'afb_susceptibility_2nd_line_5_drugs': { name: 'AFB, Susceptibility-2nd line (5 Drugs) - [Pure culture]', price: 6000, category: 'microbiology' },
'afb_susceptibility_10_drugs_panel': { name: 'AFB, susceptibility:10 drugs panel - [Pure culture]', price: 7900, category: 'microbiology' },
'afb_susceptibility_amikacin': { name: 'AFB,susceptibility-Amikacin - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_augmentin': { name: 'AFB,susceptibility-Augmentin - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_capreomycin': { name: 'AFB,susceptibility-Capreomycin - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_ciprofloxacin': { name: 'AFB,susceptibility-Ciprofloxacin - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_clarithromycin': { name: 'AFB,susceptibility-Clarithromycin - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_clofazimine': { name: 'AFB,susceptibility-Clofazimine - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_cycloserine': { name: 'AFB,susceptibility-Cycloserine - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_erythromycin_1': { name: 'AFB,susceptibility-Erythromycin - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_erythromycin_2': { name: 'AFB,susceptibility-Erythromycin - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_ethambutol': { name: 'AFB,susceptibility-Ethambutol - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_ethionamide': { name: 'AFB,susceptibility-Ethionamide - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_isoniazid': { name: 'AFB,susceptibility-Isoniazid - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_kanamycin': { name: 'AFB,susceptibility-Kanamycin - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_levofloxacin_1': { name: 'AFB,susceptibility-Levofloxacin - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_levofloxacin_2': { name: 'AFB,susceptibility-Levofloxacin - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_ofloxacin': { name: 'AFB,susceptibility-Ofloxacin - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_pas': { name: 'AFB,susceptibility-PAS - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_prothionamide': { name: 'AFB,susceptibility-Prothionamide - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_pyrazinamide': { name: 'AFB,susceptibility-Pyrazinamide - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_rifampicin': { name: 'AFB,susceptibility-Rifampicin - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_roxithromycin': { name: 'AFB,susceptibility-Roxithromycin - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_sparfloxacin': { name: 'AFB,susceptibility-Sparfloxacin - [Pure culture]', price: 1550, category: 'microbiology' },
'afb_susceptibility_streptomycin': { name: 'AFB,susceptibility-Streptomycin - [Pure culture]', price: 1550, category: 'microbiology' },
'alberts_stain_c_diphtheriae': { name: 'Albert~s Stain for C.diphtheriae - [Throat or Nasopharyngeal swab]', price: 400, category: 'microbiology' },
'anaerobic_culture': { name: 'Anaerobic culture', price: 1600, category: 'microbiology' },
'c_s_aerobic_catheter_tip': { name: 'C & S AEROBIC (Catheter Tip)', price: 1000, category: 'microbiology' },
'c_s_aerobic_bacteria_automated_urine': { name: 'C & S for aerobic bacteria (Automated) - [Urine]', price: 1100, category: 'microbiology' },
'c_s_aerobic_bacteria_manual_body_fluid': { name: 'C & S for aerobic bacteria (Manual) - [Body Fluid]', price: 1000, category: 'microbiology' },
'c_s_aerobic_bacteria_manual_cervical_vaginal_swab': { name: 'C & S for aerobic bacteria (Manual) - [Cervical/ Vaginal Swab]', price: 1000, category: 'microbiology' },
'c_s_aerobic_bacteria_manual_csf': { name: 'C & S for aerobic bacteria (Manual) - [CSF]', price: 1000, category: 'microbiology' },
'c_s_aerobic_bacteria_manual_eye_ear_swab': { name: 'C & S for aerobic bacteria (Manual) - [Eye / Ear Swab]', price: 1000, category: 'microbiology' },
'c_s_aerobic_bacteria_manual_nasal_swab': { name: 'C & S for aerobic bacteria (Manual) - [Nasal Swab]', price: 1000, category: 'microbiology' },
'c_s_aerobic_bacteria_manual_pus': { name: 'C & S for aerobic bacteria (Manual) - [Pus]', price: 1000, category: 'microbiology' },
'c_s_aerobic_bacteria_manual_semen': { name: 'C & S for aerobic bacteria (Manual) - [Semen]', price: 1000, category: 'microbiology' },
'c_s_aerobic_bacteria_manual_sputum': { name: 'C & S for aerobic bacteria (Manual) - [Sputum]', price: 1000, category: 'microbiology' },
'c_s_aerobic_bacteria_manual_stool': { name: 'C & S for aerobic bacteria (Manual) - [Stool]', price: 1000, category: 'microbiology' },
'c_s_aerobic_bacteria_manual_throat_swab': { name: 'C & S for aerobic bacteria (Manual) - [Throat Swab]', price: 1000, category: 'microbiology' },
'c_s_aerobic_bacteria_manual_urethral_discharge': { name: 'C & S for aerobic bacteria (Manual) - [Urethral Discharge]', price: 1000, category: 'microbiology' },
'c_s_aerobic_bacteria_automated_blood': { name: 'C & S for Aerobic bacteria, Automated - [Blood]', price: 1000, category: 'microbiology' },
'c_s_aerobic_bacteria_automated_body_fluid': { name: 'C & S for Aerobic bacteria, Automated - [Body Fluid]', price: 1000, category: 'microbiology' },
'c_s_aerobic_bacteria_automated_csf': { name: 'C & S for Aerobic bacteria, Automated - [CSF]', price: 1000, category: 'microbiology' },
'fungal_culture_serum': { name: 'Fungal cuture - [Serum]', price: 900, category: 'microbiology' },
'fungal_identification_automated': { name: 'Fungal identification (Automated) - [Pure culture]', price: 820, category: 'microbiology' },
'fungal_stain_aspirate': { name: 'Fungal stain - [Aspirate]', price: 460, category: 'microbiology' },
'fungal_stain_body_fluid': { name: 'Fungal stain - [Body fluid]', price: 460, category: 'microbiology' },
'fungal_stain_csf': { name: 'Fungal stain - [CSF]', price: 460, category: 'microbiology' },
'fungal_stain_hair': { name: 'Fungal stain - [Hair]', price: 460, category: 'microbiology' },
'fungal_stain_nail': { name: 'Fungal stain - [Nail]', price: 460, category: 'microbiology' },
'fungal_stain_pus': { name: 'Fungal stain - [Pus]', price: 460, category: 'microbiology' },
'fungal_stain_semen': { name: 'Fungal stain - [semen]', price: 460, category: 'microbiology' },
'fungal_stain_skin': { name: 'Fungal stain - [skin]', price: 460, category: 'microbiology' },
'fungal_stain_sputum': { name: 'Fungal stain - [Sputum]', price: 460, category: 'microbiology' },
'fungal_stain_swab': { name: 'Fungal stain - [Swab]', price: 460, category: 'microbiology' },
'fungal_stain_urine_spot': { name: 'Fungal stain - [Urine, spot]', price: 460, category: 'microbiology' },
'fungal_susceptibility_yeast_automated': { name: 'Fungal Susceptibility - For Yeast Only (Automated) - [Pure culture]', price: 2100, category: 'microbiology' },
'grams_staining': { name: 'Gram`s staining - [Any specimen]', price: 400, category: 'microbiology' },
'koh_mount': { name: 'KOH mount - [Serum]', price: 100, category: 'microbiology' },
'rapid_culture_blood': { name: 'Rapid culture, blood - [Heparin blood]', price: 950, category: 'microbiology' },
'routine_examination_sputum_basic': { name: 'Routine examination, Sputum, Basic - [Sputum]', price: 700, category: 'microbiology' },
'routine_examination_stool_basic': { name: 'Routine Examination, stool (Basic) - [Stool]', price: 100, category: 'microbiology' },
'routine_examination_synovial_fluid_basic': { name: 'Routine examination, synovial fluid (Basic) - [Synovial Fluid]', price: 700, category: 'microbiology' },
'sputum_routine_basic': { name: 'Sputum Routine, Basic - [Sputum]', price: 700, category: 'microbiology' },
'tuberculosis_mtb_dna_detection_real_time_pcr': { name: 'Tuberculosis (MTB), DNA detection by Real time PCR - [Blood]', price: 2500, category: 'microbiology' },
'uibc': { name: 'UIBC - [Serum]', price: 330, category: 'microbiology' },
'water_culture_analysis_bacteriological': { name: 'Water culture analysis, bacteriological - [Water]', price: 1100, category: 'microbiology' },
'cmv_avidity_test': { name: 'CMV-Avidity test - [Serum]', price: 1160, category: 'serology' },
'cmv_dna_detection_qualitative': { name: 'CMV-DNA detection (Qualitative test) - [Plasma]', price: 4020, category: 'serology' },
'cmv_dna_viral_load_quantitative': { name: 'CMV-DNA Viral load (Quantitative test) - [Plasma]', price: 7220, category: 'serology' },
'covid_19_srl_dr_avinash_phadke_lab': { name: 'Covid 19 (SRL DR AVINASH PHADKE LAB)', price: 600, category: 'serology' },
'covid_19_srl_dr_avinash_phadke_lab_home_visit': { name: 'Covid 19 (SRL DR AVINASH PHADKE LAB) Home Visit', price: 800, category: 'serology' },
'covid_antibody_igg': { name: 'Covid Antibody IgG', price: 750, category: 'serology' },
'gene_xpert': { name: 'Gene Xpert', price: 2400, category: 'serology' },
'hiv_1_rna_detection_qualitative': { name: 'HIV-1-RNA Detection (Qualitative) - [Plasma]', price: 3200, category: 'serology' },
'hlab_pcr': { name: 'HLAB PCR', price: 3400, category: 'serology' },
'anti_hcv_screening': { name: 'Anti HCV- Screening', price: 450, category: 'serology' },
'apa_igg_phosphalipid_antibody': { name: 'APA - IgG Phosphalipid antibody - [Serum]', price: 800, category: 'serology' },
'apa_igm_phosphalipid_antibody': { name: 'APA - IgM Phosphalipid antibody - [Serum]', price: 800, category: 'serology' },
'chikungunya_test': { name: 'Chikungunya test - [Serum]', price: 1000, category: 'serology' },
'cmv_igg_antibodies_cyto_megalo_virus': { name: 'CMV-IgG Antibodies to Cyto Megalo Virus - [Serum]', price: 700, category: 'serology' },
'cmv_igm_antibodies_cyto_megalo_virus': { name: 'CMV-IgM Antibodies to Cyto Megalo Virus - [Serum]', price: 700, category: 'serology' },
'dengue_antigen': { name: 'Dengue Antigen', price: 600, category: 'serology' },
'gamma_interferon_tb_quantiferon_tb_gold': { name: 'Gamma Interferon for TB (Quantiferon TB Gold) - [Blood]', price: 2850, category: 'serology' },
'helicobacter_pylori_iga_antibodies': { name: 'Helicobacter Pylori - IgA antibodies - [Serum]', price: 2300, category: 'serology' },
'helicobacter_pylori_igg_antibodies': { name: 'Helicobacter Pylori - IgG antibodies - [Serum]', price: 2300, category: 'serology' },
'helicobacter_pylori_igm_antibodies': { name: 'Helicobacter Pylori - IgM antibodies - [Serum]', price: 2300, category: 'serology' },
'hiv_i_ii_antibody_spot_test': { name: 'HIV I & II antibody (Spot test) - [Serum]', price: 350, category: 'serology' },
'hiv_i_ii_antibodies_screening': { name: 'HIV I / II Antibodies Screening', price: 530, category: 'serology' },
'hiv_1_specific_2_indicative_western_blot_test': { name: 'HIV-1 specific & 2 indicative, western blot test - [Serum]', price: 2400, category: 'serology' },
'hsv_1_igg_antibodies_herpes_simplex_virus_1': { name: 'HSV 1 IgG antibodies to Herpes Simplex Virus 1 - [Serum]', price: 720, category: 'serology' },
'hsv_1_igm_antibodies_herpes_simplex_virus_1': { name: 'HSV 1 IgM antibodies to Herpes Simplex Virus 1 - [Serum]', price: 720, category: 'serology' },
'hsv_1_2_igg_antibodies_herpes_simplex_virus_1_2': { name: 'HSV 1&2 IgG antibodies to Herpes Simplex Virus 1 & 2 - [Serum]', price: 720, category: 'serology' },
'hsv_1_2_igm_antibodies_herpes_simplex_virus_1_2': { name: 'HSV 1&2 IgM antibodies to Herpes Simplex Virus 1 &2 - [Serum]', price: 720, category: 'serology' },
'leptospira_igg_antibody': { name: 'Leptospira - IgG antibody - [Serum]', price: 1120, category: 'serology' },
'leptospira_igm_antibody': { name: 'Leptospira - IgM Antibody - [Serum]', price: 1120, category: 'serology' },
'leptospira_detection': { name: 'Leptospira detection - [Blood, Urine]', price: 2600, category: 'serology' },
'mantoux_test_tuberculin_skin_test': { name: 'Mantoux test (Tuberculin skin test) - [Skin test]', price: 100, category: 'serology' },
'phosphalipid_antibody_apa_igg': { name: 'Phosphalipid antibody (APA)- IgG - [Serum]', price: 800, category: 'serology' },
'phosphalipid_antibody_apa_igm': { name: 'Phosphalipid antibody (APA)- IgM - [Serum]', price: 800, category: 'serology' },
'quantiferon_tb_gold_gamma_interferon_tb': { name: 'Quantiferon TB Gold (Gamma Interferon for TB) - [Blood]', price: 2200, category: 'serology' },
'rpr_vdrl': { name: 'RPR (VDRL) - [Serum]', price: 200, category: 'serology' },
'rubella_german_measles_avidity_test': { name: 'Rubella (German Measles), Avidity test - [Serum]', price: 1420, category: 'serology' },
'swine_flue': { name: 'Swine Flue', price: 5500, category: 'serology' },
                             'tb_gold_quantiferon_gamma_interferon_tb': { name: 'TB Gold (Quantiferon) (Gamma Interferon for TB) - [Blood]', price: 2200, category: 'blood_chemistry' },
'tpha_treponema_pallidum_haemagglutination_assay': { name: 'TPHA-Treponema Pallidum Haemagglutination Assay - [Serum]', price: 820, category: 'blood_chemistry' },
'troponin_i': { name: 'Troponin-I - [Serum]', price: 1820, category: 'blood_chemistry' },
'troponin_t': { name: 'Troponin-T - [Blood]', price: 1820, category: 'blood_chemistry' },
'tuberculin_skin_test_mantoux_test': { name: 'Tuberculin skin test (Mantoux test) - [Skin test]', price: 100, category: 'skin_test' },
'typhi_dot': { name: 'Typhi Dot', price: 450, category: 'blood_chemistry' },
'vdrl_rpr': { name: 'VDRL (RPR) - [Serum]', price: 150, category: 'blood_chemistry' },
'western_blot_test_hiv_1_specific_2_indicative_csf': { name: 'Western Blot Test for HIV-1 specific & 2 indicative - [CSF]', price: 2400, category: 'csf_analysis' },
'widal_test': { name: 'Widal test - [Serum]', price: 180, category: 'blood_chemistry' },
'17_hydroxy_progesterone': { name: '17 Hydroxy-progesterone - [Serum]', price: 1850, category: 'blood_chemistry' },
'17_ketogenic_steroids_corticosteroids': { name: '17 Ketogenic steroids (Corticosteroids) - [Urine, 24 hours]', price: 3500, category: 'urine_analysis' },
'17_ketosteroids': { name: '17 Ketosteroids - [Urine, 24 hours]', price: 3500, category: 'urine_analysis' },
'5_hiaa_hydroxy_indole_acetic_acid': { name: '5-HIAA (Hydroxy Indole Acetic Acid) - [Urine, 24 hours]', price: 3500, category: 'urine_analysis' },
'a4_androstenedione': { name: 'A4-Androstenedione - [Serum]', price: 2090, category: 'blood_chemistry' },
'abnormal_haemoglobin_studies_hb_variants': { name: 'Abnormal Haemoglobin studies(Hb variants), - [Blood]', price: 1010, category: 'blood_chemistry' },
'acetaminophane_paracetamol': { name: 'Acetaminophane (Paracetamol) - [Serum]', price: 1100, category: 'blood_chemistry' },
'acetone_serum': { name: 'Acetone - [Serum]', price: 800, category: 'blood_chemistry' },
'acetone_urine_spot': { name: 'Acetone - [Urine, spot]', price: 90, category: 'urine_analysis' },
'acid_load_test': { name: 'Acid load test - [Serum]', price: 600, category: 'blood_chemistry' },
'activated_protein_c_apc_resistance_test': { name: 'Activated protein C (APC) resistance test - [Plasma]', price: 4000, category: 'blood_chemistry' },
'adenosine_deaminase_ada': { name: 'Adenosine Deaminase (ADA) - [Serum]', price: 1120, category: 'blood_chemistry' },
'adenovirus_igg_antibody': { name: 'Adenovirus, IgG antibody - [Serum]', price: 1700, category: 'blood_chemistry' },
'adenovirus_igm_antibody': { name: 'Adenovirus, IgM antibody - [Serum]', price: 1700, category: 'blood_chemistry' },
'adh_antidiuretic_hormone_vasopressin': { name: 'ADH-Antidiuretic hormone (Vasopressin) - [Plasma]', price: 3850, category: 'blood_chemistry' },
'adrenaline_epinephrine': { name: 'Adrenaline (Epinephrine) - [Plasma]', price: 3500, category: 'blood_chemistry' },
'afb_rapid_culture_sputum': { name: 'AFB, Rapid Culture (Sputum)', price: 950, category: 'microbiology' },
'ala_amino_leveulinic_acid_quantitative': { name: 'ALA-Amino leveulinic acid (Quantitative) - [Urine, 24 hours]', price: 3100, category: 'urine_analysis' },
'alcohol_quantitative_serum': { name: 'Alcohol Quantitative - [Serum]', price: 1500, category: 'blood_chemistry' },
'alcohol_quantitative_urine_spot': { name: 'Alcohol Quantitative - [Urine, spot]', price: 1500, category: 'urine_analysis' },
'aldolase': { name: 'Aldolase - [Serum]', price: 1300, category: 'blood_chemistry' },
'aldosterone': { name: 'Aldosterone - [Serum]', price: 2150, category: 'blood_chemistry' },
'allergen_aspergillus_fumigatus': { name: 'ALLERGEN - ASPERGILLUS FUMIGATUS - [SERUM]', price: 1500, category: 'blood_chemistry' },
'allergen_gluten': { name: 'ALLERGEN - GLUTEN - [SERUM]', price: 1500, category: 'blood_chemistry' },
'alpha_1_antitrypsin': { name: 'Alpha-1-antitrypsin - [Serum]', price: 2200, category: 'blood_chemistry' },
'aluminium_blood': { name: 'Aluminium - [Blood]', price: 2700, category: 'blood_chemistry' },
'aluminium_urine_24_hours': { name: 'Aluminium - [Urine, 24 hours]', price: 2700, category: 'urine_analysis' },
'amino_acids_qualitative_serum': { name: 'Amino acids (Qualitative) - [Serum]', price: 8025, category: 'blood_chemistry' },
'amino_acids_qualitative_urine_spot': { name: 'Amino acids (Qualitative) - [Urine, spot]', price: 4000, category: 'urine_analysis' },
'amino_levulinic_acid_ala_quantitative': { name: 'Amino levulinic acid(ALA) (Quantitative) - [Urine, 24 hours]', price: 3100, category: 'urine_analysis' },
'amoebiasis_antibodies_igg_iha_amoebiasis': { name: 'Amoebiasis Antibodies-IgG (IHA for Amoebiasis) - [Serum]', price: 1100, category: 'blood_chemistry' },
'anca_mpo_p_anca': { name: 'ANCA-MPO (p-ANCA) - [Serum]', price: 1250, category: 'blood_chemistry' },
'anca_pr3_c_anca': { name: 'ANCA-PR3 (c-ANCA) - [Serum]', price: 1250, category: 'blood_chemistry' },
'androstenedione_a4': { name: 'Androstenedione (A4) - [Serum]', price: 2040, category: 'blood_chemistry' },
'anti_dnase_b': { name: 'Anti DNase B - [Serum]', price: 2355, category: 'blood_chemistry' },
'anti_hdv_total_antibodies_hepatitis_delta_virus': { name: 'Anti HDV-Total antibodies to Hepatitis Delta Virus - [Serum]', price: 1800, category: 'blood_chemistry' },
'anti_mullerian_harmone_amh': { name: 'Anti Mullerian Harmone (AMH)', price: 2200, category: 'blood_chemistry' },
'anti_thrombin_iii_activity_functional': { name: 'Anti thrombin III activity (Functional) - [Plasma]', price: 3800, category: 'blood_chemistry' },
'anti_thrombin_iii_antigen': { name: 'Anti thrombin III Antigen - [Plasma]', price: 3800, category: 'blood_chemistry' },
'apc_activated_protein_c_resistance_test': { name: 'APC-Activated protein C resistance test - [Plasma]', price: 3500, category: 'blood_chemistry' },
'arsenic_blood': { name: 'Arsenic - [Blood]', price: 3000, category: 'blood_chemistry' },
'arsenic_urine_24_hours': { name: 'Arsenic - [Urine, 24 hours]', price: 3000, category: 'urine_analysis' },
'arsenic_urine_spot': { name: 'Arsenic - [Urine, spot]', price: 3000, category: 'urine_analysis' },
'asab_anti_sperm_antibody_total': { name: 'ASAB - Anti Sperm Antibody (Total) - [Semen]', price: 1500, category: 'other_fluids' },
'asca_iga_antibodies_saccharomyces_cerevisiae': { name: 'ASCA-IgA antibodies to Saccharomyces cerevisiae - [Serum]', price: 2100, category: 'blood_chemistry' },
'asca_igg_antibodies_saccharomyces_cerevisiae': { name: 'ASCA-IgG antibodies to Saccharomyces cerevisiae - [Serum]', price: 2100, category: 'blood_chemistry' },
'asma_smooth_muscle_antibody_with_titre': { name: 'ASMA- Smooth Muscle Antibody with titre - [Serum]', price: 3100, category: 'blood_chemistry' },
'asma_smooth_muscle_antibody': { name: 'ASMA-Smooth Muscle Antibody - [Serum]', price: 1700, category: 'blood_chemistry' },
'aspergillosis_antibody': { name: 'Aspergillosis Antibody - [Serum]', price: 3400, category: 'blood_chemistry' },
'bcr_abl_gene_rearrangement_philadelphia_chromosome': { name: 'bcr-abl gene rearrangement (Philadelphia Chromosome) (t9:22 translocation) - [Blood]', price: 6500, category: 'genetic_testing' },
'benzodiazapine_qualitative': { name: 'Benzodiazapine (Qualitative) - [Urine, spot]', price: 750, category: 'urine_analysis' },
'benzodiazapine_quantitative': { name: 'Benzodiazapine (Quantitative) - [Urine, spot]', price: 750, category: 'urine_analysis' },
'bgp_bone_g1a_protein_osteocalcin': { name: 'BGP-Bone G1a protein (Osteocalcin) - [Plasma]', price: 2100, category: 'blood_chemistry' },
'brucella_igg_antibody': { name: 'Brucella-IgG antibody - [Serum]', price: 1200, category: 'blood_chemistry' },
'brucella_igm_antibody': { name: 'Brucella-IgM antibody - [Serum]', price: 1200, category: 'blood_chemistry' },
'c1_esterase_inhibitor': { name: 'C1 esterase inhibitor - [nA]', price: 4850, category: 'blood_chemistry' },
'ca_cyfra_21_1_lung_cancer_marker': { name: 'CA (Cyfra) 21-1 (Lung Cancer Marker) - [Serum]', price: 3200, category: 'blood_chemistry' },
'ca_242': { name: 'CA-242 - [Serum]', price: 2400, category: 'blood_chemistry' },
'ca_72_4': { name: 'CA-72-4 - [Serum]', price: 2500, category: 'blood_chemistry' },
'cadmium_blood': { name: 'Cadmium - [Blood]', price: 3400, category: 'blood_chemistry' },
'calcitonin': { name: 'Calcitonin - [Serum]', price: 2500, category: 'blood_chemistry' },
'calcium_ionised': { name: 'Calcium, ionised - [Serum]', price: 450, category: 'blood_chemistry' },
'calculus_stone_analysis_gall_bladder_stone': { name: 'Calculus(Stone) analysis - [Gall bladder stone]', price: 1000, category: 'other_tests' },
'calculus_stone_analysis_renal_calculi': { name: 'Calculus(Stone) analysis - [Renal calculi]', price: 1000, category: 'other_tests' },
'calculus_stone_analysis_automated_ftir_gall_bladder_stone': { name: 'Calculus(Stone) analysis by automated FTIR - [Gall bladder stone]', price: 1400, category: 'other_tests' },
'calculus_stone_analysis_automated_ftir_renal_calculi': { name: 'Calculus(Stone) analysis by automated FTIR - [Renal calculi]', price: 1400, category: 'other_tests' },
'carbamazepine_tegretol_serum': { name: 'Carbamazepine (Tegretol) - [Serum]', price: 800, category: 'blood_chemistry' },
'catecholamines_adrenaline_nor_adrenaline_plasma': { name: 'Catecholamines (Adrenaline+Nor Adrenaline) - [Plasma]', price: 3200, category: 'blood_chemistry' },
'ccp_antibody_cyclic_citrullinated_peptide_serum': { name: 'CCP-Antibody to Cyclic Citrullinated Peptide - [Serum]', price: 1700, category: 'blood_chemistry' },
'cd4_count_blood': { name: 'CD4 count - [Blood]', price: 1200, category: 'blood_chemistry' },
'cd4_cd8_counts_blood': { name: 'CD4/CD8 Counts - [Blood]', price: 1600, category: 'blood_chemistry' },
'centromere_antibody_serum': { name: 'Centromere Antibody - [Serum]', price: 2700, category: 'blood_chemistry' },
'ceruloplasmin_copper_oxidase_serum': { name: 'Ceruloplasmin (Copper Oxidase) - [Serum]', price: 1250, category: 'blood_chemistry' },
'ch_50_complement_total_serum': { name: 'CH-50 (Complement, total) - [Serum]', price: 4500, category: 'blood_chemistry' },
'chlamydia_trachomatis_dna_fluid': { name: 'Chlamydia Trachomatis DNA - [Fluid]', price: 3400, category: 'other_fluids' },
'chlamydia_trachomatis_iga_antibodies_serum': { name: 'Chlamydia Trachomatis-IgA Antibodies - [Serum]', price: 2200, category: 'blood_chemistry' },
'chlamydia_trachomatis_igg_antibodies_serum': { name: 'Chlamydia Trachomatis-IgG Antibodies - [Serum]', price: 2200, category: 'blood_chemistry' },
'chlamydia_trachomatis_igm_antibodies': { name: 'Chlamydia Trachomatis-IgM Antibodies', price: 2200, category: 'blood_chemistry' },
'cholera_stool': { name: 'Cholera - [Stool]', price: 400, category: 'stool_analysis' },
'cholinesterase_pseudo_serum': { name: 'Cholinesterase (Pseudo) - [Serum]', price: 1000, category: 'blood_chemistry' },
'chromium_blood': { name: 'Chromium - [Blood]', price: 3500, category: 'blood_chemistry' },
'chromogranin_a_serum': { name: 'Chromogranin A - [Serum]', price: 7400, category: 'blood_chemistry' },
'clostridium_difficile_toxin_a_b_stool': { name: 'Clostridium Difficile Toxin A and B - [Stool]', price: 1600, category: 'stool_analysis' },
'cobalt_blood': { name: 'Cobalt - [Blood]', price: 2950, category: 'blood_chemistry' },
'cobalt_urine_24_hours': { name: 'Cobalt - [Urine, 24 hours]', price: 3200, category: 'urine_analysis' },
'cobalt_urine_spot': { name: 'Cobalt - [Urine, spot]', price: 3200, category: 'urine_analysis' },
'cocaine_quantitative_urine_spot': { name: 'Cocaine (Quantitative) - [Urine, spot]', price: 1220, category: 'urine_analysis' },
'cold_agglutinin_serum': { name: 'Cold agglutinin - [Serum]', price: 600, category: 'blood_chemistry' },
'copper_24hrs_urine': { name: 'Copper - [24hrs urine]', price: 2200, category: 'urine_analysis' },
'copper_spot_urine': { name: 'Copper - [Spot urine]', price: 1800, category: 'urine_analysis' },
'copper_oxidase_ceruloplasmin_serum': { name: 'Copper Oxidase (Ceruloplasmin) - [Serum]', price: 1000, category: 'blood_chemistry' },
'cortisol_random': { name: 'CORTISOL (Random)', price: 800, category: 'blood_chemistry' },
'coxiella_burnetii_igg_q_fever_serum': { name: 'Coxiella Burnetii, IgG (Q fever) - [Serum]', price: 4000, category: 'blood_chemistry' },
'coxiella_burnetii_igm_q_fever_serum': { name: 'Coxiella Burnetii, IgM (Q fever) - [Serum]', price: 4000, category: 'blood_chemistry' },
'coxsackie_antibody_igg_serum': { name: 'Coxsackie antibody-IgG - [Serum]', price: 1800, category: 'blood_chemistry' },
'coxsackie_antibody_igm_serum': { name: 'Coxsackie antibody-IgM - [Serum]', price: 1800, category: 'blood_chemistry' },
'cryoglobulins_qualitative_serum': { name: 'Cryoglobulins (Qualitative) - [Serum]', price: 1150, category: 'blood_chemistry' },
'cryptococcus_antigen_qualitative_csf': { name: 'Cryptococcus Antigen, Qualitative - [CSF]', price: 2800, category: 'csf_analysis' },
'cryptococcus_antigen_qualitative_serum': { name: 'Cryptococcus Antigen, Qualitative - [Serum]', price: 2000, category: 'blood_chemistry' },
'cryptococcus_antigen_quantification_csf': { name: 'Cryptococcus Antigen, Quantification - [CSF]', price: 2100, category: 'csf_analysis' },
'cryptococcus_antigen_quantification_serum': { name: 'Cryptococcus Antigen, Quantification - [Serum]', price: 2100, category: 'blood_chemistry' },
'crystals_synovial_fluids_synovial_fluid': { name: 'Crystals, Synovial fluids - [Synovial fluid]', price: 130, category: 'other_fluids' },
'csf_electrophoresis_csf': { name: 'CSF electrophoresis - [CSF]', price: 4000, category: 'csf_analysis' },
'cyclosporin_a_trough_level_c0_blood': { name: 'Cyclosporin A Trough level (C0) - [Blood]', price: 2200, category: 'blood_chemistry' },
'cysticercus_igg_antibodies_serum': { name: 'Cysticercus - IgG antibodies - [Serum]', price: 1700, category: 'blood_chemistry' },
'dengue_igg_antibodies_serum': { name: 'Dengue-IgG antibodies - [Serum]', price: 400, category: 'blood_chemistry' },
'dengue_igm_antibodies_serum': { name: 'Dengue-IgM antibodies - [Serum]', price: 400, category: 'blood_chemistry' },
'dht_di_hydro_testosterone_serum': { name: 'DHT-Di hydro testosterone - [Serum]', price: 2650, category: 'blood_chemistry' },
'diazepam_benzadiazepine_qualitative_urine_spot': { name: 'Diazepam (Benzadiazepine) (Qualitative) - [Urine, spot]', price: 750, category: 'urine_analysis' },
'diazepam_benzadiazepine_quantitative_urine_spot': { name: 'Diazepam (Benzadiazepine)(Quantitative) - [Urine, spot]', price: 1000, category: 'urine_analysis' },
'dilantin_phenytoin_eptoin_serum': { name: 'Dilantin (Phenytoin) (Eptoin) - [Serum]', price: 1000, category: 'blood_chemistry' },
'diphtheria_igg_antibodies_serum': { name: 'Diphtheria - IgG antibodies - [Serum]', price: 2000, category: 'blood_chemistry' },
                               'dna_double_strand_antibody_quantitative_serum': { name: 'DNA (Double Strand) Antibody (Quantitative) - [Serum]', price: 1500, category: 'blood_chemistry' },
'dpd_deoxypyridinoline_pyrilinks_d_urine': { name: 'DPD-Deoxypyridinoline (Pyrilinks D) - [Urine]', price: 2000, category: 'urine_analysis' },
'ebv_dna_detection_blood': { name: 'EBV DNA detection - [Blood]', price: 4250, category: 'blood_chemistry' },
'ebv_vca_igg_antibodies_viral_capsid_antigen_epstein_barr_virus_serum': { name: 'EBV(VCA)-IgG antibodies to Viral Capsid Antigen of Epstein Barr Virus - [Serum]', price: 1600, category: 'blood_chemistry' },
'ebv_vca_igm_antibodies_viral_capsid_antigen_epstein_barr_virus_serum': { name: 'EBV(VCA)-IgM antibodies to Viral Capsid Antigen of Epstein Barr Virus - [Serum]', price: 1600, category: 'blood_chemistry' },
'echinococcus_hydatid_cyst_igg_serum': { name: 'Echinococcus (Hydatid Cyst) - IgG, serum - [Serum]', price: 1400, category: 'blood_chemistry' },
'echovirus_antibody_igg_serum': { name: 'Echovirus antibody-IgG - [Serum]', price: 2500, category: 'blood_chemistry' },
'echovirus_antibody_igm_serum': { name: 'Echovirus antibody-IgM - [Serum]', price: 2500, category: 'blood_chemistry' },
'endomysial_antibody_serum': { name: 'Endomysial Antibody - [Serum]', price: 2200, category: 'blood_chemistry' },
'epo_erythropoietin_serum': { name: 'EPO-Erythropoietin - [Serum]', price: 2220, category: 'blood_chemistry' },
'erythropoietin_epo_serum': { name: 'Erythropoietin (EPO) - [Serum]', price: 1220, category: 'blood_chemistry' },
'ethanol_qualitative_analyse_same_day_serum': { name: 'Ethanol, Qualitative (Analyse same day) - [Serum]', price: 900, category: 'blood_chemistry' },
'ethanol_quantitative_analyse_same_day_serum': { name: 'Ethanol, Quantitative (Analyse same day) - [Serum]', price: 900, category: 'blood_chemistry' },
'factor_ix_activity_functional_plasma': { name: 'Factor IX activity (functional) - [Plasma]', price: 4000, category: 'blood_chemistry' },
'factor_v_activity_functional_plasma': { name: 'Factor V , Activity (functional) - [Plasma]', price: 5500, category: 'blood_chemistry' },
'factor_v_leiden_mutant_detection_blood': { name: 'Factor V leiden, mutant detection - [Blood]', price: 5100, category: 'genetic_testing' },
'factor_viii_activity_plasma': { name: 'Factor VIII activity - [Plasma]', price: 3500, category: 'blood_chemistry' },
'factor_xiii_13_activity_plasma': { name: 'Factor-XIII (13), activity - [Plasma]', price: 2500, category: 'blood_chemistry' },
'foetal_haemoglobin_hbf_blood': { name: 'Foetal Haemoglobin (HbF), blood - [Blood]', price: 500, category: 'blood_chemistry' },
'free_lite_chains_free_kappa_free_lambda_serum': { name: 'Free Lite Chains (Free Kappa and Free Lambda) - [Serum]', price: 5000, category: 'blood_chemistry' },
'free_testosterone_serum': { name: 'Free Testosterone - [Serum]', price: 1600, category: 'blood_chemistry' },
'fructosamine_serum': { name: 'Fructosamine - [Serum]', price: 1150, category: 'blood_chemistry' },
'gall_bladder_stone_analysis': { name: 'Gall Bladder stone analysis', price: 1000, category: 'other_tests' },
'gardinal_phenobarbitone_serum': { name: 'Gardinal (Phenobarbitone) , - [Serum]', price: 700, category: 'blood_chemistry' },
'gastric_parietal_cell_antibody_total_serum': { name: 'Gastric Parietal Cell Antibody, total - [Serum]', price: 1700, category: 'blood_chemistry' },
'gastrin_post_prandial_serum': { name: 'Gastrin (Post prandial) - [Serum]', price: 1600, category: 'blood_chemistry' },
'gastrin_serum': { name: 'Gastrin - [Serum]', price: 1600, category: 'blood_chemistry' },
'gbm_igg_antibody_serum': { name: 'GBM - IgG Antibody - [Serum]', price: 1600, category: 'blood_chemistry' },
'german_measles_rubella_igg_antibody_serum': { name: 'German Measles(Rubella), IgG antibody - [Serum]', price: 450, category: 'blood_chemistry' },
'german_measles_rubella_igm_antibody_serum': { name: 'German Measles(Rubella), IgM antibody - [Serum]', price: 450, category: 'blood_chemistry' },
'growth_hormone_hgh_serum': { name: 'Growth Hormone (HGH) - [Serum]', price: 700, category: 'blood_chemistry' },
'haemoglobin_variants_blood': { name: 'Haemoglobin variants - [Blood]', price: 1150, category: 'blood_chemistry' },
'haemoglobin_free_urine_spot': { name: 'Haemoglobin, free - [Urine, spot]', price: 300, category: 'urine_analysis' },
'haemosiderin_urine_spot': { name: 'Haemosiderin - [Urine, spot]', price: 1600, category: 'urine_analysis' },
'hams_test_pnh_confirmatory_test_serum_blood': { name: 'Ham\'s test (PNH confirmatory test) - [Serum, Blood]', price: 1100, category: 'blood_chemistry' },
'hanta_virus_igm_antibodies_serum': { name: 'Hanta Virus - IgM antibodies - [Serum]', price: 1300, category: 'blood_chemistry' },
'haptoglobin_serum': { name: 'Haptoglobin - [Serum]', price: 1800, category: 'blood_chemistry' },
'hav_igm_antibodies_hepatitis_a_virus_serum': { name: 'HAV-IgM Antibodies to Hepatitis `A~ Virus - [Serum]', price: 950, category: 'blood_chemistry' },
'hbcab_igm_antibodies_hepatitis_b_core_antigen_serum': { name: 'HBcAb-IgM antibodies to Hepatitis B Core Antigen - [Serum]', price: 880, category: 'blood_chemistry' },
'hbf_haemoglobin_f_foetal_haemoglobin_blood': { name: 'HbF - Haemoglobin F, (Foetal Haemoglobin) - [Blood]', price: 500, category: 'blood_chemistry' },
'hbv_dna_detection_qualitative_serum_plasma': { name: 'HBV-DNA Detection (Qualitative) - [Serum or plasma]', price: 3800, category: 'blood_chemistry' },
'hbv_dna_genotyping_serum': { name: 'HBV-DNA Genotyping - [Serum]', price: 6700, category: 'genetic_testing' },
'hco3_plasma': { name: 'HCO3 - [Plasma]', price: 270, category: 'blood_chemistry' },
'hcv_genotyping_serum_plasma': { name: 'HCV-Genotyping - [Serum, Plasma]', price: 13000, category: 'genetic_testing' },
'hcv_igm_antibody_serum': { name: 'HCV-IgM antibody - [Serum]', price: 870, category: 'blood_chemistry' },
'hcv_rna_detection_qualitative_plasma_serum': { name: 'HCV-RNA Detection (Qualitative) - [Plasma or serum]', price: 3900, category: 'blood_chemistry' },
'hcv_rna_quantification_viral_load_plasma_serum': { name: 'HCV-RNA Quantification (Viral load) - [Plasma or serum]', price: 6800, category: 'blood_chemistry' },
'herpes_simplex_ii_antibody_serum': { name: 'Herpes Simplex II Antibody - [Serum]', price: 1420, category: 'blood_chemistry' },
'hev_igm_antibodies_hepatitis_e_virus_serum': { name: 'HEV-IgM Antibodies to Hepatitis E Virus - [Serum]', price: 1100, category: 'blood_chemistry' },
'hgh_human_growth_hormone_serum': { name: 'HGH- Human Growth Hormone - [Serum]', price: 700, category: 'blood_chemistry' },
'hiaa_5_hydroxy_indole_acetic_acid_urine_24_hours': { name: 'HIAA (5) (Hydroxy Indole Acetic Acid) - [Urine, 24 hours]', price: 2400, category: 'urine_analysis' },
'histone_antibody_serum': { name: 'Histone antibody - [Serum]', price: 1400, category: 'blood_chemistry' },
'hiv_1_rna_quantification_viral_load_plasma': { name: 'HIV-1-RNA Quantification (Viral load) - [Plasma]', price: 5110, category: 'blood_chemistry' },
'hiv_i_drug_resistance_test_plasma': { name: 'HIV-I drug resistance test - [Plasma]', price: 21000, category: 'genetic_testing' },
'hiv_p24_antigen_with_confirmation_serum': { name: 'HIV-p24 antigen (with confirmation) - [Serum]', price: 1200, category: 'blood_chemistry' },
'hiv_proviral_dna_blood_plasma': { name: 'HIV-proviral DNA - [Blood, plasma]', price: 2800, category: 'blood_chemistry' },
                               
'hla_b27_blood': { name: 'HLA-B27 - [Blood]', price: 2200, category: 'blood_chemistry' },
'homogentisic_acid_alkaptanuria_urine_spot': { name: 'Homogentisic acid (Alkaptanuria) - [Urine, spot]', price: 800, category: 'urine_tests' },
'hpv_dna_vaginal_swab': { name: 'HPV-DNA - [Vaginal swab]', price: 2700, category: 'molecular_diagnostics' },
'hsv_dna_detection_type_1_2_virus_csf': { name: 'HSV-DNA detection for type 1 and 2 virus - [CSF]', price: 3700, category: 'molecular_diagnostics' },
'hsv_dna_detection_type_1_2_virus_serum': { name: 'HSV-DNA detection for type 1 and 2 virus - [Serum]', price: 3700, category: 'molecular_diagnostics' },
'htlv_1_2_antibodies_serum_plasma': { name: 'HTLV 1 and 2, antibodies - [Serum, plasma]', price: 3100, category: 'serology' },
'igd_blood': { name: 'IgD - [Blood]', price: 2700, category: 'immunology' },
'igf_bp_3_serum': { name: 'IGF BP-3 - [Serum]', price: 2300, category: 'hormones' },
'igf_1_somatomedin_c_serum': { name: 'IGF-1 (Somatomedin C) - [Serum]', price: 1900, category: 'hormones' },
'il_6_serum': { name: 'IL-6 - [Serum]', price: 3300, category: 'cytokines' },
'immunofixation_qualitative_urine_24_hrs': { name: 'Immunofixation ,Qualitative - ( Urine, 24 hrs)', price: 6100, category: 'immunology' },
'immunofixation_quantative_serum': { name: 'Immunofixation ,Quantative - ( Serum )', price: 7200, category: 'immunology' },
'immunofixation_quantative_urine_24_hrs': { name: 'Immunofixation ,Quantative - ( Urine,24 Hrs )', price: 8000, category: 'immunology' },
'india_ink_preparation_csf': { name: 'India Ink Preparation, CSF - [CSF]', price: 380, category: 'microbiology' },
'infectious_mononucleosis_test_serum': { name: 'Infectious Mononucleosis test - [Serum]', price: 700, category: 'serology' },
'inhibin_a_serum': { name: 'Inhibin A - [Serum]', price: 1400, category: 'hormones' },
'inhibin_b_serum': { name: 'Inhibin B - [Serum]', price: 1800, category: 'hormones' },
'insulin_antibody_serum': { name: 'Insulin antibody - [Serum]', price: 2675, category: 'immunology' },
'insulin_like_growth_factor_igf_1_somatomedin_c_serum': { name: 'Insulin Like Growth Factor (IGF)-1 (Somatomedin C) - [Serum]', price: 3150, category: 'hormones' },
'interferon_gamma_tb_quantiferon_tb_gold_blood': { name: 'Interferon Gamma for TB (Quantiferon TB Gold) - [Blood]', price: 2870, category: 'immunology' },
'intrinsic_factor_antibody_serum': { name: 'Intrinsic factor antibody - [Serum]', price: 1700, category: 'immunology' },
'islet_cell_antibody_if_serum': { name: 'Islet cell antibody (IF) - [Serum]', price: 2100, category: 'immunology' },
'kappa_lambda_light_chains_freelite_serum': { name: 'Kappa and Lambda light chains, freelite - [Serum]', price: 3700, category: 'immunology' },
'kappa_light_chains_blood': { name: 'Kappa Light Chains - [Blood]', price: 2100, category: 'immunology' },
'karyotyping_serum': { name: 'Karyotyping - [Serum]', price: 4350, category: 'genetics' },
'kct_kaolin_clotting_time_plasma': { name: 'KCT-Kaolin Clotting time - [Plasma]', price: 1000, category: 'coagulation' },
'ketone_bodies_urine_spot': { name: 'Ketone bodies - [Urine, spot]', price: 50, category: 'urine_tests' },
'ketosteroids_17_urine_24_hours': { name: 'Ketosteroids (17) - [Urine, 24 hours]', price: 2000, category: 'hormones' },
'kidney_stone_analysis_serum': { name: 'Kidney stone Analysis - [Serum]', price: 1000, category: 'clinical_pathology' },
'la_antibody_ssb_soluble_substance_b_antibody_serum': { name: 'La antibody (SSB-Soluble Substance B) Antibody, serum - [Serum]', price: 1400, category: 'immunology' },
'lactate_plasma': { name: 'Lactate - [Plasma]', price: 1320, category: 'blood_chemistry' },
'lanoxin_digoxin_serum': { name: 'Lanoxin (Digoxin) - [Serum]', price: 750, category: 'drug_monitoring' },
'lead_blood': { name: 'Lead - [Blood]', price: 2100, category: 'toxicology' },
'lead_urine_24_hours': { name: 'Lead - [Urine, 24 hours]', price: 2100, category: 'toxicology' },
'lead_urine_spot': { name: 'Lead - [Urine, spot]', price: 2100, category: 'toxicology' },
'legionella_pneumophila_igg_antibody_serum': { name: 'Legionella pneumophila IgG antibody - [Serum]', price: 2800, category: 'serology' },
'legionella_pneumophila_igm_antibody_serum': { name: 'Legionella pneumophila IgM antibody - [Serum]', price: 2800, category: 'serology' },
'leptin_human_leptin_serum': { name: 'Leptin (Human Leptin) - [Serum]', price: 5100, category: 'hormones' },
'leucocyte_alkaline_phosphatase_lap_score_blood': { name: 'Leucocyte Alkaline Phosphatase (LAP) score - [Blood]', price: 1300, category: 'hematology' },
'light_chains_freelite_kappa_lambda_serum': { name: 'Light Chains, Freelite (Kappa and Lambda) - [Serum]', price: 3700, category: 'immunology' },
'lipoprotein_electrophoresis_serum': { name: 'Lipoprotein Electrophoresis - [Serum]', price: 2800, category: 'blood_chemistry' },
'lkm1_antibodies_liver_kidney_microsomes_qualitative_serum': { name: 'LKM1-Antibodies to Liver Kidney Microsomes (Qualitative) - [Serum]', price: 1200, category: 'immunology' },
'lyme_disease_borrelia_burgdorferi_igg_antibodies_serum': { name: 'Lyme disease (Borrelia Burgdorferi) IgG antibodies - [Serum]', price: 2020, category: 'serology' },
'lyme_disease_borrelia_burgdorferi_igm_antibodies_serum': { name: 'Lyme disease (Borrelia Burgdorferi) IgM antibodies - [Serum]', price: 1800, category: 'serology' },
'manganese_serum': { name: 'Manganese - [Serum]', price: 2400, category: 'toxicology' },
'marijuana_thc_cannabis_qualitative_urine_spot': { name: 'Marijuana (THC) (Cannabis) (Qualitative) - [Urine, spot]', price: 750, category: 'drug_testing' },
'marijuana_thc_cannabis_quantitative_urine_spot': { name: 'Marijuana (THC) (Cannabis) (Quantitative) - [Urine, spot]', price: 750, category: 'drug_testing' },
'measles_rubeola_igg_antibodies_serum': { name: 'Measles (Rubeola) -IgG antibodies - [Serum]', price: 1280, category: 'serology' },
'measles_rubeola_igm_antibodies_serum': { name: 'Measles (Rubeola) -IgM antibodies - [Serum]', price: 1280, category: 'serology' },
'mercury_serum': { name: 'Mercury - [Serum]', price: 2950, category: 'toxicology' },
'mercury_urine_24_hours': { name: 'Mercury - [Urine, 24 hours]', price: 2950, category: 'toxicology' },
'mercury_urine_spot': { name: 'Mercury - [Urine, spot]', price: 3300, category: 'toxicology' },
'metanephrine_plasma': { name: 'METANEPHRINE (Plasma)', price: 2400, category: 'hormones' },
'metanephrine_quantitative_urine_24_hours': { name: 'Metanephrine (Quantitative) - [Urine, 24 hours]', price: 1900, category: 'hormones' },
'meth_haemoglobin_blood': { name: 'Meth-haemoglobin - [Blood]', price: 900, category: 'hematology' },
'mitochondrial_m2_antibody_qualitative_serum': { name: 'Mitochondrial (M2) Antibody (Qualitative) - [Serum]', price: 1250, category: 'immunology' },
'morphine_opiates_qualitative_urine_spot': { name: 'Morphine (Opiates) (Qualitative) - [Urine, spot]', price: 770, category: 'drug_testing' },
'morphine_opiates_quantitative_urine_spot': { name: 'Morphine (Opiates) (Quantitative) - [Urine, spot]', price: 750, category: 'drug_testing' },
'mucopolysaccharides_mps_qualitative_serum': { name: 'Mucopolysaccharides (MPS) (Qualitative) - [Serum]', price: 360, category: 'biochemistry' },
'mumps_igg_antibodies_serum': { name: 'Mumps-IgG Antibodies - [Serum]', price: 3000, category: 'serology' },
'mumps_igm_antibodies_serum': { name: 'Mumps-IgM Antibodies - [Serum]', price: 1620, category: 'serology' },
'mycoplasma_pneumoniae_antibody_igg_serum': { name: 'Mycoplasma pneumoniae antibody, IgG - [Serum]', price: 1800, category: 'serology' },
'mycoplasma_pneumoniae_antibody_igm_serum': { name: 'Mycoplasma pneumoniae antibody, IgM - [Serum]', price: 1800, category: 'serology' },
'myoglobin_serum': { name: 'Myoglobin - [Serum]', price: 1700, category: 'cardiac_markers' },
'myoglobin_urine': { name: 'Myoglobin - [Urine]', price: 700, category: 'urine_tests' },
'neutrophils_count_absolute_blood': { name: 'Neutrophils Count, Absolute - [Blood]', price: 100, category: 'hematology' },
'nor_adrenaline_nor_epinephrine_plasma': { name: 'Nor-Adrenaline (Nor-epinephrine) - [Plasma]', price: 1600, category: 'hormones' },
'nor_epinephrine_nor_adrenaline_plasma': { name: 'Nor-epinephrine (Nor-Adrenaline ) - [Plasma]', price: 1600, category: 'hormones' },
'nse_neuron_specific_enolase_serum': { name: 'NSE-Neuron specific enolase - [Serum]', price: 3400, category: 'tumor_markers' },
'nt_pro_bnp_serum_plasma': { name: 'NT Pro BNP - [Serum/Plasma]', price: 2520, category: 'cardiac_markers' },
'opiates_morphine_quantitative_urine': { name: 'Opiates (Morphine) (Quantitative) - [Urine]', price: 750, category: 'drug_testing' },
'osmolality_automated_osmometry_serum': { name: 'Osmolality (Automated Osmometry) - [Serum]', price: 750, category: 'blood_chemistry' },
'osmolality_automated_osmometry_urine': { name: 'Osmolality (Automated Osmometry) - [Urine]', price: 750, category: 'urine_tests' },
'osmotic_fragility_test_rbc_fragility_test_blood': { name: 'Osmotic fragility test. (RBC fragility test) - [Blood]', price: 700, category: 'hematology' },
'osteocalcin_bgp_bone_g1a_protein_plasma': { name: 'Osteocalcin (BGP-Bone G1a protein) - [Plasma]', price: 2100, category: 'bone_markers' },
'paracetamol_acetaminophane_serum': { name: 'Paracetamol (Acetaminophane) - [Serum]', price: 1100, category: 'drug_monitoring' },
'parietal_cell_antibody_total_serum': { name: 'Parietal Cell Antibody, total - [Serum]', price: 1700, category: 'immunology' },
'parvovirus_b19_igg_serum': { name: 'Parvovirus B19, IgG - [Serum]', price: 3000, category: 'serology' },
'parvovirus_b19_igm_serum': { name: 'Parvovirus B19, IgM - [Serum]', price: 3000, category: 'serology' },
'paul_bunnel_test_serum': { name: 'Paul Bunnel Test - [Serum]', price: 750, category: 'serology' },
'pcp_phencyclidine_phosphate_urine_quantitative_urine': { name: 'PCP-Phencyclidine Phosphate, urine (Quantitative) - [Urine]', price: 750, category: 'drug_testing' },
'pertussis_igg_antibodies_serum': { name: 'Pertussis - IgG antibodies - [Serum]', price: 1800, category: 'serology' },
'phenobarbitone_gardinal_serum': { name: 'Phenobarbitone (Gardinal) , - [Serum]', price: 700, category: 'drug_monitoring' },
'phenyl_alanine_neonatal_screen_blood': { name: 'Phenyl alanine, neonatal screen - [Blood]', price: 1600, category: 'neonatal_screening' },
'phenytoin_eptoin_serum': { name: 'Phenytoin (Eptoin), - [Serum]', price: 1020, category: 'drug_monitoring' },
'plasma_renin_activity_plasma_pra_plasma': { name: 'Plasma Renin Activity, plasma (PRA) - [Plasma]', price: 4700, category: 'hormones' },
'platelet_antibodies_serum': { name: 'Platelet Antibodies - [Serum]', price: 4300, category: 'immunology' },
'pnh_confirmatory_test_hams_test_serum_blood': { name: 'PNH confirmatory test (Ham\'s test) - [Serum, Blood]', price: 6900, category: 'hematology' },
'porphyrins_includes_ala_pbg_urine_24_hours': { name: 'Porphyrins (Includes ALA & PBG) - [Urine, 24 hours]', price: 4100, category: 'biochemistry' },
'porphyrins_includes_ala_pbg_urine_spot': { name: 'Porphyrins (Includes ALA & PBG) - [Urine, spot]', price: 4100, category: 'biochemistry' },
'ppd_mantoux_test_tuberculin_skin_test_skin_test': { name: 'PPD (Mantoux test) (Tuberculin skin test) - [Skin test]', price: 100, category: 'tuberculosis_testing' },
'procalcitonin': { name: 'Procalcitonin', price: 2700, category: 'infection_markers' },
'prostatic_fluid_routine_examination_basic_prostatic_fluid': { name: 'Prostatic fluid, routine examination (Basic) - [Prostatic fluid]', price: 700, category: 'body_fluid_analysis' },
'protein_c_activity_functional_plasma': { name: 'Protein C activity (functional) - [Plasma]', price: 4020, category: 'coagulation' },
'protein_c_antigen_quantification_plasma': { name: 'Protein C antigen, quantification - [Plasma]', price: 4020, category: 'coagulation' },
'protein_electrophoresis_csf_serum': { name: 'Protein Electrophoresis - [CSF, serum]', price: 4000, category: 'protein_studies' },
'protein_electrophoresis_urine_24_hours': { name: 'Protein Electrophoresis - [Urine, 24 hours]', price: 930, category: 'protein_studies' },
'protein_s_activity_total_plasma': { name: 'Protein S activity, total - [Plasma]', price: 4020, category: 'coagulation' },
'protein_s_antigen_quantification_plasma': { name: 'Protein S antigen, Quantification - [Plasma]', price: 4960, category: 'coagulation' },
'pseudo_cholinesterase_serum': { name: 'Pseudo Cholinesterase - [Serum]', price: 1000, category: 'enzymes' },
'pyruvate_pyruvic_acid_blood': { name: 'Pyruvate (Pyruvic acid) - [Blood]', price: 2700, category: 'biochemistry' },
'rabies_antibody_serum': { name: 'Rabies antibody - [Serum]', price: 2300, category: 'serology' },
'rbc_fragility_test_osmotic_fragility_test_blood': { name: 'RBC fragility test (Osmotic fragility test.) - [Blood]', price: 700, category: 'hematology' },
'renal_stone_analysis_renal_stone': { name: 'Renal stone analysis - [Renal stone]', price: 1000, category: 'clinical_pathology' },
'renin_direct_plasma': { name: 'Renin direct - [Plasma]', price: 3200, category: 'hormones' },
'rnp_sm_antibody_serum': { name: 'RNP-Sm Antibody - [Serum]', price: 1400, category: 'immunology' },
'routine_examination_prostatic_fluid_basic_prostatic_fluid': { name: 'Routine examination of prostatic fluid(Basic) - [Prostatic fluid]', price: 700, category: 'body_fluid_analysis' },
'routine_examination_ascitic_fluid_basic_ascitic_fluid': { name: 'Routine examination, ascitic fluid. (Basic) - [Ascitic fluid]', price: 700, category: 'body_fluid_analysis' },
'routine_examination_body_fluids_basic_body_fluid': { name: 'Routine examination, body fluids (Basic) - [Body fluid]', price: 700, category: 'body_fluid_analysis' },
'routine_examination_csf_basic_csf': { name: 'Routine examination, CSF (Basic) - [CSF]', price: 810, category: 'body_fluid_analysis' },
'routine_examination_pericardial_fluid_basic_pericardial_fluid': { name: 'Routine examination, Pericardial fluid (Basic) - [Pericardial fluid]', price: 700, category: 'body_fluid_analysis' },
'routine_examination_peritoneal_fluid_basic_peritoneal_fluid': { name: 'Routine examination, Peritoneal fluid (Basic) - [Peritoneal fluid]', price: 700, category: 'body_fluid_analysis' },
'routine_examination_plueral_fluid_basic_pleural_fluid': { name: 'Routine examination, plueral fluid (Basic) - [Pleural fluid]', price: 810, category: 'body_fluid_analysis' },
'rubella_dna_detection_blood': { name: 'Rubella-DNA detection - [Blood]', price: 14600, category: 'molecular_diagnostics' },
'rubeola_measles_igg_antibodies_serum': { name: 'Rubeola (Measles) -IgG antibodies - [Serum]', price: 950, category: 'serology' },
'rubeola_measles_igm_antibodies_serum': { name: 'Rubeola (Measles) -IgM antibodies - [Serum]', price: 1050, category: 'serology' },
'saccharomyces_cerevisiae_antibodies_asca_iga_serum': { name: 'Saccharomyces Cerevisiae Antibodies (ASCA), IgA - [Serum]', price: 1800, category: 'immunology' },
'saccharomyces_cerevisiae_antibodies_asca_igg_serum': { name: 'Saccharomyces Cerevisiae Antibodies (ASCA), IgG - [Serum]', price: 1800, category: 'immunology' },
'scl_70_antibody_serum': { name: 'Scl-70 antibody, serum - [Serum]', price: 1400, category: 'immunology' },
'selenium_blood': { name: 'Selenium - [Blood]', price: 3200, category: 'trace_elements' },
'serotonin_5_ht_5_hydroxy_tryptamine_serum': { name: 'Serotonin (5-HT) (5-Hydroxy Tryptamine) - [Serum]', price: 3600, category: 'neurotransmitters' },
'sex_hormone_binding_globulin_shbg_serum': { name: 'Sex Hormone Binding Globulin (SHBG) - [Serum]', price: 1900, category: 'hormones' },
'shbg_sex_hormone_binding_globulin_serum': { name: 'SHBG-Sex Hormone Binding Globulin - [Serum]', price: 2355, category: 'hormones' },
'sm_smith_antigen_serum': { name: 'Sm (Smith) antigen - [Serum]', price: 1400, category: 'immunology' },
'smooth_muscle_antibody_asma_serum': { name: 'Smooth Muscle Antibody (ASMA) - [Serum]', price: 1700, category: 'immunology' },
'smooth_muscle_antibody_asma_with_titre_serum': { name: 'Smooth Muscle Antibody (ASMA) with titre - [Serum]', price: 3100, category: 'immunology' },
'somatomedin_c_igf_1_serum': { name: 'Somatomedin C (IGF-1), serum - [Serum]', price: 1900, category: 'hormones' },
'specific_gravity_urine': { name: 'Specific gravity, urine - [Urine]', price: 50, category: 'urine_tests' },
'sperm_antibody_asab_total_semen': { name: 'Sperm Antibody (ASAB) (Total) - [Semen]', price: 1500, category: 'fertility_tests' },
'ssa_ro_soluble_substance_a_antibody_serum': { name: 'SSA-Ro (Soluble Substance A) Antibody - [Serum]', price: 1400, category: 'immunology' },
'ssb_la_soluble_substance_b_antibody_serum': { name: 'SSB-La (Soluble Substance B) Antibody - [Serum]', price: 1400, category: 'immunology' },
'stone_calculus_analysis_gall_bladder_stone': { name: 'Stone (Calculus) analysis - [Gall bladder stone]', price: 1000, category: 'clinical_pathology' },
'stone_calculus_analysis_renal_calculi': { name: 'Stone (Calculus) analysis - [Renal calculi]', price: 1000, category: 'clinical_pathology' },
'stone_calculus_analysis_automated_ftir_gall_bladder_stone': { name: 'Stone (Calculus) analysis by automated FTIR - [Gall bladder stone]', price: 1400, category: 'clinical_pathology' },
'stone_calculus_analysis_automated_ftir_renal_calculi': { name: 'Stone (Calculus) analysis by automated FTIR - [Renal calculi]', price: 1400, category: 'clinical_pathology' },
'sucrose_lysis_test_pnh_screening_test_blood': { name: 'Sucrose Lysis Test (PNH Screening test) - [Blood]', price: 700, category: 'hematology' },
'synovial_fluid_routine_examination_basic_synovial_fluid': { name: 'Synovial fluid, Routine examination (Basic) - [Synovial Fluid]', price: 700, category: 'body_fluid_analysis' },
'syphilis_treponema_antibodies_serum': { name: 'Syphilis (Treponema) Antibodies - [Serum]', price: 1100, category: 'serology' },
'tacrolimus_blood': { name: 'Tacrolimus - [Blood]', price: 3200, category: 'drug_monitoring' },
'tegretol_carbamazepine_serum': { name: 'Tegretol (Carbamazepine), serum - [Serum]', price: 800, category: 'drug_monitoring' },
'testosterone_free_serum': { name: 'Testosterone, Free - [Serum]', price: 1900, category: 'hormones' },
'thallium_serum': { name: 'Thallium - [Serum]', price: 3100, category: 'toxicology' },
'thallium_urine_24h': { name: 'Thallium - [Urine, 24h]', price: 3100, category: 'toxicology' },
'thc_cannabis_marijuana_quantitative_urine_spot': { name: 'THC (Cannabis) (Marijuana) (Quantitative) - [Urine, spot]', price: 770, category: 'drug_testing' },
'thc_cannabis_marijuana_urine_qualitative_urine_spot': { name: 'THC (Cannabis) (Marijuana), urine (Qualitative) - [Urine, spot]', price: 750, category: 'drug_testing' },
'theophylline_serum': { name: 'Theophylline - [Serum]', price: 700, category: 'drug_monitoring' },
'thrombin_time_tt_plasma': { name: 'Thrombin time (TT) - [Plasma]', price: 1000, category: 'coagulation' },
'thrombocyte_platelet_count_blood': { name: 'Thrombocyte (Platelet) count - [Blood]', price: 100, category: 'hematology' },
'thyrocalcitonin_calcitonin_serum': { name: 'Thyrocalcitonin (Calcitonin) - [Serum]', price: 2000, category: 'hormones' },
'thyroglobulin_antibody_ata_serum': { name: 'Thyroglobulin Antibody (ATA) - [Serum]', price: 1600, category: 'thyroid_tests' },
'thyroid_antibodies_atab_includes_tpo_and_ata_serum': { name: 'Thyroid Antibodies-AtAb (Includes TPO and ATA) - [Serum]', price: 2200, category: 'thyroid_tests' },
'tissue_transglutaminase_ttg_antibody_iga_serum': { name: 'Tissue Transglutaminase (tTG) Antibody-IgA - [Serum]', price: 1800, category: 'immunology' },
                                
'tnf_alpha_tumor_necrosis_factor_serum': { name: 'TNF-Alpha(Tumor necrosis factor) - [Serum]', price: 3800, category: 'immunology' },
'toxoplasma_avidity_test_serum': { name: 'Toxoplasma, Avidity test - [Serum]', price: 1400, category: 'microbiology' },
'transferrin_serum': { name: 'Transferrin - [Serum]', price: 900, category: 'blood_chemistry' },
'treponema_syphillis_antibodies_serum': { name: 'Treponema (Syphillis) Antibodies - [Serum]', price: 1100, category: 'microbiology' },
'tsh_receptor_antibody_serum': { name: 'TSH receptor antibody - [Serum]', price: 3600, category: 'immunology' },
'tumor_necrosis_factor_tnf_alpha_serum': { name: 'Tumor necrosis factor (TNF)-Alpha, Serum - [Serum]', price: 3800, category: 'immunology' },
'u1_snrnp_68_kda_serum': { name: 'U1-snRNP (68 KDa), serum - [Serum]', price: 1500, category: 'immunology' },
'valproic_acid_valparin_serum': { name: 'Valproic Acid (Valparin) - [Serum]', price: 800, category: 'drug_monitoring' },
'varicella_herpes_zoster_igg_antibodies_serum': { name: 'Varicella (Herpes) Zoster-IgG antibodies - [Serum]', price: 1820, category: 'microbiology' },
'varicella_herpes_zoster_igm_antibodies_serum': { name: 'Varicella (Herpes) Zoster-IgM antibodies - [Serum]', price: 3600, category: 'microbiology' },
'vitamin_a_retinol_serum': { name: 'Vitamin A (Retinol) - [Serum]', price: 4000, category: 'vitamins' },
'vitamin_b1_thiamine_blood': { name: 'Vitamin B1 (Thiamine) - [Blood]', price: 3500, category: 'vitamins' },
'vitamin_b2_riboflavin_plasma': { name: 'Vitamin B2 (Riboflavin) - [Plasma]', price: 2800, category: 'vitamins' },
'vitamin_b6_pyridoxine_plasma': { name: 'Vitamin B6 (Pyridoxine) - [Plasma]', price: 3500, category: 'vitamins' },
'vitamin_c_ascorbic_acid_plasma': { name: 'Vitamin C (Ascorbic acid) - [Plasma]', price: 3000, category: 'vitamins' },
'vitamin_d_1_25_dihydroxy_cholecalciferol_serum': { name: 'Vitamin D (1,25 Dihydroxy Cholecalciferol) - [Serum]', price: 3600, category: 'vitamins' },
'vitamin_e_tocopherol_serum': { name: 'Vitamin E (Tocopherol) - [Serum]', price: 4000, category: 'vitamins' },
'water_analysis_chemical_water': { name: 'Water analysis, Chemical - [Water]', price: 1700, category: 'environmental' },
'weil_felix_test_serum': { name: 'Weil Felix Test - [Serum]', price: 660, category: 'microbiology' },
'wuchereria_bancrofti_filaria_antigen_blood': { name: 'Wuchereria Bancrofti (Filaria) Antigen - [Blood]', price: 4400, category: 'microbiology' },
'zinc_serum': { name: 'Zinc - [Serum]', price: 2200, category: 'blood_chemistry' },
'pcd_lower_extrimity_av_study_both_limb': { name: 'PCD Lower Extrimity A/V Study (Both Limb)', price: 5000, category: 'radiology' },
'pcd_lower_extrimity_av_study_left_limb': { name: 'PCD Lower Extrimity A/V Study (Left Limb)', price: 5000, category: 'radiology' },
'pcd_lower_extrimity_art_study_both_limbs': { name: 'PCD Lower Extrimity Art Study (Both Limbs)', price: 5000, category: 'radiology' },
'pcd_lower_extrimity_art_study_left_limb': { name: 'PCD Lower Extrimity Art Study (Left Limb)', price: 2500, category: 'radiology' },
'pcd_lower_extrimity_art_study_right_limb': { name: 'PCD Lower Extrimity Art Study (Right Limb)', price: 2500, category: 'radiology' },
'pcd_lower_extrimity_venous_study_left_limb': { name: 'PCD Lower Extrimity Venous Study ( Left Limb )', price: 2500, category: 'radiology' },
'pcd_lower_extrimity_venous_study_right_limb': { name: 'PCD Lower Extrimity Venous Study ( Right Limb )', price: 2500, category: 'radiology' },
'pcd_lower_extrimity_venous_study_both_limbs': { name: 'PCD Lower Extrimity Venous Study (Both Limbs)', price: 2500, category: 'radiology' },
'pcd_neck_vessels': { name: 'PCD Neck Vessels', price: 2500, category: 'radiology' },
'pcd_pelvis': { name: 'PCD Pelvis', price: 2500, category: 'radiology' },
'pcd_penile_doppler': { name: 'PCD Penile Doppler', price: 2500, category: 'radiology' },
'pcd_pregnancy': { name: 'PCD Pregnancy', price: 2500, category: 'radiology' },
'pcd_renal': { name: 'PCD RENAL', price: 2500, category: 'radiology' },
'pcd_renal_doppler': { name: 'PCD Renal Doppler', price: 2500, category: 'radiology' },
'pcd_scrotal_doppler': { name: 'PCD Scrotal Doppler', price: 2500, category: 'radiology' },
'pcd_thyroid': { name: 'PCD Thyroid', price: 2500, category: 'radiology' },
'pcd_transplant_kidney': { name: 'PCD Transplant Kidney', price: 2500, category: 'radiology' },
'pcd_transvaginal': { name: 'PCD Transvaginal', price: 2500, category: 'radiology' },
'pcd_upper_extremity_art_study_left_limb': { name: 'PCD Upper Extremity Art Study (Left Limb)', price: 2500, category: 'radiology' },
'pcd_upper_extremity_art_study_right_limb': { name: 'PCD Upper Extremity Art Study (Right Limb)', price: 2500, category: 'radiology' },
'pcd_upper_extremity_art_study_both_limbs': { name: 'PCD Upper Extremity Art Study(Both Limbs)', price: 5000, category: 'radiology' },
'pcd_upper_extremity_venous_study_left_limb': { name: 'PCD Upper Extremity Venous Study (Left Limb)', price: 2500, category: 'radiology' },
'pcd_upper_extremity_venous_study_right_limb': { name: 'PCD Upper Extremity Venous Study (Right Limb)', price: 2500, category: 'radiology' },
'pcd_upper_extremity_venous_study_both_limbs': { name: 'PCD Upper Extremity Venous Study(Both Limbs)', price: 2500, category: 'radiology' },
'pcd_varicocele': { name: 'PCD Varicocele', price: 2500, category: 'radiology' },
'pulmonary_function_test': { name: 'Pulmonary Function Test', price: 1500, category: 'pulmonology' },
'health_check_camp_lic': { name: 'Health Check Camp (LIC)', price: 100, category: 'screening' },
'sono_abdomen_female': { name: 'Sono Abdomen (Female)', price: 1500, category: 'radiology' },
'sono_abdomen_male': { name: 'Sono Abdomen (Male)', price: 1500, category: 'radiology' },
'sono_abdomen_and_pelvis_female': { name: 'Sono Abdomen and Pelvis (Female)', price: 1500, category: 'radiology' },
'sono_abdomen_and_pelvis_male': { name: 'Sono Abdomen and Pelvis (Male)', price: 1500, category: 'radiology' },
'sono_anomaly_scan': { name: 'Sono Anomaly Scan', price: 2000, category: 'radiology' },
'sono_b_scan_both_eyes': { name: 'Sono B Scan-Both Eyes', price: 1200, category: 'radiology' },
'sono_breast': { name: 'Sono Breast', price: 1500, category: 'radiology' },
'sono_chest': { name: 'Sono Chest', price: 1500, category: 'radiology' },
'sono_follicular_study': { name: 'Sono Follicular Study', price: 500, category: 'radiology' },
'sono_kub_female': { name: 'Sono K.U.B (Female)', price: 1500, category: 'radiology' },
'sono_kub_male': { name: 'Sono K.U.B (Male)', price: 1500, category: 'radiology' },
'sono_kub_prostate': { name: 'Sono KUB & Prostate', price: 1500, category: 'radiology' },
'sono_local_part': { name: 'Sono Local Part', price: 1500, category: 'radiology' },
'sono_neck': { name: 'Sono Neck', price: 1200, category: 'radiology' },
'sono_obstetrics_preg_1_to_3_months': { name: 'Sono Obstetrics/Preg(1 to 3 Months)', price: 1500, category: 'radiology' },
'sono_obstetrics_preg_4_to_9_months': { name: 'Sono Obstetrics/Preg(4 to 9 Months)', price: 1500, category: 'radiology' },
'sono_pelvis_female': { name: 'Sono Pelvis (Female)', price: 1500, category: 'radiology' },
'sono_pelvis_male': { name: 'Sono Pelvis (Male)', price: 1500, category: 'radiology' },
'sono_prostrate': { name: 'Sono Prostrate', price: 1500, category: 'radiology' },
'sono_scrotum': { name: 'Sono Scrotum', price: 1500, category: 'radiology' },
'sono_skull': { name: 'Sono Skull', price: 1500, category: 'radiology' },
'sono_thyroid': { name: 'Sono Thyroid', price: 1500, category: 'radiology' },
'sono_transrectal': { name: 'Sono Transrectal', price: 1500, category: 'radiology' },
'sono_transvaginal': { name: 'Sono Transvaginal', price: 1500, category: 'radiology' },
'stress_test': { name: 'Stress Test', price: 1800, category: 'cardiology' },
'hsg_procedure': { name: 'HSG (Procedure)', price: 2500, category: 'radiology' },
'xray_both_ankle_joint_ap_lat': { name: 'Xray Both Ankle Joint AP/LAT', price: 1600, category: 'radiology' },
'xray_both_clavicle': { name: 'Xray Both Clavicle', price: 800, category: 'radiology' },
'xray_both_elbow_joint_ap_lat': { name: 'Xray Both Elbow Joint AP/LAT', price: 1600, category: 'radiology' },
'xray_both_foot_ap_lat': { name: 'XRAY BOTH FOOT AP/LAT', price: 1600, category: 'radiology' },
'xray_both_foot_ap_lat_obl': { name: 'XRAY BOTH FOOT AP/LAT/OBL', price: 2400, category: 'radiology' },
'xray_both_foot_ap_obl': { name: 'Xray Both Foot AP/OBL', price: 1600, category: 'radiology' },
'xray_both_forearm_radius_ulna_ap_lat': { name: 'Xray Both Forearm (Radius / Ulna) AP/LAT', price: 1600, category: 'radiology' },
'xray_both_hand_ap': { name: 'Xray Both Hand AP', price: 800, category: 'radiology' },
'xray_both_hand_ap_obl': { name: 'Xray Both Hand AP/OBL', price: 1600, category: 'radiology' },
'xray_both_heel_lat_axial': { name: 'Xray Both Heel LAT/Axial', price: 1600, category: 'radiology' },
'xray_both_heels_lat': { name: 'Xray Both Heels Lat', price: 800, category: 'radiology' },
'xray_both_hip_joints_frog_view': { name: 'Xray Both Hip Joints Frog View', price: 400, category: 'radiology' },
'xray_both_humerus_ap_lat': { name: 'Xray Both Humerus AP/LAT', price: 1600, category: 'radiology' },
'xray_both_knee_ap_lat_standing': { name: 'Xray Both Knee AP/LAT Standing', price: 1600, category: 'radiology' },
'xray_both_knee_ap_standing': { name: 'Xray Both Knee AP (STANDING)', price: 800, category: 'radiology' },
'xray_both_knee_axial_view': { name: 'Xray Both Knee Axial View', price: 800, category: 'radiology' },
'xray_both_patella_skyline_view': { name: 'Xray Both Patella Skyline View', price: 800, category: 'radiology' },
'xray_both_sacro_iliac_joint_obl': { name: 'Xray Both Sacro-iliac Joint OBL', price: 800, category: 'radiology' },
'xray_both_shoulder_joint_ap_lat': { name: 'Xray Both Shoulder Joint AP/LAT', price: 1600, category: 'radiology' },
'xray_both_tibia_fibula_pa_lat': { name: 'Xray Both Tibia & Fibula PA/LAT', price: 1600, category: 'radiology' },
'xray_both_toe_ap_lat': { name: 'Xray Both Toe AP/LAT', price: 1600, category: 'radiology' },
'xray_both_wrist_joint_ap_lat': { name: 'Xray Both Wrist Joint AP/LAT', price: 1600, category: 'radiology' },
'xray_cervical_spine_ap': { name: 'Xray Cervical Spine - AP', price: 400, category: 'radiology' },
'xray_cervical_spine_both_obligues': { name: 'Xray Cervical Spine - Both Obligues', price: 800, category: 'radiology' },
'xray_cervical_spine_ap_lat': { name: 'Xray Cervical Spine AP/LAT', price: 800, category: 'radiology' },
'xray_cervical_spine_ap_lat_both_obl': { name: 'Xray Cervical Spine AP/LAT/Both OBL', price: 1600, category: 'radiology' },
'xray_cervical_spine_ap_lat_flexion_extension': { name: 'Xray Cervical Spine AP/LAT/Flexion / Extension', price: 1600, category: 'radiology' },
'xray_cervical_spine_lat': { name: 'Xray Cervical Spine Lat', price: 400, category: 'radiology' },
'xray_cervical_spine_open_mouth_view': { name: 'Xray Cervical Spine Open Mouth View', price: 400, category: 'radiology' },
'xray_cervico_dorsal_ap_lat': { name: 'XRAY CERVICO-DORSAL AP/LAT', price: 800, category: 'radiology' },
'xray_chest_ap_supine_view': { name: 'Xray Chest AP Supine View', price: 400, category: 'radiology' },
'xray_chest_ap_obl': { name: 'Xray Chest AP/OBL', price: 400, category: 'radiology' },
'xray_chest_lateral_sternum_bone': { name: 'Xray Chest Lateral (Sternum Bone)', price: 400, category: 'radiology' },
'xray_chest_left_lat_view': { name: 'Xray Chest Left LAT View', price: 400, category: 'radiology' },
'xray_chest_obl': { name: 'Xray Chest Obl', price: 400, category: 'radiology' },
'xray_chest_oblique': { name: 'Xray Chest Oblique', price: 400, category: 'radiology' },
'xray_chest_pa_view': { name: 'Xray Chest PA View', price: 400, category: 'radiology' },
'xray_chest_right_lat_view': { name: 'Xray Chest Right LAT View', price: 400, category: 'radiology' },
'xray_finger_ap_lat': { name: 'Xray Finger AP/LAT', price: 800, category: 'radiology' },
'xray_hand_with_wrist_ap': { name: 'Xray Hand with Wrist AP', price: 400, category: 'radiology' },
'xray_heel': { name: 'Xray Heel', price: 400, category: 'radiology' },
'xray_left_ankle_joint_ap_lat': { name: 'Xray Left Ankle Joint AP/LAT', price: 800, category: 'radiology' },
'xray_left_clavicle': { name: 'Xray Left Clavicle', price: 400, category: 'radiology' },
'xray_left_elbow_joint_ap_lat': { name: 'Xray Left Elbow Joint AP/LAT', price: 800, category: 'radiology' },
'xray_left_femur_ap_lat_view': { name: 'Xray Left Femur AP/LAT View', price: 800, category: 'radiology' },
'xray_left_foot_ap': { name: 'XRAY LEFT FOOT AP', price: 400, category: 'radiology' },
'xray_left_foot_ap_lat': { name: 'XRAY LEFT FOOT AP/LAT', price: 800, category: 'radiology' },
'xray_left_foot_ap_obl': { name: 'Xray Left Foot AP/OBL', price: 800, category: 'radiology' },
'xray_left_forearm_ap_lat': { name: 'Xray Left Forearm AP/LAT', price: 800, category: 'radiology' },
'xray_left_hand_ap_lat': { name: 'XRAY LEFT HAND AP/LAT', price: 800, category: 'radiology' },
'xray_left_hand_ap_obl': { name: 'Xray Left Hand AP/OBL', price: 800, category: 'radiology' },
'xray_left_heel_lat_axial': { name: 'Xray Left Heel LAT/Axial', price: 800, category: 'radiology' },
'xray_left_hip_ap_lat': { name: 'Xray Left Hip - AP / LAT', price: 800, category: 'radiology' },
'xray_left_hip_joint_lat': { name: 'Xray Left Hip Joint LAT', price: 400, category: 'radiology' },
'xray_left_humerus_ap_lat': { name: 'Xray Left Humerus AP/LAT', price: 800, category: 'radiology' },
'xray_left_knee_ap_lat': { name: 'Xray Left Knee AP/LAT', price: 800, category: 'radiology' },
'xray_left_knee_ap_lat_skyline_view': { name: 'Xray Left Knee AP/LAT/Skyline View', price: 1200, category: 'radiology' },
'xray_left_sacro_iliac_joint_obl': { name: 'Xray Left Sacro-iliac Joint OBL', price: 400, category: 'radiology' },
'xray_left_scapula_ap_lat_view': { name: 'Xray Left Scapula AP/LAT View', price: 800, category: 'radiology' },
'xray_left_shoulder_joint_ap': { name: 'Xray Left Shoulder Joint AP', price: 400, category: 'radiology' },
'xray_left_shoulder_joint_ap_axial': { name: 'Xray Left Shoulder Joint AP/Axial', price: 800, category: 'radiology' },
'xray_left_shoulder_joint_ap_lat': { name: 'Xray Left Shoulder Joint AP/LAT', price: 800, category: 'radiology' },
'xray_left_thumb_ap_lateral': { name: 'Xray Left Thumb AP/Lateral', price: 800, category: 'radiology' },
'xray_left_tibia_fibula_pa_lat': { name: 'Xray Left Tibia & Fibula PA/LAT', price: 800, category: 'radiology' },
'xray_left_toe_ap_lat': { name: 'Xray Left Toe AP/LAT', price: 800, category: 'radiology' },
'xray_left_wrist_joint_ap_lat': { name: 'Xray Left Wrist Joint AP/LAT', price: 800, category: 'radiology' },
'xray_left_wrist_joint_ap_obl': { name: 'Xray Left Wrist Joint AP/OBL', price: 800, category: 'radiology' },
'xray_left_wrist_scaphoid': { name: 'Xray Left Wrist Scaphoid', price: 400, category: 'radiology' },
'xray_nasal_bone': { name: 'Xray Nasal Bone', price: 800, category: 'radiology' },
'xray_neck_lat_adenoid': { name: 'Xray Neck LAT - Adenoid', price: 400, category: 'radiology' },
'xray_pelvis_ap_lat': { name: 'XRAY PELVIS AP/LAT', price: 400, category: 'radiology' },
'xray_pelvis_left_obl': { name: 'XRAY PELVIS LEFT OBL', price: 400, category: 'radiology' },
'xray_pelvis_right_obl': { name: 'XRAY PELVIS RIGHT OBL', price: 400, category: 'radiology' },
'xray_pelvis_with_both_hip_joint_ap_view': { name: 'Xray Pelvis with Both Hip joint AP View', price: 400, category: 'radiology' },
'xray_pns': { name: 'XRay PNS', price: 400, category: 'radiology' },
'xray_pns_lat': { name: 'Xray PNS - LAT', price: 400, category: 'radiology' },
'xray_pns_waters_and_caldwell': { name: 'Xray PNS Waters and Caldwell', price: 800, category: 'radiology' },
'xray_pns_waters_view': { name: 'Xray PNS Waters View', price: 400, category: 'radiology' },
'xray_right_heel_lat_axial': { name: 'Xray Right Heel LAT/Axial', price: 800, category: 'radiology' },
'xray_right_ankle_joint_ap_lat': { name: 'Xray Right Ankle Joint AP/LAT', price: 800, category: 'radiology' },
'xray_right_clavicle': { name: 'Xray Right Clavicle', price: 400, category: 'radiology' },
'xray_right_elbow_joint_ap_lat': { name: 'Xray Right Elbow Joint AP/LAT', price: 800, category: 'radiology' },
'xray_right_femur_ap_lat_view': { name: 'Xray Right Femur AP/LAT View', price: 800, category: 'radiology' },
'xray_right_foot_ap': { name: 'XRAY RIGHT FOOT AP', price: 400, category: 'radiology' },
'xray_right_foot_ap_lat': { name: 'XRAY RIGHT FOOT AP/LAT', price: 800, category: 'radiology' },
'xray_right_foot_ap_obl': { name: 'Xray Right Foot AP/OBL', price: 800, category: 'radiology' },
'xray_right_forearm_ap_lat': { name: 'Xray Right Forearm AP/LAT', price: 800, category: 'radiology' },
'xray_right_hand_ap_lat': { name: 'Xray right hand -AP/LAT', price: 800, category: 'radiology' },
'xray_right_hand_ap_obl': { name: 'Xray Right Hand AP/OBL', price: 800, category: 'radiology' },
'xray_right_hip_ap_lat': { name: 'Xray Right Hip - AP / LAT', price: 800, category: 'radiology' },
'xray_right_hip_ap': { name: 'Xray Right Hip AP', price: 400, category: 'radiology' },
'xray_right_hip_joint_lat': { name: 'Xray Right Hip Joint LAT', price: 400, category: 'radiology' },
'xray_right_humerus_ap_lat_1': { name: 'Xray Right Humerus - AP/LAT', price: 800, category: 'radiology' },
'xray_right_humerus_ap_lat_2': { name: 'Xray Right Humerus AP/LAT', price: 800, category: 'radiology' },
'xray_right_knee_ap_lat': { name: 'Xray Right Knee AP/LAT', price: 800, category: 'radiology' },
'xray_right_sacro_iliac_joint_obl': { name: 'Xray Right Sacro-iliac Joint OBL', price: 400, category: 'radiology' },
'xray_right_scapula_ap_lat_view': { name: 'Xray Right Scapula AP/LAT View', price: 800, category: 'radiology' },
'xray_right_shoulder_joint_ap': { name: 'Xray Right Shoulder Joint - AP', price: 400, category: 'radiology' },
'xray_right_shoulder_joint_ap_axial': { name: 'Xray Right Shoulder Joint AP/Axial', price: 800, category: 'radiology' },
'xray_right_shoulder_joint_ap_lat': { name: 'Xray Right Shoulder Joint AP/LAT', price: 800, category: 'radiology' },
'xray_right_shoulder_joint_lat': { name: 'Xray Right Shoulder Joint LAT', price: 400, category: 'radiology' },
'xray_right_thumb_ap_lateral': { name: 'Xray Right Thumb AP/Lateral', price: 800, category: 'radiology' },
'xray_right_thumb_ap_oblique': { name: 'Xray Right Thumb AP/Oblique', price: 800, category: 'radiology' },
'xray_right_tibia_fibula_ap_lat': { name: 'Xray Right Tibia & Fibula AP/LAT', price: 800, category: 'radiology' },
'xray_right_tibia_fibula_lat': { name: 'Xray Right Tibia & Fibula LAT', price: 400, category: 'radiology' },
'xray_right_toe_ap_lat': { name: 'Xray Right Toe AP/LAT', price: 800, category: 'radiology' },
'xray_right_wrist_joint_ap_lat': { name: 'Xray Right Wrist Joint AP/LAT', price: 800, category: 'radiology' },
                              'xray_right_wrist_scaphoid': { name: 'Xray Right Wrist Scaphoid', price: 400, category: 'xray' },
'xray_sacro_iliac_joint_prone': { name: 'Xray Sacro-iliac Joint Prone', price: 400, category: 'xray' },
'xray_shoulder_joint_external_rotation_view': { name: 'Xray Shoulder Joint External Rotation View', price: 400, category: 'xray' },
'xray_shoulder_joint_internal_rotation_view': { name: 'Xray Shoulder Joint Internal Rotation View', price: 400, category: 'xray' },
'xray_skull_ap_lat': { name: 'Xray Skull AP/LAT', price: 800, category: 'xray' },
'xray_skull_base': { name: 'Xray Skull Base', price: 400, category: 'xray' },
'xray_skull_both_mandible_obl': { name: 'Xray Skull Both Mandible OBL', price: 8000, category: 'xray' },
'xray_skull_both_mastoids': { name: 'Xray Skull Both Mastoids', price: 800, category: 'xray' },
'xray_skull_both_tm_joints': { name: 'Xray Skull Both TM Joints', price: 800, category: 'xray' },
'xray_skull_lat_pitutary_fossa': { name: 'Xray Skull LAT - Pitutary Fossa', price: 400, category: 'xray' },
'xray_skull_left_mandible_obl': { name: 'Xray Skull Left Mandible OBL', price: 400, category: 'xray' },
'xray_skull_left_mastoid': { name: 'Xray Skull Left Mastoid', price: 400, category: 'xray' },
'xray_skull_leftt_tm_joint': { name: 'Xray Skull Leftt TM Joint', price: 400, category: 'xray' },
'xray_skull_mandible_pa_view': { name: 'Xray Skull Mandible PA View', price: 400, category: 'xray' },
'xray_skull_orbit': { name: 'Xray Skull Orbit', price: 400, category: 'xray' },
'xray_skull_pa_view': { name: 'Xray Skull PA View', price: 400, category: 'xray' },
'xray_skull_right_mandible_obl': { name: 'Xray Skull Right Mandible OBL', price: 400, category: 'xray' },
'xray_skull_right_mastoid': { name: 'Xray Skull Right Mastoid', price: 400, category: 'xray' },
'xray_skull_right_tm_joint': { name: 'Xray Skull Right TM Joint', price: 400, category: 'xray' },
'xray_skull_towns_view': { name: 'Xray Skull Towns View', price: 400, category: 'xray' },
'xray_soft_tissue_ap_lat': { name: 'Xray Soft Tissue - AP/LAT', price: 800, category: 'xray' },
'xray_sternoclavicular_joint': { name: 'Xray Sternoclavicular Joint', price: 400, category: 'xray' },
'xray_thoracic_inlet_ap': { name: 'Xray Thoracic Inlet - AP', price: 400, category: 'xray' },
'xray_thoracic_inlet_lat': { name: 'Xray Thoracic Inlet -Lat', price: 400, category: 'xray' },
};


// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    populateTestDropdown();
    setMinDate();
    
    // Initialize Select2 after DOM is ready
    setTimeout(initializeSelect2, 100);
});

// Initialize form components
function initializeForm() {
    // Hide conditional fields initially
    document.getElementById('departmentField').style.display = 'none';
    document.getElementById('prescriptionField').style.display = 'none';
    
    // Set up file upload area
    setupFileUpload();
    
    // Set up test selection
    setupTestSelection();
}

// Initialize Select2 with search functionality
function initializeSelect2() {
    // Check if jQuery and Select2 are available
    if (typeof $ !== 'undefined' && $.fn.select2) {
        $('#department').select2({
            placeholder: "🔍 Search and select test(s)...",
            width: '100%',
            allowClear: false,
            closeOnSelect: false,
            tags: false,
            multiple: true,
            templateResult: formatOption,
            templateSelection: function () { return ''; }, // Hide selected items from search bar
            escapeMarkup: function (markup) {
                return markup;
            }
        });

        // Custom formatting for options in dropdown
        function formatOption(option) {
            if (!option.id) {
                return option.text;
            }

            const price = $(option.element).attr('data-price');
            if (price) {
                return `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
                        <span>${option.text}</span>
                        <span style="color: #27ae60; font-weight: bold; font-size: 14px;">₹${parseInt(price).toLocaleString()}</span>
                    </div>
                `;
            }
            return option.text;
        }

        // Update the search container to only show placeholder
        $('#department').on('select2:select select2:unselect', function (e) {
            setTimeout(function () {
                // Clear the search input display
                $('.select2-selection__rendered').empty();
                $('.select2-selection__rendered').append('<span class="select2-selection__placeholder" style="color: #999;">🔍 Search and select test(s)...</span>');
            }, 10);
        });

        // Enhanced event listener for department selection changes
        $('#department').on('change', function () {
            handleDepartmentChange();
            
            // Add a subtle animation to the selected services
            const selectedServices = document.getElementById('selectedServices');
            if (selectedServices && selectedServices.style.display === 'block') {
                selectedServices.style.opacity = '0';
                selectedServices.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    selectedServices.style.transition = 'all 0.3s ease';
                    selectedServices.style.opacity = '1';
                    selectedServices.style.transform = 'translateY(0)';
                }, 100);
            }
        });
    } else {
        // Fallback: Use regular multiple select if Select2 is not available
        console.warn('Select2 not available, using standard multiple select');
        const departmentSelect = document.getElementById('department');
        if (departmentSelect) {
            departmentSelect.addEventListener('change', handleDepartmentChange);
        }
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Form submission
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
    
    // Visit type change
    document.querySelectorAll('input[name="visitType"]').forEach(radio => {
        radio.addEventListener('change', handleVisitTypeChange);
    });
    
    // Booking option change
    document.querySelectorAll('input[name="bookingOption"]').forEach(radio => {
        radio.addEventListener('change', handleBookingOptionChange);
    });
}

// Handle option selection (department vs prescription)
function selectOption(option) {
    currentBookingOption = option;
    
    // Update radio button
    document.getElementById('option' + option.charAt(0).toUpperCase() + option.slice(1)).checked = true;
    
    // Update visual selection
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    event.target.closest('.option-card').classList.add('selected');
    
    // Handle the option change
    handleBookingOptionChange();
}

// Handle booking option change
function handleBookingOptionChange() {
    const selectedOption = document.querySelector('input[name="bookingOption"]:checked');
    
    if (!selectedOption) return;
    
    currentBookingOption = selectedOption.value;
    
    // Hide all conditional fields first
    document.getElementById('departmentField').style.display = 'none';
    document.getElementById('prescriptionField').style.display = 'none';
    
    // Show the selected option field
    if (currentBookingOption === 'department') {
        document.getElementById('departmentField').style.display = 'block';
        // Make department field required
        const deptField = document.getElementById('department');
        if (deptField) {
            deptField.required = true;
        }
        const prescField = document.getElementById('prescription');
        if (prescField) {
            prescField.required = false;
            prescField.value = '';
        }
        // Reset file upload
        removeFile();
    } else if (currentBookingOption === 'prescription') {
        document.getElementById('prescriptionField').style.display = 'block';
        // Make prescription field required
        const prescField = document.getElementById('prescription');
        if (prescField) {
            prescField.required = true;
        }
        const deptField = document.getElementById('department');
        if (deptField) {
            deptField.required = false;
            // Reset department selection
            if (typeof $ !== 'undefined' && $.fn.select2) {
                $('#department').val(null).trigger('change');
            } else {
                deptField.value = '';
            }
        }
        selectedTests = [];
        updateSelectedTestsDisplay();
    }
    
    // Update total cost
    updateTotalCost();
}

// Handle visit type change
function handleVisitTypeChange() {
    const visitType = document.querySelector('input[name="visitType"]:checked');
    if (visitType) {
        console.log('Visit type changed to:', visitType.value);
        // Recalculate costs when visit type changes
        updateTotalCost();
        
        // Show a brief highlight on total cost when visit type changes
        const totalCost = document.getElementById('totalCost');
        if (totalCost && totalCost.style.display === 'block') {
            totalCost.style.transform = 'scale(1.05)';
            setTimeout(() => {
                totalCost.style.transition = 'transform 0.3s ease';
                totalCost.style.transform = 'scale(1)';
            }, 200);
        }
    }
}

// Populate the test dropdown
function populateTestDropdown() {
    const departmentSelect = document.getElementById('department');
    if (!departmentSelect) return;
    
    // Clear existing options
    departmentSelect.innerHTML = '<option value="">Select Test(s)</option>';
    
    // Group tests by category
    const groupedTests = {};
    Object.keys(availableTests).forEach(testId => {
        const test = availableTests[testId];
        if (!groupedTests[test.category]) {
            groupedTests[test.category] = [];
        }
        groupedTests[test.category].push({ id: testId, ...test });
    });
    
    // Add options grouped by category
    Object.keys(groupedTests).forEach(category => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = category.charAt(0).toUpperCase() + category.slice(1);
        
        groupedTests[category].forEach(test => {
            const option = document.createElement('option');
            option.value = test.id;
            option.setAttribute('data-price', test.price);
            option.textContent = test.name;
            optgroup.appendChild(option);
        });
        
        departmentSelect.appendChild(optgroup);
    });
}

// Handle department/test selection change
function handleDepartmentChange() {
    const departmentSelect = document.getElementById('department');
    if (!departmentSelect) return;
    
    selectedTests = Array.from(departmentSelect.selectedOptions).map(option => option.value);
    
    updateSelectedTestsDisplay();
    updateTotalCost();
}

// Update selected tests display
function updateSelectedTestsDisplay() {
    const selectedServicesDiv = document.getElementById('selectedServices');
    const servicesListDiv = document.getElementById('servicesList');
    
    if (!selectedServicesDiv || !servicesListDiv) return;
    
    if (selectedTests.length === 0) {
        selectedServicesDiv.style.display = 'none';
        return;
    }
    
    selectedServicesDiv.style.display = 'block';
    servicesListDiv.innerHTML = '';
    
    selectedTests.forEach(testId => {
        const test = availableTests[testId];
        if (test) {
            const testDiv = document.createElement('div');
            testDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; margin: 8px 0; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 8px; border-left: 4px solid #667eea; box-shadow: 0 2px 5px rgba(0,0,0,0.1);';
            testDiv.innerHTML = `
                <span style="color: #2c3e50; font-weight: 500; font-size: 14px;">${test.name}</span>
                <span style="color: #27ae60; font-weight: bold; font-size: 16px;">₹${test.price.toLocaleString()}</span>
            `;
            servicesListDiv.appendChild(testDiv);
        }
    });
}

// Update total cost
function updateTotalCost() {
    const totalCostDiv = document.getElementById('totalCost');
    if (!totalCostDiv) return;
    
    let total = 0;
    let homeVisitCharge = 0;
    
    if (currentBookingOption === 'department' && selectedTests.length > 0) {
        total = selectedTests.reduce((sum, testId) => {
            const test = availableTests[testId];
            return sum + (test ? test.price : 0);
        }, 0);
        
        // Check if it's a home visit to add extra charges
        const visitType = document.querySelector('input[name="visitType"]:checked');
        if (visitType && visitType.value === 'home' && selectedTests.length > 0) {
            homeVisitCharge = 200;
            total += homeVisitCharge;
        }
        
        // Enhanced total cost display
        totalCostDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
                <span style="font-size: 1.2em; font-weight: 600; color: white;">Grand Total:</span>
                <span style="font-size: 1.4em; font-weight: bold; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">₹${total.toLocaleString()}</span>
            </div>
            <div style="font-size: 12px; color: rgba(255,255,255,0.9); margin-top: 5px; text-align: center;">
                ${selectedTests.length} test${selectedTests.length > 1 ? 's' : ''} selected
                ${homeVisitCharge > 0 ? ' • Home visit included' : ''}
            </div>
        `;
        totalCostDiv.style.display = 'block';
    } else {
        totalCostDiv.style.display = 'none';
    }
}

// Set up file upload functionality
function setupFileUpload() {
    const fileInput = document.getElementById('prescription');
    const uploadArea = document.querySelector('.file-upload-area');
    
    if (!fileInput || !uploadArea) return;
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File selection
    fileInput.addEventListener('change', function(e) {
        handleFileSelect(e.target.files[0]);
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect(files[0]);
        }
    });
}

// Handle file selection
function handleFileSelect(file) {
    if (!file) return;
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        alert('Please upload only JPG, PNG, or PDF files');
        return;
    }

    // Show uploaded file
    showUploadedFile(file.name);
}

// Show uploaded file
function showUploadedFile(fileName) {
    const uploadArea = document.querySelector('.file-upload-area');
    if (uploadArea) {
        uploadArea.innerHTML = `
            <div class="uploaded-file">
                <span class="file-name">📄 ${fileName}</span>
                <button type="button" class="remove-file" onclick="removeFile()">×</button>
            </div>
        `;
    }
}

// Remove file
function removeFile() {
    const fileInput = document.getElementById('prescription');
    const uploadArea = document.querySelector('.file-upload-area');
    
    if (fileInput) {
        fileInput.value = '';
    }
    
    if (uploadArea) {
        uploadArea.innerHTML = `
            <div class="upload-icon">📄</div>
            <p>Click to upload or drag and drop</p>
            <p class="file-types">JPG, PNG, PDF (Max 5MB)</p>
        `;
    }
}

// Set up test selection
function setupTestSelection() {
    const departmentSelect = document.getElementById('department');
    if (departmentSelect) {
        // Make it multiple selection
        departmentSelect.multiple = true;
    }
}

// Set minimum date to today
function setMinDate() {
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        dateInput.min = todayString;
    }
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    const formData = new FormData(e.target);
    
    // Add selected tests to form data
    if (currentBookingOption === 'department' && selectedTests.length > 0) {
        // Remove existing department entries
        formData.delete('department');
        // Add each selected test
        selectedTests.forEach(testId => {
            formData.append('department', testId);
        });
    }
    
    // Show loading state
    const submitButton = document.querySelector('.btn-primary');
    if (submitButton) {
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Booking...';
        submitButton.disabled = true;
        
        // Submit form
        fetch('/post', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Form Submission Successful!") {
                alert('Appointment booked successfully!');
                // Reset form
                document.getElementById('bookingForm').reset();
                resetForm();
            } else {
                alert('Error: ' + (data.message || 'Unknown error occurred'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting form. Please try again.');
        })
        .finally(() => {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    }
}

// Validate form
function validateForm() {
    const errors = [];
    
    // Check required fields
    const requiredFields = ['patientName', 'age', 'gender', 'address', 'pincode', 'mobile', 'preferredDate', 'preferredTime'];
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field || !field.value.trim()) {
            errors.push(`${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
        }
    });
    
    // Check booking option
    if (!currentBookingOption) {
        errors.push('Please select either test selection or prescription upload');
    }
    
    // Check department selection
    if (currentBookingOption === 'department' && selectedTests.length === 0) {
        errors.push('Please select at least one test');
    }
    
    // Check prescription upload
    if (currentBookingOption === 'prescription') {
        const prescriptionFile = document.getElementById('prescription').files[0];
        if (!prescriptionFile) {
            errors.push('Please upload a prescription file');
        }
    }
    
    // Check visit type
    const visitType = document.querySelector('input[name="visitType"]:checked');
    if (!visitType) {
        errors.push('Please select visit type');
    }
    
    if (errors.length > 0) {
        alert('Please fix the following errors:\n' + errors.join('\n'));
        return false;
    }
    
    return true;
}

// Reset form to initial state
function resetForm() {
    currentBookingOption = null;
    selectedTests = [];
    
    // Hide conditional fields
    document.getElementById('departmentField').style.display = 'none';
    document.getElementById('prescriptionField').style.display = 'none';
    
    // Reset selected tests display
    const selectedServices = document.getElementById('selectedServices');
    if (selectedServices) {
        selectedServices.style.display = 'none';
    }
    
    const servicesList = document.getElementById('servicesList');
    if (servicesList) {
        servicesList.innerHTML = '';
    }
    
    // Reset file upload
    removeFile();
    
    // Reset total cost
    const totalCost = document.getElementById('totalCost');
    if (totalCost) {
        totalCost.style.display = 'none';
    }
    
    // Reset option cards
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Reset Select2 if available
    if (typeof $ !== 'undefined' && $.fn.select2) {
        $('#department').val(null).trigger('change');
    }
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}


      // Show modal on page load
        window.addEventListener('load', function() {
            showModal();
        });

        function showModal() {
            const modal = document.getElementById('loginModal');
            const pageContent = document.getElementById('pageContent');
            
            modal.classList.remove('hidden');
            pageContent.classList.add('page-blur');
        }

        function closeModal() {
            // Redirect to main page
            window.location.href = '/landing/landing.html';
        }

        // Close modal when clicking outside of it
        document.getElementById('loginModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        
