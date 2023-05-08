import { useTranslation } from 'react-i18next';

const labels_privacy = {
  datenschutzerklaerung: '...',
  datenschutz_ist_uns_wichtig: '...',
  welche_personenbezogenen_daten: '...',
  keine_personenbezogenen_daten: '...',
  analysedienst: '...',
  welcher_dienst: '...',
  matomo_1: 'Wir setzen die Open Source Software {{matomo}} in der selbst-gehosteten Variante ein. Die Daten befinden sich daher auf einem Server in Deutschland in der EU.',
//   matomo_1: '...',
//   matomo_2: '...',
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

  Object.keys(labels_privacy).forEach(key => {
    labels_privacy[key] = t(`privacy.${key}`)
  })

  return labels_privacy;
}
