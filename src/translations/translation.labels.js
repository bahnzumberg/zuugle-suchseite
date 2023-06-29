import { useTranslation } from 'react-i18next';

const labels_privacy = {
  datenschutzerklaerung: '...',
  datenschutz_ist_uns_wichtig: '...',
  welche_personenbezogenen_daten: '...',
  keine_personenbezogenen_daten: '...',
  analysedienst: '...',
  welcher_dienst: '...',
  matomo_1: '...',
  matomo_2: '...',
  welche_daten: '...',
  abgespeichert_werden: '...',
  cookies: '...',
  cookies_erklaerung1: '...',
  cookies_erklaerung2: '...',
  mit_wem_daten_teilen: '...',
  mit_niemandem: '...',
  wie_lange_daten_speichern: '...',
  cookie_verfall_drei_monate: '...',
  welche_rechte: '...',
  nichts_von_dir_abspeichern: '...'
}

export const getPrivacyLabels = () => {
  const {t} = useTranslation();
 let labels = [];

  Object.keys(labels_privacy).forEach(key => {
    labels[key] = t(`privacy.${key}`)
  })

  return labels;
}

const labels_impressum = {
  verantwortlich_fuer_inhalt: '...',
  spendenkonto: '...',
  kontakt: '...',
  vereinsvorstand: '...',
  ziel_und_ausrichtung: '...',
  non_profit_org1: '...',
  // und:'...',
  // betreiben:'...',
  non_profit_org2: '...',
  haftung_inhalte: '...',
  beschreibungen_fotos: '...' ,
  haftung_fuer_links: '...',
  verknuepfung_links: '...',
  lizenzbedingungen: '...',
  anfuehrung_quellen: '...',
  hier: '...',
  angeführt: '...',
}

export const getImpressumLabels = () => {
  const {t} = useTranslation();
  let labels = [];

  Object.keys(labels_impressum).forEach(key => {
    labels[key] = t(`impressum.${key}`)
  })

  return labels;
}

const labels_about = {
  was_ist_zuugle: '...',
  zuugle_erklaerung_1: '...',
  zuugle_erklaerung_2: '...',
  zuugle_erklaerung_3: '...',
  wie_und_wofuer: '...',
  nutzen: '...',
  entwicklung_von_zuugle_1: '...',
  entwicklung_von_zuugle_2:'...',
  entwicklung_von_zuugle_3:'...',
  entwicklung_von_zuugle_4:'...',
  entwicklung_von_zuugle_5:'...',
  link_zur_fb:'...',
  user_group:'...',
}

export const getAboutLabels =()=> {
  const{t} =useTranslation();
  let labels = [];

  Object.keys(labels_about).forEach(key => {
    labels[key] = t(`about.${key}`)
  })

  return labels;
}

const labels_details = {

  keine_anreise_gefunden : '...',
  schwierigkeit_zuugle : '...',
  schwierigkeit_original : '...',
  sportart : '...',
  distanz : '...',
  dauer : '...',
  tage : '...',
  aufstieg : '...',
  abstieg : '...',
  kinderfreundlich : '...',
  ueberschreitung : '...',
  ja : '...',
  nein : '...',
}

export const getDetailsLabels = ()=>{
  const{t} =useTranslation();
  let labels = [];

  Object.keys(labels_details).forEach(key => {
    labels[key] = t(`about.${key}`)
  })

  return labels;
}