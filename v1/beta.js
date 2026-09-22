(() => {
  const form = document.querySelector('[data-beta-form]');
  if (!form) return;
  const fields = form.querySelector('[data-company-fields]');
  const individual = form.querySelector('[data-individual-message]');
  const status = form.querySelector('[data-form-status]');
  const radios = [...form.querySelectorAll('input[name="profile"]')];
  const companyInputs = [...fields.querySelectorAll('input, textarea, select')];
  const messages = {
    en:{field:'Please complete this field.',siret:'Enter 14 digits for the SIRET, or leave it blank.',incomplete:'Please complete the required fields before preparing your application.',sent:'Your email app should now be open with your application ready to send.'},
    fr:{field:'Veuillez renseigner ce champ.',siret:'Le SIRET doit contenir 14 chiffres, ou être laissé vide.',incomplete:'Veuillez renseigner les champs obligatoires avant de préparer votre candidature.',sent:'Votre application e-mail devrait maintenant être ouverte avec votre candidature prête à envoyer.'},
    sv:{field:'Fyll i det här fältet.',siret:'Ange 14 siffror för SIRET, eller lämna fältet tomt.',incomplete:'Fyll i de obligatoriska fälten innan du förbereder din ansökan.',sent:'Ditt e-postprogram bör nu vara öppet med din ansökan redo att skickas.'},
    de:{field:'Bitte füllen Sie dieses Feld aus.',siret:'Geben Sie 14 Ziffern für die SIRET-Nummer ein oder lassen Sie das Feld leer.',incomplete:'Bitte füllen Sie die Pflichtfelder aus, bevor Sie Ihre Bewerbung vorbereiten.',sent:'Ihr E-Mail-Programm sollte nun mit Ihrer versandfertigen Bewerbung geöffnet sein.'}
  };
  const t = key => (messages[document.documentElement.lang] || messages.en)[key];

  const updateProfile = () => {
    const isCompany = form.elements.profile.value === 'company';
    fields.hidden = !isCompany;
    individual.hidden = isCompany;
    companyInputs.forEach(input => input.disabled = !isCompany);
    status.textContent = '';
  };
  radios.forEach(radio => radio.addEventListener('change', updateProfile));
  updateProfile();

  const validate = () => {
    ['name', 'company', 'reason'].forEach(name => {
      const input = form.elements[name];
      input.setCustomValidity(input.value.trim() ? '' : t('field'));
    });
    const siret = form.elements.siret;
    const digits = siret.value.replace(/\s/g, '');
    siret.setCustomValidity(!digits || /^\d{14}$/.test(digits) ? '' : t('siret'));
  };
  companyInputs.forEach(input => input.addEventListener('input', () => { input.setCustomValidity(''); status.textContent = ''; }));

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (form.elements.profile.value !== 'company') return;
    validate();
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = t('incomplete');
      return;
    }
    const value = name => form.elements[name].value.trim();
    const lines = [
      'ORVECT beta programme application',
      '',
      `Name: ${value('name')}`,
      `Email: ${value('email')}`,
      `Company: ${value('company')}`,
      `SIRET: ${value('siret').replace(/\s/g, '') || 'Not provided'}`,
      `How they heard about ORVECT: ${value('source')}`,
      '',
      'Why they want to join:',
      value('reason')
    ];
    const subject = 'ORVECT — Beta programme application';
    window.location.href = `mailto:nolann.orvect@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    status.textContent = t('sent');
  });
})();
