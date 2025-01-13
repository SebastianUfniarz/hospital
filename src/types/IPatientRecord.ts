export interface IPatientRecord {
    id: number;
    diagnosis: string;
    recommendations?: string;
    performed_treatments?: string;
    diagnosis_date: string;
    patient_id: number;
    doctor_id: number;
}
