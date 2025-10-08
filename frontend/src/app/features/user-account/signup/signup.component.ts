import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from '../../../models/field';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {

forms: FormGroup[] = [];

constructor(private agencyService: UserService) {}

// 🧍 Étape 1 — Informations personnelles
personalFields: Field[] = [
  { code: 'AUS_FIRSTNAME', label: 'Prénom', obligatoire: true, order: 1, type: 'T' },
  { code: 'AUS_LASTNAME', label: 'Nom', obligatoire: true, order: 2, type: 'T' },
  { code: 'AUS_PHONE', label: 'Téléphone', obligatoire: true, order: 3, type: 'R' },
  { code: 'AUS_SEXE', label: 'Sexe', obligatoire: false, order: 4, type: 'L', options: [
    { label: 'Homme', value: 'M' , order : 1},
    { label: 'Femme', value: 'F' , order : 2}
  ]},
  { code: 'AUS_EMAIL', label: 'Email', obligatoire: true, order: 5, type: 'T' },
  { code: 'AUS_ADDRESS', label: 'Adresse', obligatoire: false, order: 6, type: 'T' },
  { code: 'AUS_BIRTHDATE', label: 'Date de naissance', obligatoire: false, order: 7, type: 'D' }
];

// 💼 Étape 2 — Expériences professionnelles
experienceFields: Field[] = [
  { code: 'AUS_EDUCATION_LEVEL', label: 'Niveau d’éducation', obligatoire: false, order: 1, type: 'L', options: [
    { label: 'Licence', value: 'licence' , order : 1},
    { label: 'Master', value: 'master' , order: 2},
    { label: 'Doctorat', value: 'doctorat' , order : 3}
  ]},
  { code: 'AUS_INSURANCE_EXPERIENCE', label: 'Expérience en assurance (années)', obligatoire: false, order: 2, type: 'V' },
  { code: 'AUS_DIPLOMAS', label: 'Diplômes', obligatoire: false, order: 3, type: 'F' },
  { code: 'AUS_CERTIFICATES', label: 'Certificats', obligatoire: false, order: 4, type: 'F' }
];

// 🏢 Étape 3 — Informations sur l’agence
agencyFields: Field[] = [
  { code: 'AUS_HAS_LOCATION', label: 'Disposez-vous d’un local ?', obligatoire: true, order: 1, type: 'S' },
  { code: 'AUS_LOCATION_STATUS', label: 'Statut du local', obligatoire: false, order: 2, type: 'L', options: [
    { label: 'Propriétaire', value: 'proprietaire' , order : 1},
    { label: 'Locataire', value: 'locataire' , order : 2}
  ]},
  { code: 'AUS_WILAYA', label: 'Wilaya', obligatoire: true, order: 3, type: 'T' },
  { code: 'AUS_COMMUNE', label: 'Commune', obligatoire: true, order: 4, type: 'T' },
  { code: 'AUS_EXACT_ADDRESS', label: 'Adresse exacte', obligatoire: true, order: 5, type: 'T' }
];

// 🧠 Étape 4 — Questionnaire
questionnaireFields: Field[] = [
  { code: 'AUS_MOTIVATION', label: 'Motivation', obligatoire: true, order: 1, type: 'TTA' },
  { code: 'AUS_REASON_CHOICE', label: 'Raisons du choix de la région', obligatoire: false, order: 2, type: 'TTA' },
  { code: 'AUS_ROADMAP', label: 'Plan de développement (roadmap)', obligatoire: false, order: 3, type: 'TTA' },
  { code: 'AUS_RECRUITMENT_COUNT', label: 'Nombre de recrutements prévus', obligatoire: false, order: 4, type: 'TTA' },
  { code: 'AUS_ESTIMATED_REVENUE', label: 'Chiffre d’affaires estimé (DA)', obligatoire: false, order: 5, type: 'TTA' }
];

// 📊 Étape 5 — Business Plan (Années 1 à 3)
businessPlanFields: Field[] = [
  { code: 'AUS_BP_Y1_AUTO', label: 'Année 1 - Auto', obligatoire: false, order: 1, type: 'V' },
  { code: 'AUS_BP_Y1_SIMPLE_RISKS', label: 'Année 1 - Risques simples', obligatoire: false, order: 2, type: 'V' },
  { code: 'AUS_BP_Y1_FLEETS', label: 'Année 1 - Flottes', obligatoire: false, order: 3, type: 'V' },
  { code: 'AUS_BP_Y1_MULTIRISKS', label: 'Année 1 - Multirisques', obligatoire: false, order: 4, type: 'V' },
  { code: 'AUS_BP_Y2_AUTO', label: 'Année 2 - Auto', obligatoire: false, order: 5, type: 'V' },
  { code: 'AUS_BP_Y2_SIMPLE_RISKS', label: 'Année 2 - Risques simples', obligatoire: false, order: 6, type: 'V' },
  { code: 'AUS_BP_Y2_FLEETS', label: 'Année 2 - Flottes', obligatoire: false, order: 7, type: 'V' },
  { code: 'AUS_BP_Y2_MULTIRISKS', label: 'Année 2 - Multirisques', obligatoire: false, order: 8, type: 'V' },
  { code: 'AUS_BP_Y3_AUTO', label: 'Année 3 - Auto', obligatoire: false, order: 9, type: 'V' },
  { code: 'AUS_BP_Y3_SIMPLE_RISKS', label: 'Année 3 - Risques simples', obligatoire: false, order: 10, type: 'V' },
  { code: 'AUS_BP_Y3_FLEETS', label: 'Année 3 - Flottes', obligatoire: false, order: 11, type: 'V' },
  { code: 'AUS_BP_Y3_MULTIRISKS', label: 'Année 3 - Multirisques', obligatoire: false, order: 12, type: 'V' }
];

onStepFormReady(form: FormGroup, index: number) {
  this.forms[index] = form;
}

onSubmit() {
  const fullFormData = this.forms.reduce((acc, fg) => ({ ...acc, ...fg.value }), {});
  console.log('📤 Données envoyées:', fullFormData);

  this.agencyService.addUser(fullFormData).subscribe({
    next: (res) => {
      console.log('✅ Enregistré avec succès', res);
      alert(`Demande enregistrée avec succès (Référence: ${res.data?.reference || 'N/A'})`);
    },
    error: (err) => {
      console.error('❌ Erreur:', err);
      alert('Erreur lors de l’envoi du formulaire.');
    }
  });
}
}
