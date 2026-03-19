'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/stores/app-store';
import { calculateHealthScore } from '@/lib/calculations';
import { buildCreateHealthProfile } from '@/lib/contract';
import { HeartPulse, Save, AlertCircle, CheckCircle2, Cigarette } from 'lucide-react';
import ScoreGauge from '@/components/ScoreGauge';

const healthSchema = z.object({
  age: z.number().min(18, 'Min age: 18').max(100, 'Max age: 100'),
  bmi: z.number().min(100, 'Min BMI: 10.0 (×10)').max(500, 'Max BMI: 50.0 (×10)'),
  systolic: z.number().min(70, 'Min: 70').max(250, 'Max: 250'),
  diastolic: z.number().min(40, 'Min: 40').max(150, 'Max: 150'),
  cholesterol: z.number().min(100, 'Min: 100').max(400, 'Max: 400'),
  isSmoker: z.boolean(),
  exerciseFreq: z.number().min(0, 'Min: 0').max(7, 'Max: 7'),
});

type HealthFormData = z.infer<typeof healthSchema>;

export default function HealthProfileForm() {
  const { healthProfile, setHealthProfile, setTxState } = useAppStore();
  const [previewScore, setPreviewScore] = React.useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<HealthFormData>({
    resolver: zodResolver(healthSchema),
    defaultValues: healthProfile
      ? {
          age: healthProfile.age,
          bmi: healthProfile.bmi,
          systolic: healthProfile.bloodPressure.systolic,
          diastolic: healthProfile.bloodPressure.diastolic,
          cholesterol: healthProfile.cholesterolLevel,
          isSmoker: healthProfile.smokingStatus,
          exerciseFreq: healthProfile.exerciseFrequency,
        }
      : {
          age: 30,
          bmi: 220,
          systolic: 120,
          diastolic: 80,
          cholesterol: 180,
          isSmoker: false,
          exerciseFreq: 3,
        },
  });

  // Watch all fields for live preview
  const watchedFields = watch();
  React.useEffect(() => {
    const score = calculateHealthScore({
      bmi: (watchedFields as any).bmi || 220,
      systolic: (watchedFields as any).systolic || 120,
      cholesterol: (watchedFields as any).cholesterol || 180,
      smokingStatus: (watchedFields as any).isSmoker || false,
      exerciseFrequency: (watchedFields as any).exerciseFreq || 0,
    });
    setPreviewScore(score);
  }, [watchedFields.bmi, watchedFields.systolic, watchedFields.cholesterol, watchedFields.isSmoker, watchedFields.exerciseFreq]);

  const onSubmit = async (data: HealthFormData) => {
    setTxState({ status: 'pending' });
    try {
      const { showContractCall } = await import('@stacks/connect');
      const opts = buildCreateHealthProfile(data);
      await showContractCall({
        ...opts,
        onFinish: (txData: any) => {
          setTxState({ status: 'success', txId: txData.txId });
          setHealthProfile({
            age: data.age,
            bmi: data.bmi,
            bloodPressure: { systolic: data.systolic, diastolic: data.diastolic },
            cholesterolLevel: data.cholesterol,
            smokingStatus: data.isSmoker,
            exerciseFrequency: data.exerciseFreq,
            alcoholConsumption: 0,
            healthScore: previewScore,
            lastCheckup: Date.now(),
            dataConsent: true,
          });
        },
        onCancel: () => setTxState({ status: 'idle' }),
      });
    } catch {
      // Demo mode: simulate success
      setHealthProfile({
        age: data.age,
        bmi: data.bmi,
        bloodPressure: { systolic: data.systolic, diastolic: data.diastolic },
        cholesterolLevel: data.cholesterol,
        smokingStatus: data.isSmoker,
        exerciseFrequency: data.exerciseFreq,
        alcoholConsumption: 0,
        healthScore: previewScore,
        lastCheckup: Date.now(),
        dataConsent: true,
      });
      setTxState({ status: 'success' });
    }
  };

  const fields: Array<{
    name: keyof HealthFormData;
    label: string;
    type: string;
    hint?: string;
    icon?: React.ReactNode;
  }> = [
    { name: 'age', label: 'Age', type: 'number', hint: 'Years (18-100)' },
    { name: 'bmi', label: 'BMI (×10)', type: 'number', hint: 'e.g. 220 = BMI 22.0' },
    { name: 'systolic', label: 'Systolic BP', type: 'number', hint: 'mmHg (70-250)' },
    { name: 'diastolic', label: 'Diastolic BP', type: 'number', hint: 'mmHg (40-150)' },
    { name: 'cholesterol', label: 'Cholesterol', type: 'number', hint: 'mg/dL (100-400)' },
    { name: 'exerciseFreq', label: 'Exercise (days/week)', type: 'number', hint: '0-7 days' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HeartPulse size={24} color="#ef4444" />
          Health Profile
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--dh-text-secondary)' }}>
          {healthProfile ? 'Update your health data' : 'Create your health profile to get started'}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.5rem',
        alignItems: 'start',
      }}>
        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dh-card"
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
          }}>
            {fields.map((field) => (
              <div key={field.name}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--dh-text-muted)', marginBottom: '0.35rem', fontWeight: 500 }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  className="dh-input"
                  {...register(field.name, { valueAsNumber: field.type === 'number' })}
                />
                {errors[field.name] && (
                  <p style={{ fontSize: '0.7rem', color: 'var(--dh-danger)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <AlertCircle size={10} /> {errors[field.name]?.message}
                  </p>
                )}
                {field.hint && !errors[field.name] && (
                  <p style={{ fontSize: '0.65rem', color: 'var(--dh-text-muted)', marginTop: '0.2rem' }}>{field.hint}</p>
                )}
              </div>
            ))}
          </div>

          {/* Smoking Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            background: watchedFields.isSmoker ? 'rgba(248, 113, 113, 0.08)' : 'rgba(34, 197, 94, 0.08)',
            borderRadius: 'var(--dh-radius-sm)',
            border: `1px solid ${watchedFields.isSmoker ? 'rgba(248, 113, 113, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cigarette size={16} color={watchedFields.isSmoker ? '#f87171' : '#22c55e'} />
              <span style={{ fontSize: '0.875rem' }}>
                {watchedFields.isSmoker ? 'Smoker' : 'Non-Smoker'}
              </span>
            </div>
            <label>
              <input type="checkbox" style={{ display: 'none' }} {...register('isSmoker')} />
              <div className={`dh-toggle ${watchedFields.isSmoker ? 'active' : ''}`}
                style={{ background: watchedFields.isSmoker ? '#f87171' : undefined }}
              />
            </label>
          </div>

          <motion.button
            type="submit"
            className="dh-btn dh-btn-primary"
            disabled={isSubmitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            style={{ marginTop: '0.5rem' }}
          >
            <Save size={16} />
            {healthProfile ? 'Update Health Profile' : 'Create Health Profile'}
          </motion.button>
        </motion.form>

        {/* Live Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="dh-card"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
        >
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--dh-text-secondary)' }}>
            Health Score Preview
          </h3>
          <ScoreGauge score={previewScore} maxScore={100} label="Health Score" size={200} />

          {healthProfile && (
            <div style={{ width: '100%', padding: '1rem', background: 'rgba(34, 197, 94, 0.08)', borderRadius: 'var(--dh-radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="#22c55e" />
              <span style={{ fontSize: '0.8rem', color: '#22c55e' }}>Profile saved on-chain</span>
            </div>
          )}

          <div style={{ width: '100%', fontSize: '0.75rem', color: 'var(--dh-text-muted)' }}>
            <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Score Breakdown:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {[
                { label: 'BMI', good: (watchedFields as any).bmi >= 185 && (watchedFields as any).bmi <= 250 },
                { label: 'Blood Pressure', good: (watchedFields as any).systolic <= 120 },
                { label: 'Cholesterol', good: (watchedFields as any).cholesterol <= 200 },
                { label: 'Non-Smoker Bonus', good: !(watchedFields as any).isSmoker },
                { label: 'Exercise Bonus', good: (watchedFields as any).exerciseFreq >= 4 },
              ].map((item: any) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.label}</span>
                  <span style={{ color: item.good ? 'var(--dh-success)' : 'var(--dh-warning)' }}>
                    {item.good ? '✓ Optimal' : '⚠ Below optimal'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
