import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password must be less than 100 characters');

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

export const phoneSchema = z
  .string()
  .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
  .optional()
  .or(z.literal(''));

export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .optional()
  .or(z.literal(''));

// Profile validation schemas
export const profileUpdateSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  phone: phoneSchema,
  avatar_url: urlSchema,
});

// Auth validation schemas
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  userType: z.enum(['learner', 'tutor']),
});

// Booking validation schemas
export const bookingSchema = z.object({
  tutor_id: z.string().uuid(),
  skill_id: z.string().uuid(),
  lesson_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  duration_hours: z.number().min(0.5).max(8),
  lesson_type: z.enum(['online', 'in-person']),
  location: z.string().optional(),
  notes: z.string().max(500).optional(),
});

// Message validation schema
export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
});

// Skill validation schema
export const tutorSkillSchema = z.object({
  skill_id: z.string().uuid(),
  hourly_rate: z.number().min(1, 'Rate must be at least R1').max(10000, 'Rate too high'),
  description: z.string().max(200, 'Description too long').optional(),
});

// Form validation helpers
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { _form: 'Validation failed' } };
  }
};