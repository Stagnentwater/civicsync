import { z } from "zod";

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number too long")
    .regex(/^\+?[0-9]+$/, "Invalid phone number format"),
});

export const otpSchema = z.object({
  phone: z
    .string()
    .min(10)
    .max(15)
    .regex(/^\+?[0-9]+$/),
  otp: z.string().length(6, "OTP must be 6 digits"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export const complaintSchema = z.object({
  department: z
    .string()
    .min(2, "Department is required")
    .max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description too long"),
  locality: z
    .string()
    .min(2, "Locality is required")
    .max(200, "Locality too long"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address too long"),
  landmark: z
    .string()
    .max(200, "Landmark too long")
    .optional()
    .default(""),
  pincode: z
    .string()
    .regex(/^[0-9]{6}$/, "Pincode must be 6 digits")
    .optional()
    .default(""),
});

export const complaintStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]),
});

export const payBillSchema = z.object({
  billId: z.string().min(1, "Bill ID is required"),
});

export const serviceBookingSchema = z.object({
  serviceType: z.enum(["GAS_CYLINDER", "WATER_TANKER", "NEW_WATER_CONNECTION", "NEW_GAS_CONNECTION"]),
  quantity: z.number().int().min(1).max(10).default(1),
  address: z.string().min(5, "Address is required").max(500),
  locality: z.string().max(200).optional().default(""),
  landmark: z.string().max(200).optional().default(""),
  pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits").optional().default(""),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const registerSchema = z.object({
  phone: z
    .string()
    .min(10)
    .max(15)
    .regex(/^\+?[0-9]+$/),
  name: z.string().min(2).max(100),
  otp: z.string().length(6),
});
