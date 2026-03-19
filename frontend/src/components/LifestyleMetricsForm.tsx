'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/stores/app-store';
import { calculateLifestyleScore } from '@/lib/calculations';
import { buildUpdateLifestyleMetrics } from '@/lib/contract';
import { Activity, Save, Footprints, Moon, Brain, Apple, Heart } from 'lucide-react';
import ScoreGauge from '@/components/ScoreGauge';

const lifestyleSchema = z.object({
  steps: z.number().min(0).max(50000),
  sleepHours: z.number().min(0).max(24),
  stress: z.number().min(1, 'Min: 1').max(10, 'Max: 10'),
  dietScore: z.number().min(1, 'Min: 1').max(100, 'Max: 100'),
  mentalScore: z.number().min(1, 'Min: 1').max(100, 'Max: 100'),
});

type LifestyleFormData = z.infer<typeof lifestyleSchema>;

export default function LifestyleMetricsForm() {
  const { lifestyleMetrics, setLifestyleMetrics, setTxState } = useAppStore();
  const [previewScore, setPreviewScore] = React.useState(0);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LifestyleFormData>({
    resolver: zodResolver(lifestyleSchema),
    defaultValues: lifestyleMetrics
      ? {
          steps: lifestyleMetrics.stepsPerDay,
          sleepHours: lifestyleMetrics.sleepHours,
          stress: lifestyleMetrics.stressLevel,
          dietScore: lifestyleMetrics.dietQualityScore,
          mentalScore: lifestyleMetrics.mentalHealthScore,
        }
      : { steps: 8000, sleepHours: 7, stress: 4, dietScore: 70, mentalScore: 70 },
  });

  const watchedFields = watch();
  React.useEffect(() => {
    const score = calculateLifestyleScore({
      stepsPerDay: (watchedFields as any).steps || 0,
      sleepHours: (watchedFields as any).sleepHours || 0,
      stressLevel: (watchedFields as any).stress || 5,
      dietScore: (watchedFields as any).dietScore || 50,
      mentalScore: (watchedFields as any).mentalScore || 50,
    });
    setPreviewScore(score);
  }, [watchedFields.steps, watchedFields.sleepHours, watchedFields.stress, watchedFields.dietScore, watchedFields.mentalScore]);

  const onSubmit = async (data: LifestyleFormData) => {
    setTxState({ status: 'pending' });
    try {
      const { showContractCall } = await import('@stacks/connect');
      const opts = buildUpdateLifestyleMetrics(data);
      await showContractCall({
        ...opts,
        onFinish: (txData: any) => {
          setTxState({ status: 'success', txId: txData.txId });
          saveMetrics(data);
        },
        onCancel: () => setTxState({ status: 'idle' }),
      });
    } catch {
      saveMetrics(data);
      setTxState({ status: 'success' });
    }
  };

  const saveMetrics = (data: LifestyleFormData) => {
    setLifestyleMetrics({
      stepsPerDay: data.steps,
      sleepHours: data.sleepHours,
      stressLevel: data.stress,
      dietQualityScore: data.dietScore,
      mentalHealthScore: data.mentalScore,
      socialActivityLevel: 50,
      preventiveCareAdherence: 75,
      lifestyleScore: previewScore,
    });
  };

  const SliderField = ({ name, label, min, max, icon, unit, color }: {
    name: keyof LifestyleFormData;
    label: string;
    min: number;
    max: number;
    icon: React.ReactNode;
    unit: string;
    color: string;
  }) => (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--dh-text-secondary)', fontWeight: 500 }}>
          {icon} {label}
        </label>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color }}>{watchedFields[name]} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        {...register(name, { valueAsNumber: true })}
        style={{
          width: '100%',
          height: 6,
          borderRadius: 3,
          appearance: 'none',
          background: `linear-gradient(to right, ${color} ${((watchedFields[name] - min) / (max - min)) * 100}%, var(--dh-bg-elevated) ${((watchedFields[name] - min) / (max - min)) * 100}%)`,
          outline: 'none',
          cursor: 'pointer',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--dh-text-muted)', marginTop: '0.25rem' }}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={24} color="#22c55e" />
          Lifestyle Metrics
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--dh-text-secondary)' }}>
          Track your daily habits to improve your wellness score
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.5rem',
        alignItems: 'start',
      }}>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dh-card"
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
        >
          <SliderField name="steps" label="Steps Per Day" min={0} max={30000} icon={<Footprints size={16} />} unit="steps" color="#38bdf8" />
          <SliderField name="sleepHours" label="Sleep Hours" min={0} max={12} icon={<Moon size={16} />} unit="hrs" color="#818cf8" />
          <SliderField name="stress" label="Stress Level" min={1} max={10} icon={<Brain size={16} />} unit="/10" color="#f59e0b" />
          <SliderField name="dietScore" label="Diet Quality" min={1} max={100} icon={<Apple size={16} />} unit="/100" color="#22c55e" />
          <SliderField name="mentalScore" label="Mental Health" min={1} max={100} icon={<Heart size={16} />} unit="/100" color="#ec4899" />

          {Object.keys(errors).length > 0 && (
            <p style={{ fontSize: '0.75rem', color: 'var(--dh-danger)', marginTop: '0.5rem' }}>
              Please ensure all fields are valid
            </p>
          )}

          <motion.button
            type="submit"
            className="dh-btn dh-btn-primary"
            disabled={isSubmitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            style={{ marginTop: '0.5rem' }}
          >
            <Save size={16} />
            Save Lifestyle Metrics
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
            Lifestyle Score Preview
          </h3>
          <ScoreGauge score={previewScore} maxScore={100} label="Lifestyle Score" size={200} />

          <div style={{ width: '100%', fontSize: '0.75rem', color: 'var(--dh-text-muted)' }}>
            <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Wellness Breakdown:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {[
                { label: '🚶 Steps', good: (watchedFields as any).steps >= 8000, text: (watchedFields as any).steps >= 8000 ? '8k+ target met' : 'Below 8k target' },
                { label: '😴 Sleep', good: (watchedFields as any).sleepHours >= 7 && (watchedFields as any).sleepHours <= 9, text: ((watchedFields as any).sleepHours >= 7 && (watchedFields as any).sleepHours <= 9) ? '7-9hrs optimal' : 'Outside optimal' },
                { label: '🧠 Stress', good: (watchedFields as any).stress <= 3, text: (watchedFields as any).stress <= 3 ? 'Low stress' : 'Elevated stress' },
                { label: '🥗 Diet', good: (watchedFields as any).dietScore >= 70, text: `${(watchedFields as any).dietScore}/100` },
                { label: '💚 Mental', good: (watchedFields as any).mentalScore >= 70, text: `${(watchedFields as any).mentalScore}/100` },
              ].map((item: any) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.label}</span>
                  <span style={{ color: item.good ? 'var(--dh-success)' : 'var(--dh-warning)' }}>
                    {item.text}
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
