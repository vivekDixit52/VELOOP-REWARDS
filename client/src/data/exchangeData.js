/** Static copy for the Exchange Center. Exchange values themselves come from the server (server/src/config.js). */

export const howExchangeSteps = [
  { id: 'earn', icon: 'gem', title: 'Earn Gems', text: 'Complete activities.' },
  { id: 'choose', icon: 'list', title: 'Choose', text: 'Pick a conversion.' },
  { id: 'review', icon: 'search', title: 'Review', text: 'Check the details.' },
  { id: 'confirm', icon: 'shield', title: 'Confirm', text: 'Approve the exchange.' },
  { id: 'receive', icon: 'coins', title: 'Receive VEs', text: 'Added instantly.' },
];

export const exchangeRules = [
  'Only eligible Gems can be exchanged.',
  'Exchange rates are predefined by VELOOP Rewards.',
  'Available conversions may vary.',
  'A successful conversion cannot be duplicated.',
  'Your balance is updated after a successful conversion.',
  'Platform rules apply.',
];

export const infoTips = {
  gems: { label: 'Gems', title: 'What are Gems?', text: 'Gems are reward credits earned through eligible activities on VELOOP Rewards.' },
  ves: { label: 'VEs', title: 'What are VEs?', text: "VEs are VELOOP Rewards' virtual reward currency and may be used for eligible redemption options according to platform rules." },
  rate: { label: 'exchange rate', title: 'How conversions are valued', text: 'Each conversion has a fixed value set by VELOOP Rewards. You receive exactly the VEs shown.' },
  rules: { label: 'exchange rules', title: 'About exchange rules', text: 'These rules apply to every conversion. Platform rules apply.' },
};
