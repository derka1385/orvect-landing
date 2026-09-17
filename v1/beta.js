(() => {
  const form = document.querySelector('[data-beta-form]');
  if (!form) return;
  const fields = form.querySelector('[data-company-fields]');
  const individual = form.querySelector('[data-individual-message]');
  const status = form.querySelector('[data-form-status]');
  const radios = [...form.querySelectorAll('input[name="profile"]')];
  const companyInputs = [...fields.querySelectorAll('input, textarea, select')];
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
    const french = document.documentElement.lang === 'fr';
    ['name', 'company', 'reason'].forEach(name => {
      const input = form.elements[name];
      input.setCustomValidity(input.value.trim() ? '' : (french ? 'Veuillez renseigner ce champ.' : 'Please complete this field.'));
    });
    const siret = form.elements.siret;
    const digits = siret.value.replace(/\s/g, '');
    siret.setCustomValidity(!digits || /^\d{14}$/.test(digits) ? '' : (french ? 'Le SIRET doit contenir 14 chiffres, ou être laissé vide.' : 'Enter 14 digits for the SIRET, or leave it blank.'));
  };
  companyInputs.forEach(input => input.addEventListener('input', () => { input.setCustomValidity(''); status.textContent = ''; }));

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (form.elements.profile.value !== 'company') return;
    validate();
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = document.documentElement.lang === 'fr' ? 'Veuillez renseigner les champs obligatoires avant de préparer votre candidature.' : 'Please complete the required fields before preparing your application.';
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
    status.textContent = document.documentElement.lang === 'fr' ? 'Votre application e-mail devrait maintenant être ouverte avec votre candidature prête à envoyer.' : 'Your email app should now be open with your application ready to send.';
  });
})();
